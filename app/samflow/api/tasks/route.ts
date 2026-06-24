import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('auth_token')
    if (!cookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { userId } = verifyToken(cookie.value)
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    const where: any = {}
    if (projectId) {
      where.projectId = projectId
    } else {
      where.OR = [
        { project: { ownerId: userId } },
        { project: { members: { some: { id: userId } } } }
      ]
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
        reporter: { select: { id: true, name: true, email: true } },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ tasks }, { status: 200 })
  } catch (error) {
    console.error('Get tasks error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get('auth_token')
    if (!cookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { userId } = verifyToken(cookie.value)
    const body = await request.json()
    const { title, description, priority, dueDate, projectId, assigneeId } = body

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate,
        projectId,
        reporterId: userId,
        assigneeId,
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
        reporter: { select: { id: true, name: true, email: true } },
        _count: {
          select: { comments: true }
        }
      }
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}