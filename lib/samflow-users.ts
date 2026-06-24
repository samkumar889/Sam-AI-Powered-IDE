
// Shared in-memory user store for demo purposes
const users = new Map<string, { id: string; name: string; email: string; password: string }>()

// Add a demo user for testing!
users.set('demo-1', {
  id: 'demo-1',
  name: 'Demo User',
  email: 'demo@samflow.ai',
  password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyW52T5u5bWy', // "password123"
})

export function getUserByEmail(email: string) {
  for (const user of users.values()) {
    if (user.email === email) {
      return user
    }
  }
  return null
}

export function createUser(userData: { name: string; email: string; password: string }) {
  const userId = Date.now().toString()
  const newUser = {
    id: userId,
    ...userData,
  }
  users.set(userId, newUser)
  return newUser
}

export function getUserById(id: string) {
  return users.get(id) || null
}

