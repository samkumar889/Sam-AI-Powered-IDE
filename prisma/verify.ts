import "dotenv/config";
import { prisma } from "../lib/prisma.js";

async function verifyDatabase() {
  console.log("\n🔍 VERIFICATION REPORT\n");
  
  // Check users
  const usersCount = await prisma.user.count();
  const users = await prisma.user.findMany({
    include: {
      preferences: true,
      projects: true,
      conversations: true,
    },
  });
  console.log(`✅ Users: ${usersCount} total`);
  users.forEach((u) =>
    console.log(
      `   - ${u.name} (${u.email}), Preferences: ${
        u.preferences ? "Set" : "Not set"
      }, Projects: ${u.projects.length}, Conversations: ${u.conversations.length}`
    )
  );

  // Check projects
  const projectsCount = await prisma.project.count();
  const projects = await prisma.project.findMany({
    include: {
      deployments: true,
      agentMemories: true,
    },
  });
  console.log(`\n✅ Projects: ${projectsCount} total`);
  projects.forEach((p) =>
    console.log(
      `   - ${p.name} (${p.status}), Deployments: ${p.deployments.length}, Agent Memories: ${p.agentMemories.length}`
    )
  );

  // Check conversations & messages
  const conversationsCount = await prisma.conversation.count();
  const messagesCount = await prisma.chatMessage.count();
  console.log(`\n✅ Conversations: ${conversationsCount}, Chat Messages: ${messagesCount}`);

  // Check agent memories
  const memoriesCount = await prisma.agentMemory.count();
  console.log(`\n✅ Agent Memories: ${memoriesCount}`);

  // Check deployments
  const deploymentsCount = await prisma.deployment.count();
  console.log(`\n✅ Deployments: ${deploymentsCount}`);

  console.log("\n✨ Verification complete! Database is working properly.\n");
}

verifyDatabase()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Verification Failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
