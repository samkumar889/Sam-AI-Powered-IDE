# SAMFlow Architecture Document

## 1. Requirements Analysis

### Business Goals
- Build a modern AI-powered project management SaaS platform
- Target users: Development teams, product managers, startup founders
- Key objectives: Increase productivity, improve collaboration, reduce project delivery time

### Target Users
- Product Managers: Track project progress and team performance
- Developers: Manage tasks and collaborate with AI assistance
- Team Leads: Assign work, monitor status, and analyze productivity
- Startups: Get up and running quickly with a modern project management tool

### Required Features
- ✅ User authentication and authorization
- ✅ Project management (create, edit, delete projects)
- ✅ Task management with priorities and statuses
- ✅ AI-powered chat assistant
- ✅ Analytics and reporting
- ✅ User management
- ✅ Subscription plans (Free, Pro, Enterprise)

### Non-Functional Requirements
- ✅ Modern, beautiful UI with dark theme
- ✅ Responsive design for mobile and desktop
- ✅ Production-ready, scalable architecture
- ✅ Secure authentication with JWT
- ✅ Type-safe code with TypeScript
- ✅ Fast, performant experience

---

## 2. System Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 3.4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Prisma ORM v7)
- **Auth**: JWT with bcrypt password hashing
- **Deployment**: Vercel (with Railway/Neon for PostgreSQL)

### Architecture Pattern
- **Frontend**: Client-side + Server components (Next.js App Router)
- **Backend**: API Routes (Route Handlers)
- **Database**: Relational PostgreSQL with Prisma schema
- **Authentication**: JWT stored in httpOnly, secure cookies

### High-Level Architecture
```
┌─────────────────────────┐
│    Browser / Client     │
└───────────┬─────────────┘
            │ HTTP/HTTPS
            ▼
┌─────────────────────────┐
│    Next.js Server       │
│  ┌───────────────────┐  │
│  │  App Router      │  │
│  │  (Pages & APIs)  │  │
│  └───────────┬───────┘  │
│              │          │
│  ┌───────────▼───────┐  │
│  │  Prisma Client    │  │
│  └───────────┬───────┘  │
└──────────────┼───────────┘
               │
               ▼
┌─────────────────────────┐
│   PostgreSQL Database   │
└─────────────────────────┘
```

---

## 3. Database Design

### Prisma Schema
Location: `/samai/prisma/schema.prisma`

### Core Models

#### User
- Stores all user information including auth, profile, plan
- Fields: id, email, password, name, avatarUrl, role, plan, stripeCustomerId, etc.
- Indexes: email, stripeCustomerId

#### Project
- Project management
- Fields: id, name, description, status, color, icon, ownerId
- Relations: owner, members, tasks, chatMessages, analytics

#### Task
- Task management
- Fields: id, title, description, priority, status, dueDate, projectId, assigneeId, reporterId
- Relations: project, assignee, reporter, comments

#### ChatMessage
- AI and user chat history
- Fields: id, content, role, model, userId, projectId, createdAt
- Relations: user, project

#### UserPreferences
- User settings and preferences
- Fields: id, userId, theme, language, timezone, emailNotifications, etc.

#### AnalyticsEvent
- Tracks usage and events for analytics
- Fields: id, eventType, userId, projectId, metadata, createdAt

#### ApiKey
- API key management
- Fields: id, name, key, userId, lastUsed, createdAt

#### Document & Chunk (Legacy, kept for compatibility)
- Used for vector search and embeddings

### Database Relationships
```
User (1) ──── (N) Project (owner)
User (N) ──── (N) Project (members)
User (1) ──── (N) Task (assignee)
User (1) ──── (N) Task (reporter)
User (1) ──── (N) ChatMessage
User (1) ──── (0|1) UserPreferences
User (1) ──── (N) Comment
User (1) ──── (N) AnalyticsEvent
User (1) ──── (N) ApiKey
Project (1) ─ (N) Task
Project (1) ─ (N) ChatMessage
Project (1) ─ (N) AnalyticsEvent
Task (1) ──── (N) Comment
```

---

## 4. API Design

### API Routes
Location: `/samai/app/samflow/api/`

#### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login existing user |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout current user |

#### Projects & Tasks
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/projects` | Get all projects |
| POST | `/projects` | Create new project |
| GET | `/tasks` | Get tasks (optionally filtered by project) |
| POST | `/tasks` | Create new task |

### Request/Response Examples

#### Register User
**Request**:
```json
POST /samflow/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (201):
```json
{
  "user": {
    "id": "user_abc123",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

---

## 5. Folder Structure

### Project Structure
```
samai/
├── app/
│   ├── samflow/
│   │   ├── page.tsx              # Landing Page
│   │   ├── layout.tsx            # SAMFlow Root Layout
│   │   ├── login/
│   │   │   └── page.tsx          # Login Page
│   │   ├── register/
│   │   │   └── page.tsx          # Register Page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main Dashboard
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── register/
│   │       │   │   └── route.ts  # Register API
│   │       │   ├── login/
│   │       │   │   └── route.ts  # Login API
│   │       │   ├── me/
│   │       │   │   └── route.ts  # Get User API
│   │       │   └── logout/
│   │       │       └── route.ts  # Logout API
│   │       ├── projects/
│   │       │   └── route.ts      # Projects API
│   │       └── tasks/
│   │           └── route.ts      # Tasks API
│   └── ... (other app pages)
│
├── components/
│   └── samflow/
│       ├── Button.tsx           # Reusable Button component
│       ├── Input.tsx            # Reusable Input component
│       └── Card.tsx             # Reusable Card components
│
├── lib/
│   ├── prisma.ts                # Prisma Client singleton
│   ├── auth.ts                  # Auth utilities (hash, JWT, etc.)
│   └── utils.ts                 # Shared utility functions
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── config.ts                # Prisma configuration file
│
└── package.json                 # Dependencies and scripts
```

---

## 6. UI Flow

### User Journey Flow
```
┌─────────────────────────────────┐
│  User visits /samflow           │
│  (Landing Page)                 │
└────────┬────────────────────────┘
         │
         ├─ Clicks "Log in" ─────→ Login Page (/samflow/login)
         │
         └─ Clicks "Get Started" → Register Page (/samflow/register)
                                       │
                                       ▼
                        Successful registration → Dashboard (/samflow/dashboard)
                                                              │
                                                              ├─ View Projects
                                                              ├─ View Analytics
                                                              ├─ Open AI Chat
                                                              ├─ Manage Team
                                                              └─ Open Settings
