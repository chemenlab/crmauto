# 🚧 AutoHub - Оставшаяся работа

## ✅ Что уже готово (~ 70%)

### Backend API (100% ✅)
- ✅ **Authentication API** - Полностью готово
  - Register, Login, Refresh, Logout
  - JWT с refresh tokens
  - Cookie-based authentication
  - Rate limiting на auth endpoints

- ✅ **Services CRUD API** - Полностью готово
  - Список с фильтрами (город, категория, рейтинг, поиск)
  - CRUD операции
  - Пагинация
  - Redis кэширование
  - Tracking (views, phone clicks)

- ✅ **Reviews API** - Полностью готово
  - Получение отзывов с фильтрами
  - CRUD отзывов
  - Ответы владельцев
  - Автоматический пересчет рейтинга
  - Статистика по рейтингам

- ✅ **Cities & Categories API** - Полностью готово
  - Справочники городов и категорий
  - 24ч кэширование

### Frontend (40% ✅)
- ✅ **Инфраструктура**
  - Next.js 14 + TypeScript
  - Tailwind CSS
  - shadcn/ui компоненты
  - API client с token refresh
  - TypeScript типы

- ✅ **Страницы**
  - Главная страница (дизайн)
  - Login page
  - Register page

---

## ❌ Что нужно доделать (~ 30%)

### 1. Frontend страницы каталога (Критично 🔴)

**Оценка времени:** 3-4 часа

#### Нужно создать:

**`frontend/app/services/page.tsx`** - Каталог автосервисов

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getServices } from '@/lib/api/services'
import { Service } from '@/types'

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  // Фильтры из URL
  const city = searchParams.get('city')
  const category = searchParams.get('category')
  const rating = searchParams.get('rating')

  useEffect(() => {
    loadServices()
  }, [city, category, rating])

  const loadServices = async () => {
    try {
      setLoading(true)
      const response = await getServices({
        city,
        category: category ? parseInt(category) : undefined,
        rating: rating ? parseInt(rating) : undefined,
      })
      setServices(response.data.services)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Автосервисы</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar с фильтрами */}
        <aside className="lg:col-span-1">
          {/* Фильтры по городу, категории, рейтингу */}
        </aside>

        {/* Список автосервисов */}
        <main className="lg:col-span-3">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
```

**Компонент карточки** - `frontend/components/features/service-card.tsx`:

```typescript
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Service } from '@/types'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <img
        src={service.primaryPhoto || '/placeholder.jpg'}
        alt={service.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>⭐ {service.rating}</span>
          <span>({service.reviewsCount} отзывов)</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">📍 {service.address}</p>
        <Link
          href={`/services/${service.id}`}
          className="text-blue-600 hover:underline text-sm"
        >
          Подробнее →
        </Link>
      </div>
    </Card>
  )
}
```

---

### 2. Карточка автосервиса (Критично 🔴)

**Оценка времени:** 2-3 часа

**`frontend/app/services/[id]/page.tsx`**:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getServiceById } from '@/lib/api/services'
import { Service } from '@/types'
import { Button } from '@/components/ui/button'

export default function ServiceDetailPage() {
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)

  useEffect(() => {
    loadService()
  }, [params.id])

  const loadService = async () => {
    try {
      const response = await getServiceById(params.id as string)
      setService(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  if (!service) return <div>Загрузка...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Фотогалерея */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <img
            src={service.photos?.[0]?.url}
            alt={service.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl">⭐ {service.rating}</span>
            <span className="text-gray-600">({service.reviewsCount} отзывов)</span>
          </div>

          <div className="space-y-2 mb-6">
            <p>📍 {service.address}</p>
            <p>📞 <a href={`tel:${service.phone}`} className="text-blue-600">{service.phone}</a></p>
            {service.website && (
              <p>🌐 <a href={service.website} target="_blank" className="text-blue-600">{service.website}</a></p>
            )}
          </div>

          <Button className="w-full">Оставить отзыв</Button>
        </div>
      </div>

      {/* Описание */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Описание</h2>
        <p className="text-gray-700">{service.description}</p>
      </section>

      {/* Прайс-лист */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Услуги и цены</h2>
        <div className="space-y-4">
          {service.prices?.map(price => (
            <div key={price.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{price.name}</p>
                <p className="text-sm text-gray-600">{price.category}</p>
              </div>
              <p className="font-semibold">
                {price.priceFrom} - {price.priceTo} ₽
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Отзывы */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Отзывы</h2>
        {/* Компонент списка отзывов */}
      </section>
    </div>
  )
}
```

---

### 3. Форма создания отзыва (Важно 🟡)

**Оценка времени:** 2 часа

**`frontend/components/features/review-form.tsx`**:

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  text: z.string().min(100).max(2000),
  pros: z.string().optional(),
  cons: z.string().optional(),
})

type ReviewFormData = z.infer<typeof reviewSchema>

