import { useEffect, useState } from 'react';
import { EditDialog } from '../components/EditDialog';
import { Loader } from '../components/Loader';
import { api } from '../services/api';
import {
  ALL_PROJECTS_STATUS_OPTION,
  DEFAULT_PROJECT_STATUS,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_OPTIONS
} from '../constants/projectStatus';

export function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState(DEFAULT_PROJECT_STATUS);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', status: DEFAULT_PROJECT_STATUS });
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', status: DEFAULT_PROJECT_STATUS });

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await api.get(`/projects?status=${status}`);
      setProjects(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/projects', form);
    setForm({ name: '', description: '', status: DEFAULT_PROJECT_STATUS });
    load();
  };

  const startEdit = (project) => {
    setEditingProject(project);
    setEditForm({
      name: project.name,
      description: project.description || '',
      status: project.status
    });
  };

  const closeEdit = () => {
    setEditingProject(null);
    setEditForm({ name: '', description: '', status: DEFAULT_PROJECT_STATUS });
  };

  const saveEdit = async () => {
    await api.put(`/projects/${editingProject._id}`, editForm);
    closeEdit();
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
          {PROJECT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
          <option value={ALL_PROJECTS_STATUS_OPTION.value}>{ALL_PROJECTS_STATUS_OPTION.label}</option>
        </select>
      </div>
      <form onSubmit={create} className="card form-grid">
        <input
          required
          placeholder="Название"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {PROJECT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <button type="submit">Создать</button>
      </form>
      {isLoading ? (
        <Loader label="Загружаем проекты..." />
      ) : (
        <div className="list">
          {projects.map((project) => (
            <article key={project._id} className="card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p>{PROJECT_STATUS_LABELS[project.status] ?? project.status}</p>
              <button type="button" onClick={() => startEdit(project)}>Редактировать</button>
              <button type="button" onClick={() => remove(project._id)}>Удалить</button>
            </article>
          ))}
        </div>
      )}
      <EditDialog
        title="Редактирование проекта"
        open={Boolean(editingProject)}
        onClose={closeEdit}
        onSave={saveEdit}
      >
        <input
          required
          placeholder="Название"
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
        />
        <input
          placeholder="Описание"
          value={editForm.description}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
        />
        <select
          value={editForm.status}
          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
        >
          {PROJECT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </EditDialog>
    </section>
  );
}
