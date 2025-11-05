'use client'

import { useEffect, useState } from 'react'
import { getMyServiceReviews, respondToReview } from '@/lib/api/business'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Review {
  id: string
  rating: number
  text: string
  pros?: string
  cons?: string
  status: 'pending' | 'approved' | 'rejected'
  ownerResponse?: string
  createdAt: string
  user: {
    firstName: string
    lastName: string
  }
}

export default function ReviewsManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [filter])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await getMyServiceReviews(params)
      if (response.success) {
        setReviews(response.data)
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) return

    setSubmitting(true)
    try {
      const response = await respondToReview(reviewId, responseText)
      if (response.success) {
        // Update review in list
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, ownerResponse: responseText } : r
          )
        )
        setRespondingTo(null)
        setResponseText('')
      }
    } catch (error) {
      console.error('Failed to respond:', error)
      alert('Ошибка при отправке ответа')
    } finally {
      setSubmitting(false)
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
        <p className="text-gray-600">Просматривайте и отвечайте на отзывы клиентов</p>
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
          Все отзывы ({reviews.length})
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
          Опубликованные ({approvedCount})
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
          <p className="text-gray-600">Загрузка отзывов...</p>
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Отзывов пока нет</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'У вас еще нет отзывов от клиентов'
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
                      {review.user.firstName[0]}
                      {review.user.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                </div>

                {/* Owner Response */}
                {review.ownerResponse ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="font-semibold text-blue-900 mb-2">
                      Ответ владельца:
                    </p>
                    <p className="text-blue-800">{review.ownerResponse}</p>
                  </div>
                ) : respondingTo === review.id ? (
                  <div className="mt-4 space-y-3">
                    <Textarea
                      placeholder="Напишите ваш ответ на отзыв..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={4}
                      className="w-full"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRespondingTo(null)
                          setResponseText('')
                        }}
                        disabled={submitting}
                      >
                        Отмена
                      </Button>
                      <Button
                        onClick={() => handleRespond(review.id)}
                        disabled={submitting || !responseText.trim()}
                      >
                        {submitting ? 'Отправка...' : 'Отправить ответ'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setRespondingTo(review.id)}
                      disabled={review.status !== 'approved'}
                    >
                      💬 Ответить на отзыв
                    </Button>
                    {review.status !== 'approved' && (
                      <p className="text-sm text-gray-500 mt-2">
                        Вы сможете ответить после публикации отзыва
                      </p>
                    )}
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
