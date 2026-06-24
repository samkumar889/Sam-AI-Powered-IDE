# 🚀 SAM AI - AI-Powered Coding IDE

A modern, AI-powered coding environment with chat, Monaco code editor, file explorer, terminal, and more!

## 📚 Architecture Documentation

- [📁 Folder Structure](./docs/folder-structure.md)
- [📊 Database Schema](./docs/database-schema.md)
- [🔌 API Architecture](./docs/api-architecture.md)
- [🏗️ System Architecture](./docs/system-architecture.md)
- [📅 Development Roadmap](./docs/development-roadmap.md)

## ✨ Features

### 🎨 UI Components
- **Left Sidebar**: Projects, Files, Search, Git
- **Center Panel**: Monaco Code Editor with tabs
- **Right Panel**: AI Chat interface
- **Bottom Panel**: Terminal, Logs, Output
- **Modern Dark Theme**: Professional developer experience
- **Resizable Panels**: Coming soon!

### 🛠️ Core Features
- **File Explorer**: Browse and manage project files
- **Monaco Editor**: Professional code editor (VS Code engine)
- **AI Chat**: Interact with SAM AI for coding assistance
- **Terminal**: Built-in terminal emulator
- **State Management**: Zustand for global state

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
samai/
├── app/                    # Next.js app directory
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/             # React components
│   ├── Sidebar.tsx         # Left sidebar
│   ├── CodeEditor.tsx      # Monaco editor
│   ├── ChatPanel.tsx       # AI chat
│   └── BottomPanel.tsx     # Terminal/logs
├── docs/                   # Architecture documentation
├── store/                  # Zustand state management
│   └── useAppStore.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🛠️ Tech Stack

**Frontend**:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Monaco Editor (@monaco-editor/react)
- Zustand (state management)
- Lucide React (icons)

**Planned Backend:
- Node.js + Express
- PostgreSQL + pgvector
- Prisma ORM

## 📝 License

MIT
