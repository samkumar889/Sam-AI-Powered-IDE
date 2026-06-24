# 🔌 SAM AI - API Architecture

## REST API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Files
- `GET /api/projects/:projectId/files` - List project files
- `POST /api/projects/:projectId/files` - Create file
- `GET /api/projects/:projectId/files/:id` - Get file
- `PUT /api/projects/:projectId/files/:id` - Update file
- `DELETE /api/projects/:projectId/files/:id` - Delete file

### Chat
- `GET /api/projects/:projectId/chat` - Get chat messages
- `POST /api/projects/:projectId/chat` - Send chat message
- `POST /api/projects/:projectId/chat/generate` - Generate AI response

### Agent
- `POST /api/projects/:projectId/agent/tasks` - Start agent task
- `GET /api/projects/:projectId/agent/tasks` - List agent tasks
- `GET /api/projects/:projectId/agent/tasks/:id` - Get task status

### Git
- `GET /api/projects/:projectId/git/status` - Get git status
- `POST /api/projects/:projectId/git/commit` - Create commit
- `GET /api/projects/:projectId/git/branch` - List/Create branches

### Code Search
- `POST /api/projects/:projectId/search` - Semantic search in codebase
