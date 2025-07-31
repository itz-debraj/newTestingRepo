'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { removeToast } from '@/store/slices/uiSlice'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Toaster() {
  const toasts = useAppSelector(state => state.ui.toasts)
  const dispatch = useAppDispatch()

  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => dispatch(removeToast(toast.id))} />
      ))}
    </div>
  )
}

interface ToastProps {
  toast: {
    id: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
  }
  onClose: () => void
}

function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-destructive',
    info: 'bg-blue-600',
    warning: 'bg-orange-600',
  }[toast.type] || 'bg-gray-700'

  return (
    <div
      className={cn(
        bgColor,
        'text-white p-3 rounded-md shadow-lg flex items-center justify-between animate-slide-in-right z-50 min-w-[300px]'
      )}
      role="alert"
    >
      <span>{toast.message}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="ml-4 text-white hover:bg-white/20 h-6 w-6 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}