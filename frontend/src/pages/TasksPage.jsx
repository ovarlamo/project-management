import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ projectId: '', status: '' });
  const [form, setForm] = useState({ title: '', description: '', projectId: '', type: 'TASK', status: 'NEW' });

  const loadProjects = async () => setProjects(await api.get('/projects?status='));
  const loadTasks = async () => {
    const params = new URLSearchParams(filters);
    setTasks(await api.get(`/tasks?${params.toString()}`));
  };

  useEffect(() => { loadProjects(); }, []);
  useEffect(() => { loadTasks(); }, [filters]);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/tasks', form);
    setForm({ title: '', description: '', projectId: '', type: 'TASK', status: 'NEW' });
    loadTasks();
  };

  const comment = async (id) => {
    const text = prompt('Комментарий');
    if (!text) return;
    await api.post(`/tasks/${id}/comments`, { text });
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
          <option value="">Все статусы</option>
          {['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <form onSubmit={create} className="card form-grid">
        <input required placeholder="Заголовок" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea required placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select required value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
          <option value="">Проект</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="TASK">TASK</option>
          <option value="FEATURE">FEATURE</option>
        </select>
        <button type="submit">Создать</button>
      </form>
      <div className="list">
        {tasks.map((task) => (
          <article key={task._id} className="card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>{task.status} · {task.type}</p>
            <p>Проект: {task.projectId?.name || '-'}</p>
            <p>Комментарии: {task.comments?.length || 0}</p>
            <button onClick={() => comment(task._id)}>Добавить комментарий</button>
          </article>
        ))}
      </div>
    </section>
  );
}
