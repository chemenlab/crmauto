'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/api/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const response = await getCurrentUser()
      if (response.success) {
        setUser(response.data)
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Мой профиль</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              <a
                href="/profile"
                className="block p-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
              >
                👤 Профиль
              </a>
              <a
                href="/profile/reviews"
                className="block p-3 hover:bg-gray-100 rounded-lg transition"
              >
                💬 Мои отзывы
              </a>
              <a
                href="/profile/favorites"
                className="block p-3 hover:bg-gray-100 rounded-lg transition"
              >
                ❤️ Избранное
              </a>
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
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Личные данные</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Имя</Label>
                    <Input
                      value={user?.firstName || ''}
                      placeholder="Введите имя"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Фамилия</Label>
                    <Input
                      value={user?.lastName || ''}
                      placeholder="Введите фамилию"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ''} disabled />
                  {user?.emailVerified ? (
                    <p className="text-sm text-green-600">✓ Email подтвержден</p>
                  ) : (
                    <p className="text-sm text-yellow-600">⚠️ Email не подтвержден</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Телефон</Label>
                  <Input
                    value={user?.phone || ''}
                    placeholder="+7 (999) 123-45-67"
                    disabled
                  />
                </div>

                <div className="flex gap-4">
                  <Button disabled>
                    Редактировать (скоро)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-2">0</p>
                  <p className="text-gray-600">Отзывов</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-red-600 mb-2">0</p>
                  <p className="text-gray-600">Избранное</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Дата регистрации</p>
                  <p className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '-'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
