# 📊 SAM AI - Database Schema (PostgreSQL + pgvector)

Here is the Prisma schema for the SAM AI database:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User Model
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String
  password    String
  createdAt   DateTime @default(now())
  projects    Project[]
  @@map("users")
}

// Project Model
model Project {
  id          String        @id @default(cuid())
  name        String
  description String?
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  files       File[]
  chatMessages ChatMessage[]
  createdAt   DateTime      @default(now())
  @@map("projects")
}

// File Model
model File {
  id         String       @id @default(cuid())
  name       String
  path       String
  content    String
  type       String
  projectId  String
  project    Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt  DateTime     @default(now())
  @@map("files")
}

// Chat Message Model
model ChatMessage {
  id        String   @id @default(cuid())
  role      String   // "user" or "assistant"
  content   String
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@map("chat_messages")
}

// Agent Task Model
model AgentTask {
  id        String   @id @default(cuid())
  status    String   // "pending", "in-progress", "completed", "failed"
  type      String   // "analyze-codebase", "generate-code", "refactor", etc.
  input     String
  result    String?
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@map("agent_tasks")
}

// Code Index Model for pgvector (Semantic Search)
model CodeIndex {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  fileId    String
  filePath  String
  content   String
  embedding Unsupported("vector(1536)") // OpenAI embedding dimension
  @@map("code_indices")
}
```