export function ReviewForm({ serviceId }: { serviceId: string }) {
  const { register, handleSubmit, setValue, watch } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  })

  const rating = watch('rating')

  const onSubmit = async (data: ReviewFormData) => {
    // API call to create review
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Звезды рейтинга */}
      <div>
        <Label>Оценка</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setValue('rating', star)}
              className="text-3xl"
            >
              {star <= rating ? '⭐' : '☆'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Отзыв</Label>
        <Textarea
          {...register('text')}
          placeholder="Расскажите о вашем опыте..."
          rows={6}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Достоинства</Label>
          <Textarea {...register('pros')} rows={3} />
        </div>
        <div>
          <Label>Недостатки</Label>
          <Textarea {...register('cons')} rows={3} />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Отправить отзыв
      </Button>
    </form>
  )
}
```

---

### 4. Личный кабинет пользователя (Средне 🟢)

**Оценка времени:** 2-3 часа

**`frontend/app/(user)/profile/page.tsx`**:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/api/auth'
import { Card } from '@/components/ui/card'

export default function ProfilePage() {
  const [user, setUser] = useState(null)

  // Load user data, reviews, favorites

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Мой профиль</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <nav className="space-y-2">
            <a href="/profile" className="block p-2 bg-blue-50 text-blue-600 rounded">
              Профиль
            </a>
            <a href="/profile/reviews" className="block p-2 hover:bg-gray-50 rounded">
              Мои отзывы
            </a>
            <a href="/profile/favorites" className="block p-2 hover:bg-gray-50 rounded">
              Избранное
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-3">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Личные данные</h2>
            {/* Form to edit profile */}
          </Card>
        </main>
      </div>
    </div>
  )
}
```

---

### 5. Личный кабинет автосервиса (Важно 🟡)

**Оценка времени:** 4-5 часов

**`frontend/app/(business)/dashboard/page.tsx`**:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { getServiceStats } from '@/lib/api/services'

export default function BusinessDashboard() {
  const [stats, setStats] = useState(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Панель управления</h1>

      {/* Статистика */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Просмотры</p>
          <p className="text-3xl font-bold">{stats?.views.total}</p>
          <p className="text-sm text-green-600">+{stats?.views.thisWeek} за неделю</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600">Звонки</p>
          <p className="text-3xl font-bold">{stats?.phoneClicks.total}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600">Отзывы</p>
          <p className="text-3xl font-bold">{stats?.reviews.total}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600">Рейтинг</p>
          <p className="text-3xl font-bold">⭐ {stats?.reviews.averageRating}</p>
        </Card>
      </div>

      {/* График */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Статистика за месяц</h2>
        {/* Chart component */}
      </Card>

      {/* Последние отзывы */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Последние отзывы</h2>
        {/* Reviews list */}
      </Card>
    </div>
  )
}
```

---

### 6. Админ-панель (Средне 🟢)

**Оценка времени:** 3-4 часа

**`frontend/app/(admin)/admin/page.tsx`** - Базовая админка:

```typescript
// Модерация автосервисов
// Модерация отзывов
// Управление пользователями
// Статистика платформы
```

---

### 7. Дополнительные API endpoints для frontend

**`frontend/lib/api/reviews.ts`** - Добавить недостающие методы:

```typescript
import apiClient from './client'
import type { ApiResponse, Review, ReviewFormData } from '@/types'

export async function getServiceReviews(serviceId: string, params?: any) {
  const response = await apiClient.get<ApiResponse<any>>(
    `/services/${serviceId}/reviews`,
    { params }
  )
  return response.data
}

export async function createReview(serviceId: string, data: ReviewFormData) {
  const response = await apiClient.post<ApiResponse<Review>>(
    `/services/${serviceId}/reviews`,
    data
  )
  return response.data
}

export async function updateReview(reviewId: string, data: Partial<ReviewFormData>) {
  const response = await apiClient.put<ApiResponse<Review>>(
    `/reviews/${reviewId}`,
    data
  )
  return response.data
}

export async function deleteReview(reviewId: string) {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/reviews/${reviewId}`
  )
  return response.data
}

export async function getMyReviews() {
  const response = await apiClient.get<ApiResponse<Review[]>>('/users/me/reviews')
  return response.data
}
```

**`frontend/lib/api/cities.ts`**:

```typescript
import apiClient from './client'

export async function getCities() {
  const response = await apiClient.get('/cities')
  return response.data
}

export async function getCategories() {
  const response = await apiClient.get('/categories')
  return response.data
}
```

---

## 📊 Общий статус проекта

| Компонент | Прогресс | Статус |
|-----------|----------|--------|
| Backend API | 100% | ✅ Готово |
| Database Schema | 100% | ✅ Готово |
| Frontend Infrastructure | 100% | ✅ Готово |
| Auth Pages | 100% | ✅ Готово |
| Main Page | 100% | ✅ Готово |
| Services Catalog | 0% | ❌ Нужно сделать |
| Service Detail Page | 0% | ❌ Нужно сделать |
| Review Form | 0% | ❌ Нужно сделать |
| User Dashboard | 0% | ❌ Нужно сделать |
| Business Dashboard | 0% | ❌ Нужно сделать |
| Admin Panel | 0% | ❌ Нужно сделать |

**Общий прогресс: ~70%**

---

## 🚀 Порядок реализации (Рекомендуется)

1. **Каталог автосервисов** (3-4ч) - Критично для MVP
2. **Карточка автосервиса** (2-3ч) - Критично для MVP
3. **Форма отзыва** (2ч) - Важно для MVP
4. **User Dashboard** (2-3ч) - Средний приоритет
5. **Business Dashboard** (4-5ч) - Средний приоритет
6. **Admin Panel** (3-4ч) - Низкий приоритет для MVP

**Общее время:** ~18-22 часа работы

---

## 💡 Быстрые советы

### Использование API в компонентах:

```typescript
import { getServices } from '@/lib/api/services'
import { useEffect, useState } from 'react'

const [data, setData] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  async function load() {
    try {
      const response = await getServices({ city: 'moscow' })
      setData(response.data.services)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  load()
}, [])
```

### Защищенные роуты:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

---

## 📝 Тестирование

После реализации всех страниц:

1. Проверить регистрацию и вход
2. Проверить создание автосервиса
3. Проверить фильтрацию в каталоге
4. Проверить создание отзыва
5. Проверить статистику в dashboard

---

**Весь Backend работает и готов к использованию!** 🎉

Нужно только доделать Frontend страницы по примерам выше.
