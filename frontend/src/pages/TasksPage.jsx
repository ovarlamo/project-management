import { useEffect, useState } from 'react';
import { EditDialog } from '../components/EditDialog';
import { Loader } from '../components/Loader';
import { api } from '../services/api';
import { ALL_TASKS_STATUS_OPTION, DEFAULT_TASK_STATUS, TASK_STATUS_LABELS, TASK_STATUS_OPTIONS } from '../constants/taskStatus';

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ projectId: '', status: '' });
  const [form, setForm] = useState({ title: '', description: '', projectId: '', type: 'TASK', status: DEFAULT_TASK_STATUS });
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', projectId: '', type: 'TASK', status: DEFAULT_TASK_STATUS });

  const loadProjects = async () => setProjects(await api.get('/projects?status='));
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(filters);
      setTasks(await api.get(`/tasks?${params.toString()}`));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);
  useEffect(() => {
    loadTasks();
  }, [filters]);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/tasks', form);
    setForm({ title: '', description: '', projectId: '', type: 'TASK', status: DEFAULT_TASK_STATUS });
    loadTasks();
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || '',
      projectId: task.projectId?._id || task.projectId,
      type: task.type,
      status: task.status
    });
  };

  const closeEdit = () => {
    setEditingTask(null);
    setEditForm({ title: '', description: '', projectId: '', type: 'TASK', status: DEFAULT_TASK_STATUS });
  };

  const saveEdit = async () => {
    await api.put(`/tasks/${editingTask._id}`, editForm);
    closeEdit();
    loadTasks();
  };

  const comment = async (id) => {
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
              <button type="button" onClick={() => startEdit(task)}>Редактировать</button>
              <button type="button" onClick={() => comment(task._id)}>Добавить комментарий</button>
              <button type="button" onClick={() => removeTask(task._id)}>Удалить</button>
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
