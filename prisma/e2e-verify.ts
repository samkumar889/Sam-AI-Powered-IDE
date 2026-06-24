import "dotenv/config";
import { prisma } from "../lib/prisma.js";

// Define types for the report
type StepResult = {
  step: string;
  status: "✅" | "⚠️" | "❌";
  details: string;
  data?: any;
  error?: string;
};

const report: StepResult[] = [];

function addStep(step: string, status: "✅" | "⚠️" | "❌", details: string, data?: any, error?: string) {
  report.push({ step, status, details, data, error });
}

async function runVerification() {
  console.log("\n🔍 Starting E2E Verification...\n");

  // Step 1: Verify DATABASE_URL
  console.log("📋 Step 1: Verify DATABASE_URL is set");
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    addStep("1. DATABASE_URL Check", "✅", `DATABASE_URL configured!`);
  } else {
    addStep("1. DATABASE_URL Check", "❌", "DATABASE_URL not set in .env");
    return;
  }

  // Step 2: Test Prisma Connection
  console.log("🧪 Step 2: Test Prisma connection to database");
  let connectionOk = false;
  try {
    await prisma.$connect();
    connectionOk = true;
    addStep("2. Prisma Connection", "✅", "Prisma successfully connected to the database!");
  } catch (err) {
    addStep("2. Prisma Connection", "❌", "Connection failed", null, (err as Error).message);
    return;
  }

  // Step 3: Check tables
  console.log("📋 Step 3: Check database state");
  try {
    // Try to query user count first
    try {
      const usersCount = await prisma.user.count();
      addStep("3. Table Query Test", "✅", "Database tables exist!");
    } catch (err) {
      addStep("3. Table Query Test", "⚠️", "Tables might not be migrated yet! Run 'npm run db:migrate'", null, (err as Error).message);
    }
  } finally {
    // Cleanup
    await prisma.$disconnect();
  }
}

runVerification().then(() => {
  console.log("\n" + "=".repeat(60));
  console.log("📊 VERIFICATION REPORT 📊");
  console.log("=".repeat(60));
  console.log();

  let hasFails = false;
  report.forEach(item => {
    console.log(`${item.status} ${item.step}`);
    console.log(`   ${item.details}`);
    if (item.error) console.log(`   ❌ Error: ${item.error}`);
    if (item.data) console.log(`   ℹ️  Data: ${JSON.stringify(item.data, null, 2)}`);
    console.log();
    if (item.status === "❌") hasFails = true;
  });

  if (hasFails) {
    console.log("⚠️ Some steps failed!");
  } else {
    console.log("✅ Verification complete! All tests passed!");
  }
  console.log("=".repeat(60));
}).catch((e) => {
  console.error("\n❌ Verification failed unexpectedly:", e);
  process.exit(1);
});
