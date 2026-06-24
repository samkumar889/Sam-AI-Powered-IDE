
import { prisma } from '@/lib/prisma'

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function createUser(userData: { name: string; email: string; password: string }) {
  return prisma.user.create({
    data: userData
  })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } })
}

