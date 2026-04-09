import { app } from "./app.js";
import { env } from "./config/env.js";
import { initApp } from "./bootstrap.js";
import { connectDb } from "./config/db.js";

async function bootstrap() {
  await initApp();
  app.listen(env.port, () => {
    console.log(`Backend is running at http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
