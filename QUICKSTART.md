# 🚀 AutoHub - Быстрый старт

## ✅ Что уже сделано

### 🏗️ Инфраструктура
- ✅ Монорепозиторий с разделением на frontend и backend
- ✅ Docker Compose для PostgreSQL и Redis
- ✅ Настроены все конфигурационные файлы
- ✅ Создана документация

### 🔧 Backend (Express.js + TypeScript)
- ✅ Express.js сервер с TypeScript
- ✅ Prisma ORM с полной схемой БД
- ✅ Middleware для аутентификации (JWT)
- ✅ Middleware для обработки ошибок
- ✅ Rate limiting
- ✅ Redis интеграция
- ✅ Базовые утилиты

### 🎨 Frontend (Next.js 14 + TypeScript)
- ✅ Next.js 14 с App Router
- ✅ TypeScript + Tailwind CSS
- ✅ API клиент с автообновлением токенов
- ✅ TypeScript типы для всех моделей
- ✅ Утилиты для форматирования
- ✅ Базовая главная страница

### 📊 База данных
- ✅ PostgreSQL схема через Prisma
- ✅ 10 таблиц (Users, Services, Reviews, Cities и т.д.)
- ✅ Индексы и связи
- ✅ Enums для статусов

---

## 🚀 Как запустить проект

### Шаг 1: Клонировать репозиторий

```bash
git clone <repository-url>
cd crmauto
```

### Шаг 2: Запустить Docker контейнеры

```bash
# Запустить PostgreSQL и Redis
docker-compose up -d

# Проверить что контейнеры работают
docker-compose ps
```

### Шаг 3: Настроить Backend

```bash
cd backend

# Установить зависимости
npm install

# Скопировать .env файл
cp .env.example .env

# Применить миграции базы данных
npx prisma migrate dev --name init

# Запустить сервер в режиме разработки
npm run dev
```

Backend запустится на **http://localhost:4000**

### Шаг 4: Настроить Frontend

Откройте новый терминал:

```bash
cd frontend

# Установить зависимости
npm install

# Скопировать .env файл
cp .env.local.example .env.local

# Запустить в режиме разработки
npm run dev
```

Frontend запустится на **http://localhost:3000**

---

## 🧪 Проверка

### 1. Проверить Backend API:

```bash
curl http://localhost:4000/health
```

Должен вернуть:
```json
{
  "success": true,
  "message": "AutoHub API is running",
  "timestamp": "..."
}
```

### 2. Проверить Frontend:

Откройте в браузере: **http://localhost:3000**

Вы должны увидеть главную страницу AutoHub с поиском автосервисов.

### 3. Открыть Prisma Studio (GUI для БД):

```bash
cd backend
npx prisma studio
```

Откроется на **http://localhost:5555**

---

## 📁 Структура проекта

```
crmauto/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/            # Database, Redis
│   │   ├── middlewares/       # Auth, Error handling
│   │   ├── utils/             # JWT utilities
│   │   ├── app.ts             # Express app
│   │   └── server.ts          # Entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
│
├── frontend/                   # Next.js app
│   ├── app/                   # Pages (App Router)
│   ├── components/            # React components
│   ├── lib/                   # Utilities, API clients
│   ├── types/                 # TypeScript types
│   └── package.json
│
├── docs/                       # Documentation
│   ├── SETUP.md               # Detailed setup guide
│   └── API.md                 # API documentation
│
├── docker-compose.yml          # Docker services
├── .env.example               # Environment variables template
└── README.md                  # Project overview
```

---

## 📝 Следующие шаги

### 1. Реализовать аутентификацию
- [ ] `POST /api/v1/auth/register`
- [ ] `POST /api/v1/auth/login`
- [ ] `POST /api/v1/auth/refresh`
- [ ] `POST /api/v1/auth/logout`

### 2. Создать CRUD для автосервисов
- [ ] `GET /api/v1/services` - список
- [ ] `GET /api/v1/services/:id` - детали
- [ ] `POST /api/v1/services` - создание
- [ ] `PUT /api/v1/services/:id` - обновление
- [ ] `DELETE /api/v1/services/:id` - удаление

### 3. Система отзывов
- [ ] `GET /api/v1/services/:id/reviews`
- [ ] `POST /api/v1/services/:id/reviews`
- [ ] `PUT /api/v1/reviews/:id`
- [ ] `DELETE /api/v1/reviews/:id`

### 4. Frontend страницы
- [ ] Страница регистрации `/register`
- [ ] Страница входа `/login`
- [ ] Каталог автосервисов `/services`
- [ ] Карточка автосервиса `/services/[id]`
- [ ] Личный кабинет пользователя `/profile`
- [ ] Личный кабинет автосервиса `/dashboard`
- [ ] Админ-панель `/admin`

### 5. Дополнительный функционал
- [ ] Загрузка изображений
- [ ] Интеграция Яндекс.Карт
- [ ] Email уведомления
- [ ] SMS подтверждение
- [ ] Система платежей

---

## 🔧 Полезные команды

### Backend

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск продакшн
npm run start

# Prisma
npx prisma studio              # GUI для БД
npx prisma generate            # Генерация клиента
npx prisma migrate dev         # Создать миграцию
npx prisma migrate reset       # Сбросить БД (ОСТОРОЖНО!)
```

### Frontend

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск продакшн
npm run start

# Линтинг
npm run lint
```

### Docker

```bash
# Запустить
docker-compose up -d

# Остановить
docker-compose down

# Логи
docker-compose logs -f

# Перезапустить
docker-compose restart

# Очистить всё
docker-compose down -v
```

---

## 📚 Документация

- **Подробная инструкция**: [docs/SETUP.md](docs/SETUP.md)
- **API документация**: [docs/API.md](docs/API.md)
- **Техническое задание**: Проверьте корень проекта

---

## 🐛 Проблемы?

Если что-то не работает:

1. Убедитесь, что Docker контейнеры запущены: `docker-compose ps`
2. Проверьте логи: `docker-compose logs -f`
3. Проверьте переменные окружения в `.env` файлах
4. Попробуйте перезапустить: `docker-compose restart`
5. Создайте Issue в репозитории

---

## ✨ Готово к разработке!

Теперь у вас есть полностью работающая база для разработки AutoHub.

**Начните с создания первых API endpoints и страниц!**

Удачи! 🚀
