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

## Готовый чеклист кликов в интерфейсе Vercel

Ниже сценарий «в лоб» без CLI, только через UI Vercel.

### 1) Создать backend-проект
1. Откройте `https://vercel.com/dashboard`.
2. Нажмите **Add New...** → **Project**.
3. В блоке **Import Git Repository** выберите ваш репозиторий и нажмите **Import**.
4. На экране **Configure Project**:
   - В поле **Project Name** задайте, например, `pms-backend`.
   - В поле **Framework Preset** выберите **Other**.
   - Раскройте **Root Directory** → укажите `backend`.
5. Откройте секцию **Environment Variables** и добавьте по одному:
   - `MONGO_URI` = `<ваш Mongo URI>`
   - `JWT_SECRET` = `<длинный секрет>`
   - `JWT_EXPIRES_IN` = `1d`
   - `CLIENT_URL` = `https://<frontend-project>.vercel.app`
   - `COOKIE_SECURE` = `true`
   - `SEED_ADMIN_EMAIL` = `admin@pms.local` (или ваш)
   - `SEED_ADMIN_PASSWORD` = `<ваш пароль>`
6. Нажмите **Deploy**.
7. После завершения нажмите **Visit** и скопируйте URL backend, например `https://pms-backend.vercel.app`.

### 2) Создать frontend-проект
1. Снова: **Add New...** → **Project**.
2. Выберите тот же репозиторий → **Import**.
3. На экране **Configure Project**:
   - **Project Name**: например, `pms-frontend`.
   - **Framework Preset**: **Vite**.
   - **Root Directory**: `frontend`.
4. В **Environment Variables** добавьте:
   - `VITE_API_URL` = `https://pms-backend.vercel.app/api`
5. Нажмите **Deploy**.
6. Нажмите **Visit** и откройте frontend URL.

### 3) Обновить backend CORS (если домен frontend изменился)
1. Откройте проект `pms-backend` в Vercel.
2. Вкладка **Settings** → **Environment Variables**.
3. Найдите `CLIENT_URL` → **Edit**.
4. Вставьте точный URL frontend (`https://...vercel.app`) → **Save**.
5. Перейдите во вкладку **Deployments**.
6. У последнего деплоя нажмите меню **⋯** → **Redeploy** → **Redeploy**.

### 4) Проверка работы
1. Откройте frontend URL.
2. Войдите под админом (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).
3. Откройте DevTools → **Application** → **Cookies** и убедитесь, что есть cookie `token`.
4. Проверьте страницы:
   - `/projects`
   - `/tasks`
   - `/users` (только для админа)
   - `/search`

### 5) Где смотреть ошибки
- Backend: проект `pms-backend` → **Functions** → нужный вызов → **Logs**.
- Frontend: проект `pms-frontend` → **Deployments** → последний деплой → **Runtime Logs** / **Build Logs**.

## Troubleshooting Vercel: `Found invalid Node.js Version: "24.x"`
Если в Vercel появляется ошибка про `24.x`, установите в проекте Vercel:

1. **Settings** → **General**.
2. Блок **Node.js Version**.
3. Выберите **20.x**.
4. Нажмите **Save**.
5. Перейдите в **Deployments** → **Redeploy**.

В репозитории версия также зафиксирована через `engines.node = "20.x"` и `.nvmrc`.

## Проверка backend после деплоя
1. Откройте `https://<backend-domain>/api/health` — должен вернуться JSON `{ "success": true, "data": "ok" }`.
2. Проверьте логин запросом:
   - `POST https://<backend-domain>/api/auth/login`
   - body: `{ "email": "admin@pms.local", "password": "admin123" }`
3. Если ответ `Invalid email or password`, откройте Vercel **Functions → Logs** и проверьте, есть ли строка `Seeded admin user:`.

> Важно: и для локального запуска, и для Vercel теперь используется единая инициализация (`initApp`), которая выполняет подключение к БД и сидинг администратора.

## Troubleshooting: `401 Unauthorized` на `/api/projects` после успешного логина
Причина может быть в cookie `token`: если у cookie неверный `Path`, браузер отправляет её только на часть роутов.

Что исправлено в проекте:
- cookie авторизации теперь выставляется с `path: '/'`;
- logout очищает cookie с тем же `path: '/'`.

После деплоя backend:
1. Выйдите из аккаунта.
2. Очистите cookies для frontend/backend домена.
3. Войдите снова.
4. Проверьте в DevTools → Application → Cookies, что у `token` стоит `Path=/`.
