import { app } from '../src/app.js';
import { initApp } from '../src/bootstrap.js';

export default async function handler(req, res) {
  await initApp();
  return app(req, res);
}
