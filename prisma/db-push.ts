import "dotenv/config";
import { $ } from "zx";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

async function pushDb() {
  console.log("📡 Pushing database schema...");
  
  try {
    await $`cd ${projectRoot}`;
    await $`npx prisma db push --url=${process.env.DATABASE_URL}`;
    console.log("✅ Successfully pushed database schema!");
  } catch (err) {
    console.error("❌ Failed to push database schema", err);
    process.exit(1);
  }
}

pushDb();
