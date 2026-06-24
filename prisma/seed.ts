import "dotenv/config";
import { prisma } from "../lib/prisma.js";

async function main() {
  console.log("🌱 Starting to seed the database...");

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: "test@samai.ai",
      password: "hashedpassword",
      name: "Test User",
      avatarUrl: null,
      role: "USER",
      plan: "FREE",
    },
  });

  console.log("✅ Created user:", user.email);

  // Create user preferences
  const prefs = await prisma.userPreferences.create({
    data: {
      userId: user.id,
      theme: "dark",
      language: "en",
      timezone: "UTC",
      fontSize: 16,
      emailNotifications: true,
      pushNotifications: false,
    },
  });

  console.log("✅ Created user preferences");

  // Create a test project
  const project = await prisma.project.create({
    data: {
      name: "SAM AI Test Project",
      description: "A test project for SAM AI",
      status: "IN_PROGRESS",
      ownerId: user.id,
    },
  });

  console.log("✅ Created project:", project.name);

  // Create a conversation
  const conv = await prisma.conversation.create({
    data: {
      title: "First Conversation",
      userId: user.id,
      projectId: project.id,
    },
  });

  console.log("✅ Created conversation:", conv.title);

  // Create some chat messages
  await prisma.chatMessage.create({
    data: {
      conversationId: conv.id,
      content: "Hello SAM AI!",
      role: "user",
    },
  });
  await prisma.chatMessage.create({
    data: {
      conversationId: conv.id,
      content: "Hello! How can I help you today?",
      role: "assistant",
      model: "gpt-4o",
    },
  });

  console.log("✅ Created chat messages");

  // Create agent memory entries
  await prisma.agentMemory.create({
    data: {
      userId: user.id,
      projectId: project.id,
      key: "test-memory",
      value: {
        type: "decision",
        content: "User likes dark theme",
      },
      type: "preference",
    },
  });
  await prisma.agentMemory.create({
    data: {
      userId: user.id,
      projectId: project.id,
      key: "arch-memory",
      value: {
        type: "architecture",
        stack: ["React"],
        layout: "Grid",
      },
      type: "architecture",
    },
  });

  console.log("✅ Created agent memories");

  // Create a deployment
  const dep = await prisma.deployment.create({
    data: {
      name: "Test Deployment",
      projectId: project.id,
      userId: user.id,
      provider: "VERCEL",
      status: "SUCCESS",
      url: "https://test-deployment.vercel.app",
    },
  });

  console.log("✅ Created deployment:", dep.name);

  console.log("🌱 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
