'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Search,
  X
} from 'lucide-react'

// Временные типы (позже добавим в types/index.ts)
interface City {
  id: string
  name: string
  slug: string
  region?: string
  _count?: {
    services: number
  }
  createdAt: string
}

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', region: '' })

  useEffect(() => {
    loadCities()
  }, [])

  const loadCities = async () => {
    try {
      // TODO: Подключить реальный API
      // const response = await getCities()
      // setCities(response.data)

      // Временные тестовые данные
      setCities([
        { id: '1', name: 'Москва', slug: 'moscow', region: 'Московская область', createdAt: '2024-01-01' },
        { id: '2', name: 'Санкт-Петербург', slug: 'spb', region: 'Ленинградская область', createdAt: '2024-01-02' },
      ])
    } catch (error) {
      console.error('Failed to load cities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingCity(null)
    setFormData({ name: '', slug: '', region: '' })
    setIsDialogOpen(true)
  }

  const handleEdit = (city: City) => {
    setEditingCity(city)
    setFormData({
      name: city.name,
      slug: city.slug,
      region: city.region || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (city: City) => {
    if (!confirm(`Удалить город "${city.name}"?`)) return

    try {
      // TODO: Подключить реальный API
      // await deleteCity(city.id)
      setCities(cities.filter(c => c.id !== city.id))
    } catch (error) {
      console.error('Failed to delete city:', error)
      alert('Ошибка при удалении города')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCity) {
        // TODO: Подключить реальный API
        // await updateCity(editingCity.id, formData)
        setCities(cities.map(c => c.id === editingCity.id ? { ...c, ...formData } : c))
      } else {
        // TODO: Подключить реальный API
        // const response = await createCity(formData)
        const newCity: City = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        }
        setCities([...cities, newCity])
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to save city:', error)
      alert('Ошибка при сохранении города')
    }
  }

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (city.region && city.region.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Города</h1>
          <p className="text-muted-foreground mt-2">
            Управление списком городов на платформе
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить город
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, слагу или региону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список городов ({filteredCities.length})</CardTitle>
          <CardDescription>
            Все города, доступные для выбора на платформе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left font-medium">Название</th>
                  <th className="p-4 text-left font-medium">Слаг</th>
                  <th className="p-4 text-left font-medium">Регион</th>
                  <th className="p-4 text-left font-medium">Автосервисов</th>
                  <th className="p-4 text-right font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Загрузка...
                    </td>
                  </tr>
                ) : filteredCities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      {searchQuery ? 'Города не найдены' : 'Список городов пуст'}
                    </td>
                  </tr>
                ) : (
                  filteredCities.map((city) => (
                    <tr key={city.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{city.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{city.slug}</td>
                      <td className="p-4 text-muted-foreground">{city.region || '—'}</td>
                      <td className="p-4 text-muted-foreground">
                        {city._count?.services || 0}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(city)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(city)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog для создания/редактирования */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingCity ? 'Редактировать город' : 'Добавить город'}
              </CardTitle>
              <CardDescription>
                {editingCity
                  ? 'Измените информацию о городе'
                  : 'Введите информацию о новом городе'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название города*</Label>
                  <Input
                    id="name"
                    placeholder="Москва"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Слаг (URL)*</Label>
                  <Input
                    id="slug"
                    placeholder="moscow"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Используется в URL, только латиница и дефисы
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Регион</Label>
                  <Input
                    id="region"
                    placeholder="Московская область"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCity ? 'Сохранить' : 'Создать'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
