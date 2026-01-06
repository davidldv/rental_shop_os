'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    addToast(message, type)
  }, [addToast])

  const success = useCallback((message: string) => {
    addToast(message, 'success')
  }, [addToast])

  const error = useCallback((message: string) => {
    addToast(message, 'error')
  }, [addToast])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-75 rounded-lg border p-4 shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-right-full duration-300 ${
              t.type === 'error' 
                ? 'bg-red-950/20 border-red-900/50 text-red-200' 
                : t.type === 'success'
                ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200'
                : 'bg-card/80 border-border text-foreground'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 text-sm font-medium">{t.message}</div>
              <button 
                onClick={() => removeToast(t.id)} 
                className="hover:opacity-70 transition-opacity mt-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
