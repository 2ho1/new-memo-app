'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import Image from 'next/image'

export function Header() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image 
            src="/IMG_20251002_152257_495.png" 
            alt="MEMO-LOG Logo" 
            width={600} 
            height={240}
            className="h-24 w-auto"
            style={{ 
              backgroundColor: 'transparent',
              mixBlendMode: 'darken'
            }}
          />
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              안녕하세요, {user.name}님
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
