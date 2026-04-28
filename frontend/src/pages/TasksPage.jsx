import { useEffect, useState } from 'react';
import { EditDialog } from '../components/EditDialog';
import { Loader } from '../components/Loader';
import { api } from '../services/api';
import { ALL_TASKS_STATUS_OPTION, DEFAULT_TASK_STATUS, TASK_STATUS_LABELS, TASK_STATUS_OPTIONS } from '../constants/taskStatus';

export function TasksPage() {
  // Основные коллекции страницы:
  // tasks — карточки задач, projects — справочник для фильтра/форм.
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  // Глобальный флаг загрузки для отображения Loader и предотвращения "мигания" UI.
  const [isLoading, setIsLoading] = useState(false);
  // Фильтры связаны с query-параметрами backend endpoint /tasks.
  const [filters, setFilters] = useState({ projectId: '', status: '' });
  // form — состояние формы создания новой задачи.
  const [form, setForm] = useState({ title: '', description: '', projectId: '', type: 'TASK', status: DEFAULT_TASK_STATUS });
  // editingTask определяет режим редактирования (null = диалог закрыт).
  const [editingTask, setEditingTask] = useState(null);
  // editForm намеренно отделен от исходного task,
  // чтобы изменения в диалоге были локальными до нажатия "Сохранить".
  const [editForm, setEditForm] = useState({ title: '', description: '', projectId: '', type: 'TASK', status: DEFAULT_TASK_STATUS });

  // Загружаем проекты один раз для выпадающих списков.
  const loadProjects = async () => setProjects(await api.get('/projects?status='));
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      // Формируем query string из текущих фильтров.
      const params = new URLSearchParams(filters);
      setTasks(await api.get(`/tasks?${params.toString()}`));
    } finally {
      // finally гарантирует выключение индикатора даже при ошибке запроса.
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Инициализационный запрос справочников при первом рендере.
    loadProjects();
  }, []);
  useEffect(() => {
    // Реактивная перезагрузка списка при смене фильтров.
    loadTasks();
  }, [filters]);

  const create = async (e) => {
    e.preventDefault();
    // Создаем задачу из состояния формы и затем синхронизируем список.
    await api.post('/tasks', form);
    // Сброс формы к значениям по умолчанию для следующего ввода.
    setForm({ title: '', description: '', projectId: '', type: 'TASK', status: DEFAULT_TASK_STATUS });
    loadTasks();
  };

  const startEdit = (task) => {
    // Предзаполняем поля актуальными данными задачи.
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || '',
      // Поддерживаем оба формата: populated object или голый ObjectId.
      projectId: task.projectId?._id || task.projectId,
      type: task.type,
      status: task.status
    });
  };

  const closeEdit = () => {
    // Полный сброс состояния диалога при закрытии.
    setEditingTask(null);
    setEditForm({ title: '', description: '', projectId: '', type: 'TASK', status: DEFAULT_TASK_STATUS });
  };

  const saveEdit = async () => {
    // Обновляем задачу и затем перечитываем список с сервера,
    // чтобы UI всегда отражал источник истины (backend).
    await api.put(`/tasks/${editingTask._id}`, editForm);
    closeEdit();
    loadTasks();
  };

  const comment = async (id) => {
    // Минимальный UX-компромисс: prompt позволяет быстро оставить комментарий
    // без отдельной формы/модального окна.
    const text = prompt('Комментарий');
    if (!text) return;
    await api.post(`/tasks/${id}/comments`, { text });
    loadTasks();
  };

  const removeTask = async (id) => {
    const confirmed = window.confirm('Удалить задачу? Это действие нельзя отменить.');
    if (!confirmed) return;
    await api.del(`/tasks/${id}`);
    loadTasks();
  };

  return (
    <section>
      <h2>Задачи</h2>
      <div className="toolbar">
        {/* Панель фильтров: изменение любого селекта меняет состояние filters,
            что автоматически триггерит useEffect(loadTasks). */}
        <select value={filters.projectId} onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}>
          <option value="">Все проекты</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value={ALL_TASKS_STATUS_OPTION.value}>{ALL_TASKS_STATUS_OPTION.label}</option>
          {TASK_STATUS_OPTIONS.map((statusOption) => (
            <option key={statusOption.value} value={statusOption.value}>{statusOption.label}</option>
          ))}
        </select>
      </div>
      <form onSubmit={create} className="card form-grid">
        {/* Форма создания управляемая: значение каждого поля полностью контролируется React-state. */}
        <input required placeholder="Заголовок" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea required placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select required value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
          <option value="">Проект</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <button type="submit">Создать</button>
      </form>
      {isLoading ? (
        <Loader label="Загружаем задачи..." />
      ) : (
        <div className="list">
          {/* Рендерим карточки задач только после успешной загрузки. */}
          {tasks.map((task) => (
            <article key={task._id} className="card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Статус: {TASK_STATUS_LABELS[task.status] ?? task.status}</p>
              <p>Проект: {task.projectId?.name || '-'}</p>
              <p>Комментарии: {task.comments?.length || 0}</p>
              {task.comments?.length > 0 && (
                <div>
                  {task.comments.map((item, index) => (
                    <p key={`${task._id}-comment-${index}`}>
                      • {item.text} ({new Date(item.createdAt).toLocaleString('ru-RU')})
                    </p>
                  ))}
                </div>
              )}
              <div className="icon-actions">
                <button type="button" className="icon-button" aria-label="Редактировать задачу" title="Редактировать задачу" onClick={() => startEdit(task)}>✏️</button>
                <button type="button" className="icon-button" aria-label="Добавить комментарий" title="Добавить комментарий" onClick={() => comment(task._id)}>💬</button>
                <button type="button" className="icon-button" aria-label="Удалить задачу" title="Удалить задачу" onClick={() => removeTask(task._id)}>🗑️</button>
              </div>
            </article>
          ))}
        </div>
      )}
      <EditDialog
        title="Редактирование задачи"
        open={Boolean(editingTask)}
        onClose={closeEdit}
        onSave={saveEdit}
      >
        <input
          required
          placeholder="Заголовок"
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
        />
        <textarea
          required
          placeholder="Описание"
          value={editForm.description}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
        />
        <select
          required
          value={editForm.projectId}
          onChange={(e) => setEditForm({ ...editForm, projectId: e.target.value })}
        >
          <option value="">Проект</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
          {TASK_STATUS_OPTIONS.map((statusOption) => (
            <option key={statusOption.value} value={statusOption.value}>{statusOption.label}</option>
          ))}
        </select>
      </EditDialog>
    </section>
  );
}
