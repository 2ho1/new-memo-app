'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/LoginForm'
import { RegisterForm } from '@/components/RegisterForm'
import { MemoList } from '@/components/MemoList'
import { MemoForm } from '@/components/MemoForm'
import { Header } from '@/components/Header'

interface Memo {
  id: string
  title: string
  content: string
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const { user, loading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showMemoForm, setShowMemoForm] = useState(false)
  const [editingMemo, setEditingMemo] = useState<Memo | undefined>(undefined)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleToggleAuthMode = () => {
    setIsLogin(!isLogin)
  }

  const handleEditMemo = (memo: Memo) => {
    setEditingMemo(memo)
    setShowMemoForm(true)
  }

  const handleCreateMemo = () => {
    setEditingMemo(undefined)
    setShowMemoForm(true)
  }

  const handleCloseMemoForm = () => {
    setShowMemoForm(false)
    setEditingMemo(undefined)
  }

  const handleSaveMemo = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // 로그아웃 시 로그인 화면으로 이동
  useEffect(() => {
    if (!loading && !user) {
      setIsLogin(true)
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          {isLogin ? (
            <LoginForm onToggleMode={handleToggleAuthMode} />
          ) : (
            <RegisterForm onToggleMode={handleToggleAuthMode} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <MemoList
          onEditMemo={handleEditMemo}
          onCreateMemo={handleCreateMemo}
          refreshTrigger={refreshTrigger}
        />
      </main>
      
      {showMemoForm && (
        <MemoForm
          memo={editingMemo}
          onClose={handleCloseMemoForm}
          onSave={handleSaveMemo}
        />
      )}
    </div>
  )
}