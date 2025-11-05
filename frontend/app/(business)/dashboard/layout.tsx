'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/api/auth'
import Link from 'next/link'

export default function DashboardLayout({
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
      if (response.success) {
        // Check if user is business owner
        if (response.data.role !== 'business') {
          router.push('/')
          return
        }
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
              <h2 className="text-lg font-bold mb-4">Панель управления</h2>
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block p-3 hover:bg-blue-50 rounded-lg transition"
                >
                  📊 Статистика
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block p-3 hover:bg-blue-50 rounded-lg transition"
                >
                  🏢 Мой автосервис
                </Link>
                <Link
                  href="/dashboard/reviews"
                  className="block p-3 hover:bg-blue-50 rounded-lg transition"
                >
                  💬 Отзывы
                </Link>
                <Link
                  href="/dashboard/prices"
                  className="block p-3 hover:bg-blue-50 rounded-lg transition"
                >
                  💰 Прайс-лист
                </Link>
                <Link
                  href="/dashboard/photos"
                  className="block p-3 hover:bg-blue-50 rounded-lg transition"
                >
                  📸 Фотографии
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
