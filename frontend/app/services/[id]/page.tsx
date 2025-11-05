'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getServiceById, trackView, trackPhoneClick } from '@/lib/api/services'
import { getServiceReviews } from '@/lib/api/reviews'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReviewCard } from '@/components/features/review-card'
import { ReviewForm } from '@/components/features/review-form'
import { formatPhone, formatPrice } from '@/lib/utils'

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  const [service, setService] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewStats, setReviewStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (serviceId) {
      loadService()
      loadReviews()
      trackServiceView()
    }
  }, [serviceId])

  const loadService = async () => {
    try {
      const response = await getServiceById(serviceId)
      if (response.success) {
        setService(response.data)
      }
    } catch (error) {
      console.error('Failed to load service:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReviews = async () => {
    try {
      const response = await getServiceReviews(serviceId, {
        sort: 'recent',
        limit: 10,
      })
      if (response.success && response.data) {
        setReviews(response.data.reviews || [])
        setReviewStats(response.data.stats)
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    }
  }

  const trackServiceView = async () => {
    try {
      await trackView(serviceId)
    } catch (error) {
      // Silently fail
    }
  }

  const handlePhoneClick = async () => {
    try {
      await trackPhoneClick(serviceId)
    } catch (error) {
      // Silently fail
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚗</div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Автосервис не найден</h2>
          <Button onClick={() => router.push('/services')}>
            Вернуться к каталогу
          </Button>
        </div>
      </div>
    )
  }

  const photos = service.photos && service.photos.length > 0
    ? service.photos
    : [{ url: '/placeholder-service.jpg', id: 'placeholder' }]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gallery and Info */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={photos[currentImageIndex]?.url || '/placeholder.jpg'}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>

              {photos.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {photos.map((photo: any, index: number) => (
                    <button
                      key={photo.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden ${
                        index === currentImageIndex ? 'ring-2 ring-blue-600' : ''
                      }`}
                    >
                      <Image
                        src={photo.url}
                        alt={`Photo ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-2xl font-bold">{service.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    {service.reviewsCount} {service.reviewsCount === 1 ? 'отзыв' : 'отзывов'}
                  </span>
                </div>

                {service.plan === 'premium' && (
                  <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    ⭐ PREMIUM автосервис
                  </div>
                )}

                {service.plan === 'basic' && (
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    ✓ Проверенный автосервис
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-semibold">Адрес</p>
                    <p className="text-gray-700">{service.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="font-semibold">Телефон</p>
                    <a
                      href={`tel:${service.phone}`}
                      onClick={handlePhoneClick}
                      className="text-blue-600 hover:underline text-lg"
                    >
                      {formatPhone(service.phone)}
                    </a>
                  </div>
                </div>

                {service.email && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📧</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <a
                        href={`mailto:${service.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {service.email}
                      </a>
                    </div>
                  </div>
                )}

                {service.website && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🌐</span>
                    <div>
                      <p className="font-semibold">Сайт</p>
                      <a
                        href={service.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {service.website}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <span className="text-xl">🕐</span>
                  <div className="flex-1">
                    <p className="font-semibold mb-2">Часы работы</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(service.workingHours || {}).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{getDayName(day)}:</span>
                          <span className="font-medium">{hours as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowReviewForm(true)}
                size="lg"
                className="w-full"
              >
                Оставить отзыв
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {service.description && (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Prices */}
      {service.prices && service.prices.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Услуги и цены</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {service.prices.map((price: any) => (
                  <div
                    key={price.id}
                    className="flex justify-between items-center pb-4 border-b last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">{price.name}</p>
                      <p className="text-sm text-gray-600">{price.category}</p>
                      {price.duration && (
                        <p className="text-sm text-gray-500">⏱️ {price.duration}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {price.priceFrom && price.priceTo ? (
                        <p className="font-semibold text-lg">
                          {formatPrice(price.priceFrom)} - {formatPrice(price.priceTo)}
                        </p>
                      ) : price.priceFrom ? (
                        <p className="font-semibold text-lg">
                          от {formatPrice(price.priceFrom)}
                        </p>
                      ) : (
                        <p className="text-gray-500">Уточняйте</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reviews */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Отзывы ({reviewStats?.totalReviews || 0})
              </CardTitle>
              <Button onClick={() => setShowReviewForm(true)}>
                Оставить отзыв
              </Button>
            </div>

            {/* Rating Distribution */}
            {reviewStats && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">{reviewStats.averageRating.toFixed(1)}</span>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviewStats.ratingDistribution[rating] || 0
                      const percentage = reviewStats.totalReviews > 0
                        ? (count / reviewStats.totalReviews) * 100
                        : 0

                      return (
                        <div key={rating} className="flex items-center gap-2 text-sm">
                          <span className="w-12">{rating} ⭐</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-12 text-right text-gray-600">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Оставить отзыв</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Отмена
                  </Button>
                </div>
                <ReviewForm
                  serviceId={serviceId}
                  onSuccess={() => {
                    setShowReviewForm(false)
                    loadReviews()
                  }}
                />
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600 mb-4">Пока нет отзывов</p>
                <Button onClick={() => setShowReviewForm(true)}>
                  Будьте первым!
                </Button>
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getDayName(day: string): string {
  const names: Record<string, string> = {
    mon: 'Пн',
    tue: 'Вт',
    wed: 'Ср',
    thu: 'Чт',
    fri: 'Пт',
    sat: 'Сб',
    sun: 'Вс',
  }
  return names[day] || day
}
