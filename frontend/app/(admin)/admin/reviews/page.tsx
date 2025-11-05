'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getAdminReviews, moderateReview } from '@/lib/api/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminReviewsPage() {
  const searchParams = useSearchParams()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    (searchParams.get('status') as any) || 'all'
  )

  useEffect(() => {
    loadReviews()
  }, [filter])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filter !== 'all') params.status = filter

      const response = await getAdminReviews(params)
      if (response.success) {
        setReviews(response.data)
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModerate = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await moderateReview(reviewId, status)
      if (response.success) {
        loadReviews()
      }
    } catch (error) {
      console.error('Failed to moderate review:', error)
      alert('Ошибка при модерации')
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
        ⭐
      </span>
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const pendingCount = reviews.filter((r) => r.status === 'pending').length
  const approvedCount = reviews.filter((r) => r.status === 'approved').length
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Управление отзывами</h1>
        <p className="text-gray-600">Модерация отзывов пользователей</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            filter === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Все ({reviews.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            filter === 'pending'
              ? 'border-yellow-600 text-yellow-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          На модерации ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            filter === 'approved'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Одобренные ({approvedCount})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            filter === 'rejected'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Отклоненные ({rejectedCount})
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Загрузка...</p>
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Отзывов не найдено</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'Нет отзывов для модерации'
                : `Нет отзывов со статусом "${filter}"`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {review.user.firstName?.[0] || 'U'}
                      {review.user.lastName?.[0] || ''}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{review.user.email}</p>
                      <p className="text-sm text-gray-600">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        review.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : review.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {review.status === 'approved' && '✅ Опубликован'}
                      {review.status === 'pending' && '⏳ На модерации'}
                      {review.status === 'rejected' && '❌ Отклонен'}
                    </span>
                  </div>
                </div>

                {/* Service Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Автосервис:</strong> {review.service.name}
                  </p>
                  <a
                    href={`/services/${review.service.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Открыть страницу автосервиса →
                  </a>
                </div>

                {/* Review Content */}
                <div className="space-y-3 mb-4">
                  <p className="text-gray-800">{review.text}</p>

                  {review.pros && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="font-semibold text-green-800 mb-1">👍 Достоинства:</p>
                      <p className="text-green-700">{review.pros}</p>
                    </div>
                  )}

                  {review.cons && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="font-semibold text-red-800 mb-1">👎 Недостатки:</p>
                      <p className="text-red-700">{review.cons}</p>
                    </div>
                  )}

                  {review.ownerResponse && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="font-semibold text-blue-900 mb-1">
                        Ответ владельца:
                      </p>
                      <p className="text-blue-800">{review.ownerResponse}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {review.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleModerate(review.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      ✅ Одобрить отзыв
                    </Button>
                    <Button
                      onClick={() => handleModerate(review.id, 'rejected')}
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      ❌ Отклонить отзыв
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
