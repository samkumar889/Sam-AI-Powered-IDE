# 🏗️ SAM AI - System Architecture

Here's a visual diagram of our system using Mermaid:

```mermaid
graph TB
    subgraph "Frontend (Next.js 15)"
        A[React UI Components]
        B[Zustand State Management]
        C[Monaco Editor]
        D[WebSocket Client]
    end

    subgraph "Backend (Node.js + Express)"
        E[API Routes]
        F[Controllers]
        G[Services]
        H[WebSocket Server]
    end

    subgraph "AI Layer"
        I[OpenAI/Anthropic API]
        J[Vector Search (pgvector)]
        K[Code Analysis]
    end

    subgraph "Database"
        L[(PostgreSQL)]
    end

    A --> B
    B --> D
    D <--> H
    E --> F
    F --> G
    G --> I
    G --> J
    G <--> L
    J --> L
```

## Key Components Explained

- **Frontend**: The user-facing application built using Next.js 15 with React, Tailwind CSS, and Monaco Editor.
- **Backend**: Express.js server handling all API requests, business logic, and WebSocket communication.
- **AI Layer**: Interfaces with OpenAI/Anthropic APIs for chat and code generation, and pgvector for semantic code search.
- **Database**: PostgreSQL for storing users, projects, files, chat messages, agent tasks, and vector embeddings.
