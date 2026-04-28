import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="card">
      <h2>404 — Страница не найдена</h2>
      <p>Похоже, вы перешли по неверному адресу или страница была перемещена.</p>
      <p>
        Перейти на <Link to="/projects">главный раздел проектов</Link>.
      </p>
    </section>
  );
}
