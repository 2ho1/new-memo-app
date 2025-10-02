import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../src/lib/prisma'
import { verifyToken } from '../../src/lib/auth'
import { z } from 'zod'

const createMemoSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  isPinned: z.boolean().optional()
})

// 인증된 사용자 확인 함수
async function getAuthenticatedUser(req) {
  const token = req.cookies.token

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
export default async function handler(req, res) {
  try {
    const userId = await getAuthenticatedUser(req)
    
    if (!userId) {
      return res.status(401).json({ error: '인증이 필요합니다' })
    }

    if (req.method === 'GET') {
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

      return res.status(200).json({ memos })
    }

    if (req.method === 'POST') {
      const { title, content, isPinned } = createMemoSchema.parse(req.body)

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

      return res.status(201).json({ memo })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message })
    }

    console.error('Memos API error:', error)
    res.status(500).json({ error: '메모 처리 중 오류가 발생했습니다' })
  }
}
