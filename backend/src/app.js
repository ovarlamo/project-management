import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

export const app = express();

// CORS настраивается централизованно, чтобы фронтенд мог работать с cookie-сессией
// (credentials: true), а браузер не блокировал запросы из другого origin.
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
// Отдельно включаем preflight-обработку для всех путей.
// Это важно для методов PUT/PATCH/DELETE, которые браузер обычно проверяет заранее.
app.options("*", cors());
// Парсинг JSON-тел запросов до маршрутов (иначе req.body будет undefined).
app.use(express.json());
// Cookie parser нужен для чтения JWT из req.cookies.token в requireAuth.
app.use(cookieParser());

// Health-check endpoint: используется хостингом/оркестратором для проверки,
// что процесс живой и приложение готово принимать запросы.
app.get("/api/health", (req, res) => {
  res.json({ success: true, data: "ok" });
});

// Роуты разделены по bounded contexts:
// - auth: публичный вход/регистрация;
// - projects/users/tasks/search: рабочие API, доступные только после аутентификации.
app.use("/api/auth", authRoutes);
app.use("/api/projects", requireAuth, projectRoutes);
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/tasks", requireAuth, taskRoutes);
app.use("/api/search", requireAuth, searchRoutes);

// Единый обработчик ошибок подключается последним в цепочке middleware,
// чтобы перехватывать все ошибки, проброшенные через next(err).
app.use(errorHandler);
