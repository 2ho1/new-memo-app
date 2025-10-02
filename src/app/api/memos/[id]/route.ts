import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const updateMemoSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').optional(),
  content: z.string().min(1, '내용을 입력해주세요').optional(),
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

// 개별 메모 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUser(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const { id } = await params

    const memo = await prisma.memo.findFirst({
      where: {
        id,
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

    if (!memo) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    return NextResponse.json({ memo })
  } catch (error) {
    console.error('Get memo error:', error)
    return NextResponse.json(
      { error: '메모를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// 메모 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUser(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const { id } = await params

    const body = await request.json()
    const updateData = updateMemoSchema.parse(body)

    // 메모가 존재하고 사용자 소유인지 확인
    const existingMemo = await prisma.memo.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!existingMemo) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    const memo = await prisma.memo.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        content: true,
        isPinned: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ memo })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Update memo error:', error)
    return NextResponse.json(
      { error: '메모 수정 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// 메모 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUser(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const { id } = await params

    // 메모가 존재하고 사용자 소유인지 확인
    const existingMemo = await prisma.memo.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!existingMemo) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    await prisma.memo.delete({
      where: { id }
    })

    return NextResponse.json({ message: '메모가 삭제되었습니다' })
  } catch (error) {
    console.error('Delete memo error:', error)
    return NextResponse.json(
      { error: '메모 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
