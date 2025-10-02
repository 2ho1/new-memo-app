'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit, Plus, Pin, PinOff } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Memo {
  id: string
  title: string
  content: string
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

interface MemoListProps {
  onEditMemo: (memo: Memo) => void
  onCreateMemo: () => void
  refreshTrigger: number
}

export function MemoList({ 
  onEditMemo, 
  onCreateMemo, 
  refreshTrigger
}: MemoListProps) {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memoToDelete, setMemoToDelete] = useState<string | null>(null)

  const fetchMemos = async () => {
    try {
      const response = await fetch('/api/memos')
      if (response.ok) {
        const data = await response.json()
        setMemos(data.memos)
      }
    } catch (error) {
      console.error('Failed to fetch memos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (memoId: string) => {
    try {
      const response = await fetch(`/api/memos/${memoId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setMemos(memos.filter(memo => memo.id !== memoId))
        setDeleteDialogOpen(false)
        setMemoToDelete(null)
      }
    } catch (error) {
      console.error('Failed to delete memo:', error)
    }
  }

  const handlePin = async (memoId: string) => {
    try {
      const response = await fetch(`/api/memos/${memoId}/pin`, {
        method: 'PATCH',
      })
      
      if (response.ok) {
        const data = await response.json()
        setMemos(memos.map(memo => 
          memo.id === memoId ? data.memo : memo
        ))
      }
    } catch (error) {
      console.error('Failed to pin memo:', error)
    }
  }

  const openDeleteDialog = (memoId: string) => {
    setMemoToDelete(memoId)
    setDeleteDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 고정된 메모와 일반 메모 분리
  const pinnedMemos = memos.filter(memo => memo.isPinned)
  const regularMemos = memos.filter(memo => !memo.isPinned)

  useEffect(() => {
    fetchMemos()
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">메모를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">내 메모</h2>
        <Button onClick={onCreateMemo} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          새 메모
        </Button>
      </div>

      {/* 고정된 메모 */}
      {pinnedMemos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Pin className="h-4 w-4" />
            고정된 메모
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pinnedMemos.map((memo) => (
              <MemoCard
                key={memo.id}
                memo={memo}
                onEdit={onEditMemo}
                onDelete={openDeleteDialog}
                onPin={handlePin}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>
      )}

      {/* 일반 메모 */}
      {regularMemos.length === 0 && pinnedMemos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">아직 메모가 없습니다</p>
            <Button onClick={onCreateMemo}>첫 번째 메모 만들기</Button>
          </CardContent>
        </Card>
      ) : regularMemos.length > 0 && (
        <div className="space-y-4">
          {pinnedMemos.length > 0 && (
            <h3 className="text-lg font-semibold">일반 메모</h3>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {regularMemos.map((memo) => (
              <MemoCard
                key={memo.id}
                memo={memo}
                onEdit={onEditMemo}
                onDelete={openDeleteDialog}
                onPin={handlePin}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>메모 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 메모를 삭제하시겠습니까? 삭제된 메모는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memoToDelete && handleDelete(memoToDelete)}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// 메모 카드 컴포넌트
function MemoCard({ 
  memo, 
  onEdit, 
  onDelete, 
  onPin, 
  formatDate 
}: {
  memo: Memo
  onEdit: (memo: Memo) => void
  onDelete: (id: string) => void
  onPin: (id: string) => void
  formatDate: (date: string) => string
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2 flex items-start justify-between">
          <span>{memo.title}</span>
          {memo.isPinned && <Pin className="h-4 w-4 text-primary flex-shrink-0 ml-2" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {memo.content}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {formatDate(memo.updatedAt)}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPin(memo.id)}
              title={memo.isPinned ? "고정 해제" : "고정"}
            >
              {memo.isPinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(memo)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(memo.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}