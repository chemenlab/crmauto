'use client'

import { useEffect, useState } from 'react'
import { getFavorites, removeFromFavorites } from '@/lib/api/favorites'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const response = await getFavorites()
      if (response.success) {
        setFavorites(response.data)
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (serviceId: string) => {
    if (!confirm('Удалить из избранного?')) return

    try {
      const response = await removeFromFavorites(serviceId)
      if (response.success) {
        setFavorites(favorites.filter((s) => s.id !== serviceId))
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      alert('Ошибка при удалении из избранного')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Избранное</h1>
          <p className="text-gray-600">Сохраненные автосервисы ({favorites.length})</p>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold mb-2">
                У вас пока нет избранных автосервисов
              </h3>
              <p className="text-gray-600 mb-6">
                Добавляйте автосервисы в избранное, чтобы быстро находить их позже
              </p>
              <Link href="/services">
                <Button>Перейти к каталогу</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <Link href={`/services/${service.id}`}>
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={service.primaryPhoto || 'https://via.placeholder.com/400x300?text=No+Photo'}
                      alt={service.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {service.isPremium && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                        ⭐ PREMIUM
                      </div>
                    )}
                  </div>
                </Link>

                <CardContent className="p-4">
                  <Link href={`/services/${service.id}`}>
                    <h3 className="text-lg font-bold mb-2 hover:text-blue-600 transition">
                      {service.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500 text-lg">⭐</span>
                    <span className="font-semibold">{service.rating.toFixed(1)}</span>
                    <span className="text-gray-600 text-sm">
                      ({service.reviewsCount} отзывов)
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">
                    📍 {service.city?.name}, {service.address}
                  </p>

                  <p className="text-sm text-gray-600 mb-4">
                    📞 {service.phone}
                  </p>

                  <div className="flex gap-2">
                    <Link href={`/services/${service.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Подробнее
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleRemove(service.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ❤️
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
