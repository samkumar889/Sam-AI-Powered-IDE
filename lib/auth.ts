import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'samai-secret-key-2024',
    { expiresIn: '30d' }
  )
}

export function verifyToken(token: string): { userId: string } {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'samai-secret-key-2024'
    ) as { userId: string }
  } catch {
    throw new Error('Invalid or expired token')
  }
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete('auth_token')
}