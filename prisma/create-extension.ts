import "dotenv/config";
import { prisma } from "../lib/prisma.js";

async function createExtension() {
  console.log("🔧 Installing pgvector extension...");
  try {
    await prisma.$connect();
    
    try {
      await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector;`;
      console.log("✅ pgvector extension installed!");
    } catch (err) {
      if ((err as Error).message.includes("already exists")) {
        console.log("ℹ️  pgvector extension already exists!");
      } else {
        throw err;
      }
    }
    
    await prisma.$disconnect();
  } catch (err) {
    console.error("❌ Failed to install pgvector extension", (err as Error).message);
    process.exit(1);
  }
}

createExtension();
