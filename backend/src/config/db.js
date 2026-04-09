import mongoose from 'mongoose';
import { env } from './env.js';

let connectionPromise;

export async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.mongoUri);
  }

  await connectionPromise;
  return mongoose.connection;
}
