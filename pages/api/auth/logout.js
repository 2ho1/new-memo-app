import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 쿠키에서 토큰 제거
    res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0')
    
    res.status(200).json({ message: '로그아웃되었습니다' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: '로그아웃 중 오류가 발생했습니다' })
  }
}
