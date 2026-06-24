import "dotenv/config";
import { prisma } from "../lib/prisma.js";

async function testConnection() {
  console.log("🧪 Testing database connection...");
  try {
    await prisma.$connect();
    console.log("✅ Successfully connected to the database!");
    
    const versionResult = await prisma.$queryRaw`SELECT version() AS version` as any[];
    console.log(`📊 PostgreSQL version: ${versionResult[0].version}`);
    
    await prisma.$disconnect();
    console.log("🔌 Disconnected from database");
  } catch (err) {
    console.error("❌ Failed to connect to database:", (err as Error).message);
    process.exit(1);
  }
}

testConnection();
