# Project Management System (PMS)

Учебная веб-система управления проектами, реализованная по ТЗ 1.1 (React + Vite + Express + MongoDB + JWT cookie).

## Что реализовано (MVP)
- Авторизация по email/password, JWT в httpOnly cookie.
- Защищённые роуты и проверка роли администратора.
- CRUD проектов (soft-delete, фильтр по статусу, запрет удаления при активных задачах).
- CRUD пользователей (только админ, soft-delete, отдельная смена пароля endpoint).
- CRUD задач (soft-delete), подзадачи через `parentTaskId`, комментарии.
- Глобальный поиск по проектам/задачам/пользователям (пользователи видны только админу).
- Единый формат ошибок backend.

## Структура
- `backend/` — Express API + Mongoose.
- `frontend/` — React SPA + Redux Toolkit + React Router.

## Запуск
### 1) Установка
```bash
npm install
```

### 2) Конфигурация
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3) MongoDB
Запустите локальный MongoDB (по умолчанию `mongodb://127.0.0.1:27017/pms`).

### 4) Development
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Тестовый администратор
При первом запуске backend автоматически создаёт администратора:
- Email: `admin@pms.local`
- Password: `admin123`

Можно переопределить через `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

## API endpoints (основные)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/projects`
- `GET/POST/PUT/DELETE /api/tasks`
- `POST /api/tasks/:id/comments`
- `GET/POST/PUT/DELETE /api/users` (admin only)
- `PATCH /api/users/:id/password` (admin only)
- `GET /api/search?q=...`
