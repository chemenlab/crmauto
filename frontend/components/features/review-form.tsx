'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createReview } from '@/lib/api/reviews'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().max(255).optional(),
  text: z.string().min(100, 'Отзыв должен содержать минимум 100 символов').max(2000),
  pros: z.string().max(500).optional(),
  cons: z.string().max(500).optional(),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  serviceId: string
  onSuccess?: () => void
}

export function ReviewForm({ serviceId, onSuccess }: ReviewFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
    },
  })

  const rating = watch('rating')

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setLoading(true)
      setError('')

      const response = await createReview(serviceId, data)

      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess?.()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Ошибка при отправке отзыва')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          Спасибо за отзыв!
        </h3>
        <p className="text-green-700">
          Ваш отзыв отправлен на модерацию и будет опубликован после проверки.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="space-y-2">
        <Label>Оценка *</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue('rating', star, { shouldValidate: true })}
              className="text-4xl transition hover:scale-110"
            >
              {star <= rating ? '⭐' : '☆'}
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Заголовок (опционально)</Label>
        <Input
          id="title"
          placeholder="Например: Отличный сервис!"
          {...register('title')}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Text */}
      <div className="space-y-2">
        <Label htmlFor="text">Отзыв * (минимум 100 символов)</Label>
        <Textarea
          id="text"
          rows={6}
          placeholder="Расскажите подробно о вашем опыте посещения этого автосервиса..."
          {...register('text')}
        />
        {errors.text && (
          <p className="text-sm text-red-600">{errors.text.message}</p>
        )}
        <p className="text-sm text-gray-500">
          {watch('text')?.length || 0} / 2000 символов
        </p>
      </div>

      {/* Pros and Cons */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pros">Достоинства (опционально)</Label>
          <Textarea
            id="pros"
            rows={3}
            placeholder="Что вам понравилось?"
            {...register('pros')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cons">Недостатки (опционально)</Label>
          <Textarea
            id="cons"
            rows={3}
            placeholder="Что можно улучшить?"
            {...register('cons')}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Отправка...' : 'Отправить отзыв'}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        * Обязательные поля. Отзыв будет опубликован после модерации.
      </p>
    </form>
  )
}
