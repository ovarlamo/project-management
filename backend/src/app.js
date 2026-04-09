import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', requireAuth, projectRoutes);
app.use('/api/users', requireAuth, userRoutes);
app.use('/api/tasks', requireAuth, taskRoutes);
app.use('/api/search', requireAuth, searchRoutes);

app.use(errorHandler);
