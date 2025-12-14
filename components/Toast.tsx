'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: '✅',
      border: 'border-green-400'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-red-600',
      icon: '❌',
      border: 'border-red-400'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: 'ℹ️',
      border: 'border-blue-400'
    },
  }[type]

  return (
    <div className="fixed top-20 right-4 z-[100] animate-slide-in-right">
      <div className={`${styles.bg} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 min-w-[320px] max-w-md border-2 ${styles.border} transform transition-all duration-300 hover:scale-105`}>
        <span className="text-2xl">{styles.icon}</span>
        <span className="flex-1 font-semibold">{message}</span>
        <button 
          onClick={onClose} 
          className="ml-2 text-white hover:text-gray-200 text-xl font-bold transition-colors"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}


