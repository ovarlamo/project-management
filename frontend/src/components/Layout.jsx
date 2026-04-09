import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutThunk } from '../features/auth/authSlice';

export function Layout() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = async () => {
    await dispatch(logoutThunk());
    navigate('/login');
  };

  return (
    <div>
      <header className="topbar">
        <Link to="/projects" className="logo">PMS</Link>
        <nav>
          <NavLink to="/projects">Проекты</NavLink>
          <NavLink to="/tasks">Задачи</NavLink>
          {user?.isAdmin && <NavLink to="/users">Пользователи</NavLink>}
          <NavLink to="/search">Поиск</NavLink>
        </nav>
        <div className="profile">
          <span>{user?.fullName}</span>
          <button onClick={logout}>Выход</button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