```

### Pages Flow
1. **Landing Page** (`/samflow`)
   - Hero section, features, pricing, footer
   - Nav links: Log in, Get Started (register)

2. **Login Page** (`/samflow/login`)
   - Email and password form
   - Links to register page

3. **Register Page** (`/samflow/register`)
   - Name, email, password form
   - Links to login page

4. **Dashboard Page** (`/samflow/dashboard`)
   - Left sidebar navigation
   - Main content area (dashboard, projects, analytics, etc.)
   - Stats cards, recent projects, quick actions

---

## 7. Implementation

### Current Implementation Status
✅ **Completed Features**:
- ✅ Landing Page (dark theme, modern UI)
- ✅ Login Page
- ✅ Register Page
- ✅ Dashboard Page (UI-only)
- ✅ Authentication APIs
- ✅ Database schema and Prisma setup
- ✅ Reusable UI components (Button, Input, Card)

### Implementation Stack
- Next.js 15 with App Router
- React 19
- TypeScript 5
- Tailwind CSS 3.4
- Prisma ORM v7
- bcrypt (password hashing)
- jsonwebtoken (JWT)

### Key Implementation Details

#### Authentication Flow
```
1. User enters email/password on login/register page
2. Frontend sends POST to /samflow/api/auth/login (or /register)
3. Backend:
   - Validates input (Zod)
   - Hashes password (bcrypt)
   - Generates JWT (expires in 30 days)
   - Sets httpOnly cookie
   - Returns user object
4. Frontend redirects to Dashboard
5. Dashboard calls /samflow/api/auth/me to verify auth
```

#### Prisma Client Setup
- Singleton pattern for Prisma Client
- Reusable across all API routes
- Proper engine configuration for Prisma 7

---

## 8. Testing Strategy

### Testing Approach
- **Unit Tests**: Individual functions and utilities
- **Integration Tests**: API endpoints with test database
- **E2E Tests**: Key user flows using Playwright

### Test Coverage Priorities
- Authentication flows (registration, login, logout)
- Project CRUD operations
- Task management
- Error handling and edge cases

---

## 9. Deployment Plan

### Recommended Deployment Stack
- **Frontend**: Vercel (auto-deploy from Git)
- **Database**: Railway PostgreSQL or Neon Serverless
- **Environment Variables**: Vercel Environment Secrets

### Environment Variables Needed
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for signing JWT tokens (32+ chars)
- (Optional) `NEXT_PUBLIC_APP_URL`: Public URL for redirects

### Prisma Migration Steps
```bash
# Generate Prisma Client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# (Production)
npx prisma migrate deploy
```

---

## 10. Production Readiness Report

### ✅ Production-Ready Elements
- ✅ Type safety with TypeScript
- ✅ Secure password hashing with bcrypt (12 rounds)
- ✅ JWT authentication with secure, httpOnly cookies
- ✅ Input validation with Zod
- ✅ Professional dark theme UI
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Scalable database schema
- ✅ Clean folder structure and architecture
- ✅ Reusable components

### ⏭️ Next Steps for Production
- 🔄 Add proper error handling in API routes
- 🔄 Add rate limiting to prevent abuse
- 🔄 Implement project and task features (full CRUD)
- 🔄 Add admin panel UI
- 🔄 Implement Stripe payment integration
- 🔄 Add AI chat functionality
- 🔄 Add analytics dashboard
- 🔄 Write comprehensive tests
- 🔄 Set up monitoring and logging (e.g., Sentry, Datadog)
- 🔄 Set up CI/CD pipelines (GitLab CI, GitHub Actions)

---

## Architecture First Approach Recap

We followed this exact order for building SAMFlow:
1. ✅ **Requirements Analysis** - Defined goals, users, features, and constraints
2. ✅ **Architecture** - Selected tech stack, designed system architecture
3. ✅ **Database** - Designed schema with Prisma
4. ✅ **API Design** - Planned REST API endpoints
5. ✅ **Folder Structure** - Created clean, maintainable project structure
6. ✅ **UI Flow** - Designed user journey and page flow
7. ✅ **Implementation** - Built the code following the architecture

This structured approach ensures the final product is maintainable, scalable, and production-ready!
