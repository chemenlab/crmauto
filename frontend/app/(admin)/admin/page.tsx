'use client'

import { useEffect, useState } from 'react'
import { getAdminStats } from '@/lib/api/admin'
import { Card, CardContent } from '@/components/ui/card'
import type { AdminStats } from '@/lib/api/admin'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await getAdminStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Загрузка статистики...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-600">Не удалось загрузить статистику</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Админ-панель</h1>
        <p className="text-gray-600">Обзор платформы AutoHub</p>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Пользователей</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Новых за месяц: {stats.newUsersThisMonth}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Бизнесов</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalBusinesses}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Активных владельцев
                </p>
              </div>
              <div className="text-4xl">🏢</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Автосервисов</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalServices}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Новых за месяц: {stats.newServicesThisMonth}
                </p>
              </div>
              <div className="text-4xl">🔧</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Отзывов</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.totalReviews}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Всего отзывов
                </p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moderation Queue */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">
                  Автосервисы на модерации
                </h3>
                <p className="text-sm text-yellow-700">
                  Требуют проверки и одобрения
                </p>
              </div>
              <div className="text-5xl">⏳</div>
            </div>
            <div className="text-4xl font-bold text-yellow-900">
              {stats.pendingServices}
            </div>
            <a
              href="/admin/services?status=pending"
              className="inline-block mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              Перейти к модерации →
            </a>
          </CardContent>
        </Card>

        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-orange-900">
                  Отзывы на модерации
                </h3>
                <p className="text-sm text-orange-700">
                  Требуют проверки и одобрения
                </p>
              </div>
              <div className="text-5xl">📝</div>
            </div>
            <div className="text-4xl font-bold text-orange-900">
              {stats.pendingReviews}
            </div>
            <a
              href="/admin/reviews?status=pending"
              className="inline-block mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Перейти к модерации →
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/admin/services"
              className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">🏢</div>
                <div>
                  <p className="font-semibold">Управление автосервисами</p>
                  <p className="text-sm text-gray-600">
                    Модерация, редактирование, premium
                  </p>
                </div>
              </div>
            </a>

            <a
              href="/admin/reviews"
              className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">💬</div>
                <div>
                  <p className="font-semibold">Управление отзывами</p>
                  <p className="text-sm text-gray-600">
                    Модерация отзывов пользователей
                  </p>
                </div>
              </div>
            </a>

            <a
              href="/admin/users"
              className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">👥</div>
                <div>
                  <p className="font-semibold">Управление пользователями</p>
                  <p className="text-sm text-gray-600">
                    Просмотр и управление аккаунтами
                  </p>
                </div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
