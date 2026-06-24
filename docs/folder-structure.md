# 📁 SAM AI - Folder Structure

```
sam-ai/
├── frontend/                     # Next.js 15 Frontend (App Router)
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── project/[projectId]/
│   │   │   │   ├── chat/
│   │   │   │   └── agent/
│   │   │   └── layout.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── BottomPanel.tsx
│   │   │   └── ResizablePanels.tsx
│   │   ├── editor/
│   │   │   ├── MonacoEditor.tsx
│   │   │   ├── FileExplorer.tsx
│   │   │   └── FileTabs.tsx
│   │   ├── chat/
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── AgentTasks.tsx
│   │   ├── git/
│   │   │   └── GitPanel.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── store/
│   │   ├── useAppStore.ts
│   │   ├── useChatStore.ts
│   │   └── useProjectStore.ts
│   ├── lib/
│   │   ├── api/
│   │   └── utils/
│   │   └── types/
│   └── public/
├── backend/                    # Node.js + Express Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── projectController.ts
│   │   │   ├── fileController.ts
│   │   │   ├── chatController.ts
│   │   │   ├── agentController.ts
│   │   │   └── gitController.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── projectRoutes.ts
│   │   │   ├── fileRoutes.ts
│   │   │   ├── chatRoutes.ts
│   │   │   ├── agentRoutes.ts
│   │   │   └── gitRoutes.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Project.ts
│   │   │   ├── File.ts
│   │   │   ├── ChatMessage.ts
│   │   │   ├── AgentTask.ts
│   │   │   └── CodeIndex.ts
│   │   ├── services/
│   │   │   ├── aiService.ts
│   │   │   ├── vectorService.ts
│   │   │   ├── gitService.ts
│   │   │   └── fileService.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   └── errorMiddleware.ts
│   │   ├── utils/
│   │   ├── config/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/
│   └── package.json
└── docker-compose.yml
```
