import bcrypt from 'bcryptjs';
import { connectDb } from './config/db.js';
import { User } from './models/User.js';

let initialized = false;

async function ensureAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@pms.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, fullName: 'System Administrator', passwordHash, isAdmin: true });
    console.log(`Seeded admin user: ${email}`);
  }
}

export async function initApp() {
  if (initialized) return;

  await connectDb();
  await ensureAdmin();
  initialized = true;
}
