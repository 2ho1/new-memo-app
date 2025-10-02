import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

// 메모 고정/해제
export async function PATCH(
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

    // 고정 상태 토글
    const memo = await prisma.memo.update({
      where: { id },
      data: { isPinned: !existingMemo.isPinned },
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
    console.error('Pin memo error:', error)
    return NextResponse.json(
      { error: '메모 고정 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
