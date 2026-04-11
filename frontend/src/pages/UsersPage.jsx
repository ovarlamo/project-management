import { useEffect, useState } from 'react';
import { EditDialog } from '../components/EditDialog';
import { Loader } from '../components/Loader';
import { api } from '../services/api';

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: '', fullName: '', password: '', isAdmin: false });
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', isAdmin: false, password: '' });

  const load = async () => {
    setIsLoading(true);
    try {
      setUsers(await api.get('/users'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/users', form);
    setForm({ email: '', fullName: '', password: '', isAdmin: false });
    load();
  };

  const remove = async (id) => {
    await api.del(`/users/${id}`);
    load();
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setEditForm({ fullName: user.fullName, isAdmin: user.isAdmin, password: '' });
  };

  const saveEdit = async () => {
    if (!editingUser) return;
    await api.put(`/users/${editingUser._id}`, {
      fullName: editForm.fullName,
      isAdmin: editForm.isAdmin
    });

    if (editForm.password.trim()) {
      await api.patch(`/users/${editingUser._id}/password`, { password: editForm.password });
    }

    setEditingUser(null);
    setEditForm({ fullName: '', isAdmin: false, password: '' });
    load();
  };

  return (
    <section>
      <h2>Пользователи</h2>
      <form onSubmit={create} className="card form-grid">
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required placeholder="ФИО" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input required type="password" placeholder="Пароль" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label><input type="checkbox" checked={form.isAdmin} onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })} /> Админ</label>
        <button type="submit">Создать</button>
      </form>
      {isLoading ? (
        <Loader label="Загружаем пользователей..." />
      ) : (
        <div className="list">
          {users.map((user) => (
            <article key={user._id} className="card">
              <h3>{user.fullName}</h3>
              <p>{user.email}</p>
              <p>{user.isAdmin ? 'Administrator' : 'User'}</p>
              <button onClick={() => startEdit(user)}>Редактировать</button>
              <button onClick={() => remove(user._id)}>Удалить</button>
            </article>
          ))}
        </div>
      )}
      <EditDialog
        title="Редактирование пользователя"
        open={Boolean(editingUser)}
        onClose={() => setEditingUser(null)}
        onSave={saveEdit}
      >
        <input
          required
          placeholder="ФИО"
          value={editForm.fullName}
          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
        />
        <input
          type="password"
          placeholder="Новый пароль (необязательно)"
          value={editForm.password}
          onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={editForm.isAdmin}
            onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
          />{' '}
          Админ
        </label>
      </EditDialog>
    </section>
  );
}
