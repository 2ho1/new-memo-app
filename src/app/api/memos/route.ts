import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const createMemoSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  isPinned: z.boolean().optional()
})

// 인증된 사용자 확인 함수
async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return null
  }

  return decoded.userId
}

// 메모 목록 조회
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const memos = await prisma.memo.findMany({
      where: { userId },
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        content: true,
        isPinned: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ memos })
  } catch (error) {
    console.error('Get memos error:', error)
    return NextResponse.json(
      { error: '메모를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// 메모 생성
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, isPinned } = createMemoSchema.parse(body)

    const memo = await prisma.memo.create({
      data: {
        title,
        content,
        isPinned: isPinned || false,
        userId
      },
      select: {
        id: true,
        title: true,
        content: true,
        isPinned: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ memo }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Create memo error:', error)
    return NextResponse.json(
      { error: '메모 생성 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
