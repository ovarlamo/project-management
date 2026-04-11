import { useState } from 'react';
import { Loader } from '../components/Loader';
import { api } from '../services/api';

export function SearchPage() {
  const [q, setQ] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({ projects: [], tasks: [], users: [] });

  const search = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await api.get(`/search?q=${encodeURIComponent(q)}`);
      setResult(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h2>Глобальный поиск</h2>
      <form onSubmit={search} className="toolbar">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Введите запрос" />
        <button type="submit">Поиск</button>
      </form>
      {isLoading ? (
        <Loader label="Ищем совпадения..." />
      ) : (
        <div className="grid-3">
          <div className="card"><h3>Проекты</h3>{result.projects.map((x) => <p key={x._id}>{x.name}</p>)}</div>
          <div className="card"><h3>Задачи</h3>{result.tasks.map((x) => <p key={x._id}>{x.title}</p>)}</div>
          <div className="card"><h3>Пользователи</h3>{result.users.map((x) => <p key={x._id}>{x.email}</p>)}</div>
        </div>
      )}
    </section>
  );
}
