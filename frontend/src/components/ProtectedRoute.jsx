import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, checked } = useSelector((state) => state.auth);

  if (!checked) return <div>Загрузка...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/projects" replace />;

  return children;
}
