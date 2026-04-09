import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('ACTIVE');
  const [form, setForm] = useState({ name: '', description: '', status: 'ACTIVE' });

  const load = async () => {
    const data = await api.get(`/projects?status=${status}`);
    setProjects(data);
  };

  useEffect(() => { load(); }, [status]);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/projects', form);
    setForm({ name: '', description: '', status: 'ACTIVE' });
    load();
  };

  const remove = async (id) => {
    await api.del(`/projects/${id}`);
    load();
  };

  return (
    <section>
      <h2>Проекты</h2>
      <div className="toolbar">
        <label>Статус:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="ARCHIVED">ARCHIVED</option>
          <option value="">ALL</option>
        </select>
      </div>
      <form onSubmit={create} className="card form-grid">
        <input required placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
        <button type="submit">Создать</button>
      </form>
      <div className="list">
        {projects.map((project) => (
          <article key={project._id} className="card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p>{project.status}</p>
            <button onClick={() => remove(project._id)}>Удалить</button>
          </article>
        ))}
      </div>
    </section>
  );
}
