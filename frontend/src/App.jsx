import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { meThunk } from './features/auth/authSlice';
import { LoginPage } from './pages/LoginPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TasksPage } from './pages/TasksPage';
import { UsersPage } from './pages/UsersPage';
import { SearchPage } from './pages/SearchPage';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(meThunk());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={(
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          )}
        >
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/users" element={<ProtectedRoute adminOnly><UsersPage /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
