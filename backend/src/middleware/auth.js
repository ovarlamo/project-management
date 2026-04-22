import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function requireAuth(req, res, next) {
  // По архитектуре проекта токен хранится в HttpOnly cookie.
  // Это снижает риск кражи токена через XSS по сравнению с localStorage.
  const token = req.cookies.token;

  if (!token) {
    // 401 = пользователь не аутентифицирован.
    // Формат ответа унифицирован для удобной обработки на фронтенде.
    return res.status(401).json({ success: false, error: { message: 'Unauthorized', status: 401 } });
  }

  try {
    // verify одновременно проверяет подпись и срок действия токена.
    // Распакованный payload сохраняем в req.user, чтобы downstream-слои
    // (контроллеры/сервисы) могли использовать id и роль пользователя.
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    // Любая ошибка валидации токена трактуется как неавторизованный доступ.
    return res.status(401).json({ success: false, error: { message: 'Invalid token', status: 401 } });
  }
}

export function requireAdmin(req, res, next) {
  // Авторизация уровня роли: доступ только администраторам.
  // req.user формируется предыдущим middleware requireAuth.
  if (!req.user?.isAdmin) {
    return res.status(403).json({ success: false, error: { message: 'Forbidden', status: 403 } });
  }
  next();
}
