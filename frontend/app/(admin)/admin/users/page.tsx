'use client'

import { useEffect, useState } from 'react'
import { getUsers, deleteUser } from '@/lib/api/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'user' | 'business' | 'admin'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadUsers()
  }, [filter])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filter !== 'all') params.role = filter
      if (search) params.search = search

      const response = await getUsers(params)
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить пользователя "${userName}"?`)) {
      return
    }

    try {
      const response = await deleteUser(userId)
      if (response.success) {
        loadUsers()
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Ошибка при удалении пользователя')
    }
  }

  const handleSearch = () => {
    loadUsers()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const userCount = users.filter((u) => u.role === 'user').length
  const businessCount = users.filter((u) => u.role === 'business').length
  const adminCount = users.filter((u) => u.role === 'admin').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Управление пользователями</h1>
        <p className="text-gray-600">Просмотр и управление учетными записями</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Поиск по имени или email..."
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
          Все ({users.length})
        </button>
        <button
          onClick={() => setFilter('user')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            filter === 'user'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Пользователи ({userCount})
        </button>
        <button
          onClick={() => setFilter('business')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            filter === 'business'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Бизнесы ({businessCount})
        </button>
        <button
          onClick={() => setFilter('admin')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            filter === 'admin'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Админы ({adminCount})
        </button>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Загрузка...</p>
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Пользователей не найдено</h3>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Пользователи ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Пользователь
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Телефон
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Роль
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Статус
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Регистрация
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {user.firstName?.[0] || user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.firstName || 'Без'} {user.lastName || 'имени'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">{user.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : user.role === 'business'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.role === 'admin' && '🛡️ Админ'}
                          {user.role === 'business' && '🏢 Бизнес'}
                          {user.role === 'user' && '👤 Пользователь'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.emailVerified ? (
                          <span className="text-green-600 text-sm">✅ Подтвержден</span>
                        ) : (
                          <span className="text-gray-500 text-sm">⏳ Не подтвержден</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {user.role !== 'admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDelete(
                                user.id,
                                `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                                  user.email
                              )
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            Удалить
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
