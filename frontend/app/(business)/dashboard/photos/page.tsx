'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ServicePhoto {
  id: string
  url: string
  order: number
  isPrimary: boolean
}

export default function PhotosManagementPage() {
  const [photos, setPhotos] = useState<ServicePhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    setLoading(true)
    try {
      // TODO: Load photos from API
      // Mock data for now
      setPhotos([
        {
          id: '1',
          url: 'https://via.placeholder.com/400x300?text=Photo+1',
          order: 0,
          isPrimary: true,
        },
        {
          id: '2',
          url: 'https://via.placeholder.com/400x300?text=Photo+2',
          order: 1,
          isPrimary: false,
        },
        {
          id: '3',
          url: 'https://via.placeholder.com/400x300?text=Photo+3',
          order: 2,
          isPrimary: false,
        },
      ])
    } catch (error) {
      console.error('Failed to load photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // TODO: Upload files to API
    setUploading(true)

    // Mock upload
    setTimeout(() => {
      const newPhotos = Array.from(files).map((file, index) => ({
        id: Date.now().toString() + index,
        url: URL.createObjectURL(file),
        order: photos.length + index,
        isPrimary: false,
      }))

      setPhotos([...photos, ...newPhotos])
      setUploading(false)
    }, 1000)
  }

  const handleSetPrimary = (id: string) => {
    setPhotos(
      photos.map((photo) => ({
        ...photo,
        isPrimary: photo.id === id,
      }))
    )
  }

  const handleDeletePhoto = (id: string) => {
    if (confirm('Удалить это фото?')) {
      setPhotos(photos.filter((p) => p.id !== id))
    }
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newPhotos = [...photos]
    const temp = newPhotos[index]
    newPhotos[index] = newPhotos[index - 1]
    newPhotos[index - 1] = temp

    // Update order
    newPhotos.forEach((photo, i) => {
      photo.order = i
    })

    setPhotos(newPhotos)
  }

  const handleMoveDown = (index: number) => {
    if (index === photos.length - 1) return
    const newPhotos = [...photos]
    const temp = newPhotos[index]
    newPhotos[index] = newPhotos[index + 1]
    newPhotos[index + 1] = temp

    // Update order
    newPhotos.forEach((photo, i) => {
      photo.order = i
    })

    setPhotos(newPhotos)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Загрузка фотографий...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Управление фотографиями</h1>
        <p className="text-gray-600">
          Загружайте фотографии вашего автосервиса, оборудования и работ
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Загрузить фотографии</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="photo-upload"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor="photo-upload"
              className={`cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Загрузка...' : '📸 Выбрать фотографии'}
            </label>
            <p className="text-sm text-gray-600">
              Поддерживаются JPG, PNG. Максимум 10 МБ на файл.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Фотогалерея ({photos.length} фото)</CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-2">Фотографий пока нет</h3>
              <p className="text-gray-600">
                Загрузите фотографии, чтобы привлечь больше клиентов
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`relative border rounded-lg overflow-hidden ${
                    photo.isPrimary ? 'border-yellow-400 border-4' : 'border-gray-200'
                  }`}
                >
                  {/* Primary Badge */}
                  {photo.isPrimary && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold z-10">
                      ⭐ Главное фото
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Actions */}
                  <div className="p-3 bg-gray-50 space-y-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="flex-1"
                      >
                        ↑
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === photos.length - 1}
                        className="flex-1"
                      >
                        ↓
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {!photo.isPrimary && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetPrimary(photo.id)}
                          className="flex-1"
                        >
                          Сделать главным
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        🗑️ Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Helper Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm text-blue-800">
            💡 <strong>Советы по фотографиям:</strong>
          </p>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1 ml-2">
            <li>Загружайте качественные фото высокого разрешения</li>
            <li>Покажите рабочие места, оборудование, команду</li>
            <li>
              Добавьте фотографии выполненных работ (до/после)
            </li>
            <li>Первое фото будет отображаться в каталоге</li>
            <li>Рекомендуется 5-10 фотографий для лучшего эффекта</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
