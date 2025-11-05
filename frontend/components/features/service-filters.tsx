'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { getCities } from '@/lib/api/cities'
import { getCategories } from '@/lib/api/categories'

export function ServiceFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [cities, setCities] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || '')
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'rating')

  useEffect(() => {
    loadCities()
    loadCategories()
  }, [])

  const loadCities = async () => {
    try {
      const response = await getCities()
      if (response.success) {
        setCities(response.data || [])
      }
    } catch (error) {
      console.error('Failed to load cities:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await getCategories()
      if (response.success) {
        setCategories(response.data || [])
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (selectedCity) params.set('city', selectedCity)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedRating) params.set('rating', selectedRating)
    if (selectedSort) params.set('sort', selectedSort)

    router.push(`/services?${params.toString()}`)
  }

  const resetFilters = () => {
    setSelectedCity('')
    setSelectedCategory('')
    setSelectedRating('')
    setSelectedSort('rating')
    router.push('/services')
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Фильтры</h3>
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <Label>Город</Label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="Все города" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все города</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.slug}>
                {city.name} ({city.servicesCount})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label>Категория услуг</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.icon && `${category.icon} `}{category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <Label>Минимальный рейтинг</Label>
        <Select value={selectedRating} onValueChange={setSelectedRating}>
          <SelectTrigger>
            <SelectValue placeholder="Любой рейтинг" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Любой рейтинг</SelectItem>
            <SelectItem value="4">⭐ 4.0 и выше</SelectItem>
            <SelectItem value="4.5">⭐ 4.5 и выше</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label>Сортировка</Label>
        <Select value={selectedSort} onValueChange={setSelectedSort}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">По рейтингу</SelectItem>
            <SelectItem value="reviews">По количеству отзывов</SelectItem>
            <SelectItem value="name">По алфавиту</SelectItem>
            <SelectItem value="newest">Новые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-4 border-t">
        <Button onClick={applyFilters} className="w-full">
          Применить фильтры
        </Button>
        <Button onClick={resetFilters} variant="outline" className="w-full">
          Сбросить
        </Button>
      </div>
    </div>
  )
}
