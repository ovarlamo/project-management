import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { loginThunk } from "../features/auth/authSlice";

export function LoginPage() {
  const dispatch = useDispatch();
  const { user, error, loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("admin@pms.local");
  const [password, setPassword] = useState("admin123");

  if (user) return <Navigate to="/projects" replace />;

  const submit = async (e) => {
    e.preventDefault();
    await dispatch(loginThunk({ email, password }));
  };

  return (
    <div className="auth-card">
      <h1>Вход</h1>
      <form onSubmit={submit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Пароль"
          required
        />
        <button disabled={loading} type="submit">
          Войти
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
