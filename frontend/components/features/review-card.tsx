import { formatDate } from '@/lib/utils'

interface ReviewCardProps {
  review: {
    id: string
    user: {
      firstName: string | null
      lastName: string | null
    }
    rating: number
    title: string | null
    text: string
    pros: string | null
    cons: string | null
    photos?: any[]
    response: string | null
    responseAt: string | null
    createdAt: string
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  const userName = [review.user.firstName, review.user.lastName]
    .filter(Boolean)
    .join(' ') || 'Аноним'

  const initials = review.user.firstName && review.user.lastName
    ? `${review.user.firstName[0]}${review.user.lastName[0]}`.toUpperCase()
    : '👤'

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
            {initials}
          </div>
          <div>
            <p className="font-semibold">{userName}</p>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-xl">
              {star <= review.rating ? '⭐' : '☆'}
            </span>
          ))}
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-lg">{review.title}</h4>
      )}

      {/* Text */}
      <p className="text-gray-700 leading-relaxed">{review.text}</p>

      {/* Pros and Cons */}
      {(review.pros || review.cons) && (
        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
          {review.pros && (
            <div>
              <p className="font-semibold text-green-600 mb-2">➕ Достоинства</p>
              <p className="text-sm text-gray-700">{review.pros}</p>
            </div>
          )}
          {review.cons && (
            <div>
              <p className="font-semibold text-red-600 mb-2">➖ Недостатки</p>
              <p className="text-sm text-gray-700">{review.cons}</p>
            </div>
          )}
        </div>
      )}

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.url}
              alt="Review photo"
              className="w-24 h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Response from service owner */}
      {review.response && (
        <div className="bg-blue-50 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-semibold">↩️</span>
            <div className="flex-1">
              <p className="font-semibold text-blue-900 mb-1">Ответ владельца</p>
              <p className="text-sm text-gray-700">{review.response}</p>
              {review.responseAt && (
                <p className="text-xs text-gray-500 mt-2">{formatDate(review.responseAt)}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
