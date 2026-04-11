import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader } from './Loader';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, checked } = useSelector((state) => state.auth);

  if (!checked) return <Loader label="Проверяем сессию..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/projects" replace />;

  return children;
}
