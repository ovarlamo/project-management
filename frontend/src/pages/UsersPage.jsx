import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', fullName: '', password: '', isAdmin: false });

  const load = async () => setUsers(await api.get('/users'));
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
      <div className="list">
        {users.map((user) => (
          <article key={user._id} className="card">
            <h3>{user.fullName}</h3>
            <p>{user.email}</p>
            <p>{user.isAdmin ? 'Administrator' : 'User'}</p>
            <button onClick={() => remove(user._id)}>Удалить</button>
          </article>
        ))}
      </div>
    </section>
  );
}
