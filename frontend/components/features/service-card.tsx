import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { formatPhone } from '@/lib/utils'

interface ServiceCardProps {
  service: {
    id: string
    name: string
    city: string
    citySlug: string
    address: string
    phone: string
    rating: number
    reviewsCount: number
    primaryPhoto: string | null
    plan: string
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  const isPremium = service.plan === 'premium'
  const isBasic = service.plan === 'basic'

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isPremium ? 'border-yellow-400 border-2' : ''}`}>
      <div className="relative">
        {service.primaryPhoto ? (
          <Image
            src={service.primaryPhoto}
            alt={service.name}
            width={400}
            height={240}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-6xl">🚗</span>
          </div>
        )}

        {isPremium && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
            ⭐ PREMIUM
          </div>
        )}

        {isBasic && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ✓ Проверено
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <Link href={`/services/${service.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition line-clamp-1">
            {service.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold">{service.rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            {service.reviewsCount} {service.reviewsCount === 1 ? 'отзыв' : 'отзывов'}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <span className="text-base">📍</span>
            <span className="line-clamp-2">{service.address}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-base">📞</span>
            <a
              href={`tel:${service.phone}`}
              className="hover:text-blue-600 transition"
              onClick={(e) => e.stopPropagation()}
            >
              {formatPhone(service.phone)}
            </a>
          </div>
        </div>

        <Link href={`/services/${service.id}`}>
          <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Подробнее
          </button>
        </Link>
      </CardContent>
    </Card>
  )
}
