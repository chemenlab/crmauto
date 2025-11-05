'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMyReviews, deleteReview } from '@/lib/api/reviews'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

export default function MyReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const response = await getMyReviews()
      if (response.success) {
        setReviews(response.data || [])
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return

    try {
      await deleteReview(reviewId)
      setReviews(reviews.filter(r => r.id !== reviewId))
    } catch (error) {
      console.error('Failed to delete review:', error)
      alert('Ошибка при удалении отзыва')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Мои отзывы</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              <a
                href="/profile"
                className="block p-3 hover:bg-gray-100 rounded-lg transition"
              >
                👤 Профиль
              </a>
              <a
                href="/profile/reviews"
                className="block p-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
              >
                💬 Мои отзывы
              </a>
              <a
                href="/profile/favorites"
                className="block p-3 hover:bg-gray-100 rounded-lg transition"
              >
                ❤️ Избранное
              </a>
            </nav>
          </aside>

          {/* Reviews List */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Загрузка...</p>
              </div>
            ) : reviews.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold mb-2">У вас пока нет отзывов</h3>
                  <p className="text-gray-600 mb-6">
                    Оставьте отзыв о посещенных автосервисах
                  </p>
                  <Button onClick={() => router.push('/services')}>
                    Перейти к каталогу
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            <a
                              href={`/services/${review.service.id}`}
                              className="hover:text-blue-600 transition"
                            >
                              {review.service.name}
                            </a>
                          </h3>
                          <p className="text-sm text-gray-600">
                            {review.service.city} • {formatDate(review.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="text-lg">
                                {star <= review.rating ? '⭐' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {review.title && (
                        <h4 className="font-semibold mb-2">{review.title}</h4>
                      )}

                      <p className="text-gray-700 mb-4 line-clamp-3">{review.text}</p>

                      {(review.pros || review.cons) && (
                        <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                          {review.pros && (
                            <div>
                              <p className="font-semibold text-green-600 mb-1">➕ Достоинства</p>
                              <p className="text-gray-700">{review.pros}</p>
                            </div>
                          )}
                          {review.cons && (
                            <div>
                              <p className="font-semibold text-red-600 mb-1">➖ Недостатки</p>
                              <p className="text-gray-700">{review.cons}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-4 border-t">
                        <div className="flex-1">
                          {review.status === 'pending' && (
                            <span className="inline-flex items-center gap-2 text-sm text-yellow-600">
                              ⏳ На модерации
                            </span>
                          )}
                          {review.status === 'approved' && (
                            <span className="inline-flex items-center gap-2 text-sm text-green-600">
                              ✓ Опубликован
                            </span>
                          )}
                          {review.status === 'rejected' && (
                            <span className="inline-flex items-center gap-2 text-sm text-red-600">
                              ✗ Отклонен
                            </span>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/services/${review.service.id}`)}
                        >
                          Посмотреть
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Удалить
                        </Button>
                      </div>

                      {review.response && (
                        <div className="bg-blue-50 rounded-lg p-4 mt-4">
                          <p className="font-semibold text-blue-900 mb-2 text-sm">
                            ↩️ Ответ от автосервиса:
                          </p>
                          <p className="text-sm text-gray-700">{review.response}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
