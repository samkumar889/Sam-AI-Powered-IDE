import "dotenv/config";
import { prisma } from "../lib/prisma.js";

console.log("=== PostgreSQL CRUD Test ===");

async function runCrud() {
  // 1. Create (POST)
  console.log("1. Creating test user...");
  const testUser = await prisma.user.create({
    data: {
      email: "crud-test@samai.ai",
      password: "crud-test-pass",
      name: "CRUD Test User",
    },
  });
  console.log("✅ Created user:", testUser.email);

  // 2. Read (GET)
  console.log("\n2. Reading test user...");
  const foundUser = await prisma.user.findUnique({
    where: { id: testUser.id },
  });
  console.log("✅ Read user:", foundUser?.email);

  // 3. Update (PUT)
  console.log("\n3. Updating user's name...");
  const updatedUser = await prisma.user.update({
    where: { id: testUser.id },
    data: { name: "Updated CRUD User" },
  });
  console.log("✅ Updated user's name to:", updatedUser.name);

  // 4. Test Agent Memory
  console.log("\n=== Agent Memory Test ===");
  const newMemory = await prisma.agentMemory.create({
    data: {
      userId: testUser.id,
      key: "reality-audit-test",
      value: { test: "data", timestamp: Date.now() },
      type: "test",
    },
  });
  console.log("✅ Created Agent Memory:", newMemory.key);

  const readMemory = await prisma.agentMemory.findUnique({
    where: { id: newMemory.id },
  });
  console.log("✅ Read Agent Memory:", readMemory?.key);

  // 5. Cleanup (DELETE)
  console.log("\n4. Cleaning up test records...");
  await prisma.agentMemory.delete({ where: { id: newMemory.id } });
  console.log("✅ Deleted Agent Memory");
  await prisma.user.delete({ where: { id: testUser.id } });
  console.log("✅ Deleted User");

  console.log("\n🎉 CRUD and Agent Memory Tests COMPLETED!");
  await prisma.$disconnect();
}

runCrud().catch(async (e) => {
  console.error("\n❌ Error in CRUD Tests:", e);
  await prisma.$disconnect();
  process.exit(1);
});

