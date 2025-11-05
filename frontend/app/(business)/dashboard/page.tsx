'use client'

import { useEffect, useState } from 'react'
import { getBusinessStats } from '@/lib/api/business'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BusinessStats } from '@/lib/api/business'

export default function DashboardPage() {
  const [stats, setStats] = useState<BusinessStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await getBusinessStats()
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
        <h1 className="text-3xl font-bold mb-2">Статистика</h1>
        <p className="text-gray-600">Обзор активности вашего автосервиса</p>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Всего просмотров</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalViews}</p>
                <p className="text-xs text-gray-500 mt-1">
                  За месяц: {stats.viewsThisMonth}
                </p>
              </div>
              <div className="text-4xl">👁️</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Звонков</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalPhoneClicks}</p>
                <p className="text-xs text-gray-500 mt-1">
                  За месяц: {stats.phoneClicksThisMonth}
                </p>
              </div>
              <div className="text-4xl">📞</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Отзывов</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalReviews}</p>
                <p className="text-xs text-gray-500 mt-1">
                  На модерации: {stats.pendingReviews}
                </p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Рейтинг</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.averageRating.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Одобрено: {stats.approvedReviews}
                </p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Распределение оценок</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating] || 0
              const percentage = stats.totalReviews > 0
                ? (count / stats.totalReviews) * 100
                : 0

              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-24">
                    <span className="font-medium">{rating}</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-right">
                    <span className="font-semibold">{count}</span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/dashboard/profile"
              className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">🏢</div>
                <div>
                  <p className="font-semibold">Редактировать профиль</p>
                  <p className="text-sm text-gray-600">
                    Обновить информацию об автосервисе
                  </p>
                </div>
              </div>
            </a>

            <a
              href="/dashboard/reviews"
              className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">💬</div>
                <div>
                  <p className="font-semibold">Ответить на отзывы</p>
                  <p className="text-sm text-gray-600">
                    {stats.pendingReviews > 0
                      ? `${stats.pendingReviews} новых отзывов`
                      : 'Нет новых отзывов'}
                  </p>
                </div>
              </div>
            </a>

            <a
              href="/dashboard/prices"
              className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">💰</div>
                <div>
                  <p className="font-semibold">Обновить прайс-лист</p>
                  <p className="text-sm text-gray-600">
                    Управление ценами на услуги
                  </p>
                </div>
              </div>
            </a>

            <a
              href="/dashboard/photos"
              className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">📸</div>
                <div>
                  <p className="font-semibold">Фотогалерея</p>
                  <p className="text-sm text-gray-600">
                    Добавить или удалить фотографии
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
