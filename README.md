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

## Запуск локально
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

## Деплой на Vercel (frontend + backend)
Рекомендуется создать **2 отдельных проекта в Vercel** из одного репозитория:

### A. Backend проект (Root Directory = `backend`)
1. Create Project → выбрать репозиторий → `Root Directory: backend`.
2. Framework Preset: **Other**.
3. Vercel использует `backend/vercel.json` и entrypoint `backend/api/index.js`.
4. Добавить переменные окружения:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=1d`
   - `CLIENT_URL=https://<frontend-domain>.vercel.app`
   - `COOKIE_SECURE=true`
   - `SEED_ADMIN_EMAIL` (опционально)
   - `SEED_ADMIN_PASSWORD` (опционально)
5. Задеплоить и сохранить URL backend, например: `https://pms-api.vercel.app`.

### B. Frontend проект (Root Directory = `frontend`)
1. Create Project → тот же репозиторий → `Root Directory: frontend`.
2. Framework Preset: **Vite**.
3. Добавить переменную:
   - `VITE_API_URL=https://pms-api.vercel.app/api`
4. Задеплоить.

### C. Проверка после деплоя
- Открыть frontend URL.
- Войти под seeded-админом (`admin@pms.local` / `admin123`, если не переопределяли).
- Проверить, что cookie авторизации работает (вкладка Application → Cookies).

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
