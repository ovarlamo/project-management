import { app } from '../src/app.js';
import { initApp } from '../src/bootstrap.js';

export default async function handler(req, res) {
  await initApp();
import { connectDb } from '../src/config/db.js';

let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    await connectDb();
    initialized = true;
  }

  return app(req, res);
}
