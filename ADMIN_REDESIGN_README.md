# Редизайн админ-панели на shadcn UI

## ✨ Что сделано

### Frontend (Админ-панель)

1. **Главный дашборд** (`/admin`)
   - Карточки статистики с иконками
   - Очередь модерации
   - Быстрые действия
   - Адаптивный дизайн

2. **Управление городами** (`/admin/cities`)
   - Таблица всех городов
   - Поиск по городам
   - Создание/редактирование/удаление
   - Модальное окно с формой

3. **Управление категориями** (`/admin/categories`)
   - Карточки категорий с иконками
   - Поиск по категориям
   - Создание/редактирование/удаление
   - Модальное окно с формой

4. **Обновленный Layout**
   - Боковая панель навигации (десктоп)
   - Мобильное меню
   - Выход из системы
   - Активный пункт меню

## 📦 Установка зависимостей

### 1. Установить lucide-react (иконки)

```bash
cd frontend
npm install lucide-react
```

### 2. Обновить CardDescription компонент

Добавить в `frontend/components/ui/card.tsx`:

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

// ... existing code ...

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

## 🚀 Деплой на сервер

### 1. Коммит изменений

```bash
cd /home/user/crmauto

git add -A
git commit -m "feat: Redesign admin panel with shadcn UI

- Add modern dashboard with stats cards
- Create cities management page with CRUD
- Create categories management page with CRUD
- Update admin layout with sidebar navigation
- Add lucide-react icons
- Implement responsive design"

git push origin claude/autohub-aggregator-setup-011CUoXZrW4Xrtw4oTUwYgVY
```

### 2. На сервере

```bash
cd ~/testingpanel

# Получить изменения
git pull origin claude/autohub-aggregator-setup-011CUoXZrW4Xrtw4oTUwYgVY

# Установить зависимости
cd frontend
npm install

# Пересобрать
npm run build

# Перезапустить
pm2 restart autohub-frontend
```

## 🔧 TODO: Backend API endpoints

Нужно создать следующие endpoints на backend:

### Cities API

```typescript
GET    /api/v1/cities          // Получить все города
POST   /api/v1/cities          // Создать город (admin only)
PUT    /api/v1/cities/:id      // Обновить город (admin only)
DELETE /api/v1/cities/:id      // Удалить город (admin only)
```

### Categories API

```typescript
GET    /api/v1/categories      // Получить все категории
POST   /api/v1/categories      // Создать категорию (admin only)
PUT    /api/v1/categories/:id  // Обновить категорию (admin only)
DELETE /api/v1/categories/:id  // Удалить категорию (admin only)
```

### Admin Stats API

```typescript
GET /api/v1/admin/stats        // Получить статистику для дашборда
```

## 📋 Следующие шаги

1. ✅ Установить lucide-react
2. ✅ Обновить компонент Card
3. ✅ Задеплоить на сервер
4. ⏳ Создать backend API для городов
5. ⏳ Создать backend API для категорий
6. ⏳ Создать страницу модерации автосервисов
7. ⏳ Создать страницу управления пользователями
8. ⏳ Создать бизнес-дашборд

## 🎨 Используемые компоненты shadcn

- ✅ Button
- ✅ Card (CardHeader, CardTitle, CardDescription, CardContent)
- ✅ Input
- ✅ Label
- ✅ Textarea
- ⏳ Table (для будущих страниц)
- ⏳ Dialog (планируется заменить текущие модалки)
- ⏳ Badge
- ⏳ Tabs

## 🖼️ Скриншоты

После деплоя проверьте:
- http://vyborsto.ru/admin - главный дашборд
- http://vyborsto.ru/admin/cities - управление городами
- http://vyborsto.ru/admin/categories - управление категориями
