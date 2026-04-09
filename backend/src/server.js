import { app } from './app.js';
import { env } from './config/env.js';
import { initApp } from './bootstrap.js';

async function bootstrap() {
  await initApp();
import bcrypt from 'bcryptjs';
import { app } from './app.js';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import { User } from './models/User.js';

async function ensureAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@pms.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, fullName: 'System Administrator', passwordHash, isAdmin: true });
    console.log(`Seeded admin user: ${email} / ${password}`);
  }
}

async function bootstrap() {
  await connectDb();
  await ensureAdmin();

  app.listen(env.port, () => {
    console.log(`Backend is running at http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
