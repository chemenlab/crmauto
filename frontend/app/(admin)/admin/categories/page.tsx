'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  Search,
  X
} from 'lucide-react'

// Временные типы
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  _count?: {
    services: number
  }
  createdAt: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', icon: '' })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      // TODO: Подключить реальный API
      // const response = await getCategories()
      // setCategories(response.data)

      // Временные тестовые данные
      setCategories([
        {
          id: '1',
          name: 'Ремонт двигателя',
          slug: 'engine-repair',
          description: 'Диагностика и ремонт двигателя',
          icon: '🔧',
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'Шиномонтаж',
          slug: 'tire-service',
          description: 'Замена и балансировка шин',
          icon: '🛞',
          createdAt: '2024-01-02'
        },
      ])
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setFormData({ name: '', slug: '', description: '', icon: '' })
    setIsDialogOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(`Удалить категорию "${category.name}"?`)) return

    try {
      // TODO: Подключить реальный API
      // await deleteCategory(category.id)
      setCategories(categories.filter(c => c.id !== category.id))
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Ошибка при удалении категории')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCategory) {
        // TODO: Подключить реальный API
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c))
      } else {
        // TODO: Подключить реальный API
        const newCategory: Category = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        }
        setCategories([...categories, newCategory])
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to save category:', error)
      alert('Ошибка при сохранении категории')
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Категории услуг</h1>
          <p className="text-muted-foreground mt-2">
            Управление категориями автосервисов
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить категорию
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, слагу или описанию..."
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

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Загрузка...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {searchQuery ? 'Категории не найдены' : 'Список категорий пуст'}
          </div>
        ) : (
          filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {category.icon && (
                      <div className="text-3xl">{category.icon}</div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        /{category.slug}
                      </p>
                    </div>
                  </div>
                  <Tags className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {category.description || 'Нет описания'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Услуг: {category._count?.services || 0}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog для создания/редактирования */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}
              </CardTitle>
              <CardDescription>
                {editingCategory
                  ? 'Измените информацию о категории'
                  : 'Введите информацию о новой категории'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название категории*</Label>
                  <Input
                    id="name"
                    placeholder="Ремонт двигателя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Слаг (URL)*</Label>
                  <Input
                    id="slug"
                    placeholder="engine-repair"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Используется в URL, только латиница и дефисы
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Иконка (эмодзи)</Label>
                  <Input
                    id="icon"
                    placeholder="🔧"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    placeholder="Краткое описание категории..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCategory ? 'Сохранить' : 'Создать'}
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
