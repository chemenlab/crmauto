'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getServices } from '@/lib/api/services'
import { ServiceCard } from '@/components/features/service-card'
import { ServiceFilters } from '@/components/features/service-filters'
import { Button } from '@/components/ui/button'

function ServicesContent() {
  const searchParams = useSearchParams()

  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  // Get filters from URL
  const city = searchParams.get('city')
  const category = searchParams.get('category')
  const rating = searchParams.get('rating')
  const sort = searchParams.get('sort')
  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    loadServices()
  }, [city, category, rating, sort, page])

  const loadServices = async () => {
    try {
      setLoading(true)

      const response = await getServices({
        city: city || undefined,
        category: category ? parseInt(category) : undefined,
        rating: rating ? parseInt(rating) : undefined,
        sort: (sort as any) || 'rating',
        page,
        limit: 20,
      })

      if (response.success && response.data) {
        setServices(response.data.services || [])
        setPagination(response.data.pagination || pagination)
      }
    } catch (error) {
      console.error('Failed to load services:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    window.location.href = `/services?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Автосервисы</h1>
          <p className="text-gray-600 mt-2">
            Найдено автосервисов: {pagination.total}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              <ServiceFilters />
            </div>
          </aside>

          {/* Services Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow h-96 animate-pulse" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Автосервисы не найдены</h3>
                <p className="text-gray-600 mb-6">
                  Попробуйте изменить параметры поиска
                </p>
                <Button onClick={() => window.location.href = '/services'}>
                  Сбросить фильтры
                </Button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      variant="outline"
                    >
                      Назад
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i
                        } else {
                          pageNum = pagination.page - 2 + i
                        }

                        return (
                          <Button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            variant={pagination.page === pageNum ? 'default' : 'outline'}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      onClick={() => goToPage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      variant="outline"
                    >
                      Вперёд
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ServicesContent />
    </Suspense>
  )
}
