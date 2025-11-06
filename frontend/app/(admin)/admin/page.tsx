'use client'

import { useEffect, useState } from 'react'
import { getAdminStats } from '@/lib/api/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { AdminStats } from '@/lib/api/admin'
import {
  Users,
  Building2,
  Wrench,
  MessageSquare,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  MapPin,
  Tags,
  AlertCircle
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await getAdminStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Загрузка статистики...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Не удалось загрузить статистику</p>
          <Button onClick={loadStats} variant="outline">Попробовать снова</Button>
        </CardContent>
      </Card>
    )
  }

  const statCards = [
    {
      title: 'Всего пользователей',
      value: stats.totalUsers,
      change: `+${stats.newUsersThisMonth} за месяц`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Бизнес-аккаунтов',
      value: stats.totalBusinesses,
      change: 'Активных владельцев',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Автосервисов',
      value: stats.totalServices,
      change: `+${stats.newServicesThisMonth} за месяц`,
      icon: Wrench,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Отзывов',
      value: stats.totalReviews,
      change: 'Всего отзывов',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const moderationCards = [
    {
      title: 'Автосервисы на модерации',
      description: 'Требуют проверки и одобрения',
      value: stats.pendingServices,
      href: '/admin/services?status=pending',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Отзывы на модерации',
      description: 'Требуют проверки и одобрения',
      value: stats.pendingReviews,
      href: '/admin/reviews?status=pending',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ]

  const quickActions = [
    {
      title: 'Города',
      description: 'Управление списком городов',
      href: '/admin/cities',
      icon: MapPin,
      color: 'text-blue-600',
    },
    {
      title: 'Категории',
      description: 'Управление категориями услуг',
      href: '/admin/categories',
      icon: Tags,
      color: 'text-green-600',
    },
    {
      title: 'Автосервисы',
      description: 'Модерация и управление',
      href: '/admin/services',
      icon: Wrench,
      color: 'text-purple-600',
    },
    {
      title: 'Отзывы',
      description: 'Модерация отзывов',
      href: '/admin/reviews',
      icon: MessageSquare,
      color: 'text-orange-600',
    },
    {
      title: 'Пользователи',
      description: 'Управление аккаунтами',
      href: '/admin/users',
      icon: Users,
      color: 'text-pink-600',
    },
    {
      title: 'Аналитика',
      description: 'Статистика и отчеты',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'text-indigo-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
        <p className="text-muted-foreground mt-2">
          Обзор платформы и управление контентом
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Moderation Queue */}
      <div className="grid gap-4 md:grid-cols-2">
        {moderationCards.map((item, index) => {
          const Icon = item.icon
          return (
            <Card key={index} className={`${item.borderColor} border-2`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                  <div className={`p-3 rounded-lg ${item.bgColor}`}>
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className={`text-4xl font-bold ${item.color}`}>
                    {item.value}
                  </div>
                  <Button asChild>
                    <Link href={item.href}>
                      Перейти к модерации
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
          <CardDescription>
            Переход к основным разделам панели управления
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent hover:border-primary transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-accent`}>
                    <Icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold leading-none">{action.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
