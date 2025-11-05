'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getAdminServices, moderateService, togglePremium } from '@/lib/api/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminServicesPage() {
  const searchParams = useSearchParams()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    (searchParams.get('status') as any) || 'all'
  )
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadServices()
  }, [filter])

  const loadServices = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filter !== 'all') params.status = filter
      if (search) params.search = search

      const response = await getAdminServices(params)
      if (response.success) {
        setServices(response.data)
      }
    } catch (error) {
      console.error('Failed to load services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModerate = async (serviceId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await moderateService(serviceId, status)
      if (response.success) {
        loadServices()
      }
    } catch (error) {
      console.error('Failed to moderate service:', error)
      alert('Ошибка при модерации')
    }
  }

  const handleTogglePremium = async (serviceId: string, isPremium: boolean) => {
    try {
      const response = await togglePremium(serviceId, !isPremium)
      if (response.success) {
        loadServices()
      }
    } catch (error) {
      console.error('Failed to toggle premium:', error)
      alert('Ошибка при изменении статуса Premium')
    }
  }

  const handleSearch = () => {
    loadServices()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const pendingCount = services.filter((s) => s.status === 'pending').length
  const approvedCount = services.filter((s) => s.status === 'approved').length
  const rejectedCount = services.filter((s) => s.status === 'rejected').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Управление автосервисами</h1>
        <p className="text-gray-600">Модерация и управление автосервисами</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Поиск по названию или адресу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>Найти</Button>
          </div>
        </CardContent>
      </Card>

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
          Все ({services.length})
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
          Одобренные ({approvedCount})
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

      {/* Services List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Загрузка...</p>
        </div>
      ) : services.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold mb-2">Автосервисов не найдено</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'Нет зарегистрированных автосервисов'
                : `Нет автосервисов со статусом "${filter}"`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      {service.isPremium && (
                        <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold">
                          ⭐ PREMIUM
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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

                    <p className="text-gray-700 mb-3">{service.description}</p>

                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-600">
                        <strong>Город:</strong> {service.city?.name}
                      </p>
                      <p className="text-gray-600">
                        <strong>Адрес:</strong> {service.address}
                      </p>
                      <p className="text-gray-600">
                        <strong>Телефон:</strong> {service.phone}
                      </p>
                      <p className="text-gray-600">
                        <strong>Владелец:</strong>{' '}
                        {service.owner?.firstName} {service.owner?.lastName} (
                        {service.owner?.email})
                      </p>
                      <p className="text-gray-600">
                        <strong>Рейтинг:</strong> {service.rating.toFixed(1)} ⭐
                      </p>
                      <p className="text-gray-600">
                        <strong>Создан:</strong> {formatDate(service.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {service.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleModerate(service.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        ✅ Одобрить
                      </Button>
                      <Button
                        onClick={() => handleModerate(service.id, 'rejected')}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        ❌ Отклонить
                      </Button>
                    </>
                  )}

                  {service.status === 'approved' && (
                    <Button
                      onClick={() => handleTogglePremium(service.id, service.isPremium)}
                      variant="outline"
                      className={
                        service.isPremium
                          ? 'border-yellow-600 text-yellow-700'
                          : 'border-gray-300'
                      }
                    >
                      {service.isPremium ? '⭐ Убрать Premium' : '⭐ Сделать Premium'}
                    </Button>
                  )}

                  <a
                    href={`/services/${service.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">🔗 Открыть страницу</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
