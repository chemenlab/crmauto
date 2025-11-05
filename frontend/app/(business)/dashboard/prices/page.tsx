'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ServicePrice {
  id: string
  serviceName: string
  price: number
  categoryId: string
  category?: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
}

export default function PricesManagementPage() {
  const [prices, setPrices] = useState<ServicePrice[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState({
    serviceName: '',
    price: 0,
    categoryId: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // TODO: Load prices and categories from API
      // Mock data for now
      setCategories([
        { id: '1', name: 'Диагностика' },
        { id: '2', name: 'Ремонт двигателя' },
        { id: '3', name: 'Ремонт подвески' },
        { id: '4', name: 'Шиномонтаж' },
        { id: '5', name: 'Кузовной ремонт' },
      ])

      setPrices([
        { id: '1', serviceName: 'Компьютерная диагностика', price: 1500, categoryId: '1' },
        { id: '2', serviceName: 'Замена масла', price: 2000, categoryId: '2' },
        { id: '3', serviceName: 'Замена тормозных колодок', price: 3500, categoryId: '3' },
      ])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPrice = () => {
    if (!newPrice.serviceName || !newPrice.price || !newPrice.categoryId) {
      alert('Заполните все поля')
      return
    }

    const category = categories.find((c) => c.id === newPrice.categoryId)
    setPrices([
      ...prices,
      {
        id: Date.now().toString(),
        serviceName: newPrice.serviceName,
        price: newPrice.price,
        categoryId: newPrice.categoryId,
        category,
      },
    ])

    setNewPrice({ serviceName: '', price: 0, categoryId: '' })
  }

  const handleDeletePrice = (id: string) => {
    if (confirm('Удалить эту услугу из прайс-листа?')) {
      setPrices(prices.filter((p) => p.id !== id))
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
        <h1 className="text-3xl font-bold mb-2">Управление прайс-листом</h1>
        <p className="text-gray-600">Добавляйте и редактируйте услуги и цены</p>
      </div>

      {/* Add New Price */}
      <Card>
        <CardHeader>
          <CardTitle>Добавить услугу</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="categoryId">Категория</Label>
              <Select
                value={newPrice.categoryId}
                onValueChange={(value) =>
                  setNewPrice({ ...newPrice, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="serviceName">Название услуги</Label>
              <Input
                id="serviceName"
                value={newPrice.serviceName}
                onChange={(e) =>
                  setNewPrice({ ...newPrice, serviceName: e.target.value })
                }
                placeholder="Например: Замена масла"
              />
            </div>

            <div>
              <Label htmlFor="price">Цена (₽)</Label>
              <div className="flex gap-2">
                <Input
                  id="price"
                  type="number"
                  value={newPrice.price || ''}
                  onChange={(e) =>
                    setNewPrice({ ...newPrice, price: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
                <Button onClick={handleAddPrice}>Добавить</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prices List */}
      <Card>
        <CardHeader>
          <CardTitle>Прайс-лист ({prices.length} услуг)</CardTitle>
        </CardHeader>
        <CardContent>
          {prices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Прайс-лист пуст</h3>
              <p className="text-gray-600">Добавьте первую услугу в форме выше</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Категория
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Услуга
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Цена
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {prices.map((price) => {
                    const category = categories.find((c) => c.id === price.categoryId)
                    return (
                      <tr key={price.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          {category?.name || 'Без категории'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {price.serviceName}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">
                          {price.price.toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePrice(price.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Helper Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Совет:</strong> Регулярно обновляйте прайс-лист, чтобы клиенты
            видели актуальные цены. Детальный прайс-лист увеличивает доверие к вашему
            автосервису.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
