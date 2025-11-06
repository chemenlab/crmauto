'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/api/auth'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser()
      if (response.success && response.data) {
        // Check if user is admin
        if (response.data.role !== 'admin') {
          router.push('/')
          return
        }
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4 text-red-600">
                🛡️ Админ-панель
              </h2>
              <nav className="space-y-2">
                <Link
                  href="/admin"
                  className="block p-3 hover:bg-red-50 rounded-lg transition"
                >
                  📊 Статистика
                </Link>
                <Link
                  href="/admin/services"
                  className="block p-3 hover:bg-red-50 rounded-lg transition"
                >
                  🏢 Автосервисы
                </Link>
                <Link
                  href="/admin/reviews"
                  className="block p-3 hover:bg-red-50 rounded-lg transition"
                >
                  💬 Отзывы
                </Link>
                <Link
                  href="/admin/users"
                  className="block p-3 hover:bg-red-50 rounded-lg transition"
                >
                  👥 Пользователи
                </Link>
                <hr className="my-4" />
                <Link
                  href="/"
                  className="block p-3 hover:bg-gray-100 rounded-lg transition text-gray-600"
                >
                  ← На главную
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('accessToken')
                    router.push('/')
                  }}
                  className="w-full text-left p-3 hover:bg-red-50 text-red-600 rounded-lg transition"
                >
                  🚪 Выйти
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  )
}
