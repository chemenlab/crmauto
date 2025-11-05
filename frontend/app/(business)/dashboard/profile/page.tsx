'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getMyService, updateMyService } from '@/lib/api/business'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const serviceSchema = z.object({
  name: z.string().min(3, 'Минимум 3 символа').max(100),
  description: z.string().min(50, 'Минимум 50 символов').max(2000),
  address: z.string().min(10, 'Укажите полный адрес'),
  phone: z.string().regex(/^\+7\d{10}$/, 'Формат: +79991234567'),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  website: z.string().url('Некорректный URL').optional().or(z.literal('')),
  workingHours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }),
})

type ServiceFormData = z.infer<typeof serviceSchema>

export default function ServiceProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [service, setService] = useState<any>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  })

  useEffect(() => {
    loadService()
  }, [])

  const loadService = async () => {
    try {
      const response = await getMyService()
      if (response.success) {
        setService(response.data)

        // Populate form
        setValue('name', response.data.name)
        setValue('description', response.data.description)
        setValue('address', response.data.address)
        setValue('phone', response.data.phone)
        setValue('email', response.data.email || '')
        setValue('website', response.data.website || '')

        // Working hours
        const hours = response.data.workingHours || {}
        Object.keys(hours).forEach((day) => {
          setValue(`workingHours.${day}` as any, hours[day] || '09:00-18:00')
        })
      }
    } catch (error) {
      console.error('Failed to load service:', error)
      setMessage({ type: 'error', text: 'Не удалось загрузить данные' })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ServiceFormData) => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await updateMyService(data)
      if (response.success) {
        setMessage({ type: 'success', text: 'Данные успешно обновлены!' })
        setService(response.data)
      }
    } catch (error: any) {
      console.error('Failed to update service:', error)
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Ошибка при сохранении',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Загрузка данных...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Мой автосервис</h1>
        <p className="text-gray-600">Редактирование информации о вашем автосервисе</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Название автосервиса *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Название вашего автосервиса"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Расскажите о вашем автосервисе: услуги, преимущества, опыт работы..."
                rows={6}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Контактная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+79991234567"
                type="tel"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register('email')}
                placeholder="info@autoservice.ru"
                type="email"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="website">Веб-сайт</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://autoservice.ru"
                type="url"
              />
              {errors.website && (
                <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Адрес *</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="г. Москва, ул. Примерная, д. 1"
              />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Режим работы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: 'monday', label: 'Понедельник' },
              { key: 'tuesday', label: 'Вторник' },
              { key: 'wednesday', label: 'Среда' },
              { key: 'thursday', label: 'Четверг' },
              { key: 'friday', label: 'Пятница' },
              { key: 'saturday', label: 'Суббота' },
              { key: 'sunday', label: 'Воскресенье' },
            ].map((day) => (
              <div key={day.key} className="grid grid-cols-2 gap-4 items-center">
                <Label htmlFor={`hours-${day.key}`}>{day.label}</Label>
                <Input
                  id={`hours-${day.key}`}
                  {...register(`workingHours.${day.key}` as any)}
                  placeholder="09:00-18:00 или Выходной"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Service Status */}
        {service && (
          <Card>
            <CardHeader>
              <CardTitle>Статус</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">Статус модерации:</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                      service.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : service.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {service.status === 'approved' && '✅ Опубликован'}
                    {service.status === 'pending' && '⏳ На модерации'}
                    {service.status === 'rejected' && '❌ Отклонен'}
                  </span>
                </div>
                {service.isPremium && (
                  <div className="ml-auto">
                    <span className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full font-semibold">
                      ⭐ PREMIUM
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => loadService()}
            disabled={saving}
          >
            Отменить
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </div>
      </form>
    </div>
  )
}
