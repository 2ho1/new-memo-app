import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../src/lib/prisma'
import { verifyToken } from '../../../src/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ error: '인증이 필요합니다' })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: '유효하지 않은 토큰입니다' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다' })
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: '사용자 정보를 가져오는 중 오류가 발생했습니다' })
  }
}
