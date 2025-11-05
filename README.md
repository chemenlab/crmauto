# AutoHub - Агрегатор автосервисов

Полнофункциональная веб-платформа для поиска и выбора автосервисов по городам России с системой отзывов, рейтингов и управлением сервисами.

## 🎯 Основные возможности

### Для пользователей:
- 🔍 Поиск автосервисов по городам и категориям
- ⭐ Система рейтингов и отзывов
- ❤️ Избранные автосервисы
- 📝 Написание и управление отзывами
- 👤 Личный кабинет

### Для владельцев автосервисов:
- 🏢 Управление профилем автосервиса
- 💰 Редактирование прайс-листа
- 📸 Фотогалерея услуг
- 💬 Ответы на отзывы клиентов
- 📊 Статистика просмотров и звонков

### Для администраторов:
- 🛡️ Модерация автосервисов и отзывов
- 👥 Управление пользователями
- ⭐ Назначение Premium статуса
- 📈 Аналитика платформы

## Структура проекта

```
/
├── frontend/          # Next.js 14 (App Router) + TypeScript
├── backend/           # Express.js + TypeScript + Prisma
├── docs/             # Документация проекта
└── .github/          # CI/CD конфигурация
```

## Технологический стек

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.x
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Maps:** Yandex Maps API

### Backend
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL 15+
- **Cache:** Redis 7+
- **Authentication:** JWT + Refresh Tokens

### DevOps
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry, UptimeRobot
- **Hosting:** VPS (Timeweb, Selectel)

## 📋 Статус реализации

✅ **Backend API** - 100% готов
- Аутентификация (JWT + Refresh tokens)
- CRUD для автосервисов, отзывов
- Модерация контента
- Избранное
- Загрузка файлов
- Email уведомления

✅ **Frontend** - 100% готов
- Каталог с фильтрами
- Детальные страницы
- Личные кабинеты (user/business/admin)
- Админ-панель
- Responsive дизайн

✅ **Deployment** - Готова документация
- Полное руководство по развертыванию
- Настройка Ubuntu Server
- SSL сертификаты
- Troubleshooting

## Начало работы

### Предварительные требования

- Node.js 18+
- Docker и Docker Compose
- Git

### Установка

1. Клонировать репозиторий:
```bash
git clone https://github.com/your-repo/autohub.git
cd autohub
```

2. Запустить Docker контейнеры (PostgreSQL + Redis):
```bash
docker-compose up -d
```

3. Установить зависимости для backend:
```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev
```

4. Установить зависимости для frontend:
```bash
cd ../frontend
npm install
cp .env.local.example .env.local
npm run dev
```

5. Открыть в браузере:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Разработка

### Структура Frontend (Next.js)

```
frontend/
├── app/                    # App Router pages
│   ├── (public)/          # Публичные страницы
│   ├── (auth)/            # Авторизация
│   ├── (user)/            # Личный кабинет пользователя
│   ├── (business)/        # Личный кабинет автосервиса
│   └── (admin)/           # Админ-панель
├── components/            # React компоненты
│   ├── ui/               # Базовые UI компоненты
│   ├── layout/           # Layout компоненты
│   └── features/         # Функциональные компоненты
├── lib/                  # Утилиты и хелперы
└── types/                # TypeScript типы
```

### Структура Backend (Express.js)

```
backend/
├── src/
│   ├── routes/           # API маршруты
│   ├── controllers/      # Контроллеры
│   ├── services/         # Бизнес-логика
│   ├── middlewares/      # Middleware
│   ├── models/           # Prisma схемы
│   ├── utils/            # Утилиты
│   └── config/           # Конфигурация
├── prisma/
│   └── schema.prisma     # Схема базы данных
└── tests/                # Тесты
```

## Доступные команды

### Frontend
```bash
npm run dev          # Запуск в режиме разработки
npm run build        # Сборка для продакшена
npm run start        # Запуск продакшен сборки
npm run lint         # Проверка кода
npm run test         # Запуск тестов
```

### Backend
```bash
npm run dev          # Запуск в режиме разработки
npm run build        # Компиляция TypeScript
npm run start        # Запуск продакшен версии
npm run migrate      # Применить миграции БД
npm run seed         # Заполнить БД тестовыми данными
npm run test         # Запуск тестов
```

## База данных

### Миграции

Создать новую миграцию:
```bash
cd backend
npx prisma migrate dev --name migration_name
```

Применить миграции:
```bash
npm run migrate
```

### Схема БД

Основные таблицы:
- `users` - пользователи
- `services` - автосервисы
- `reviews` - отзывы
- `cities` - города
- `service_categories` - категории услуг
- `service_prices` - прайс-листы
- `favorites` - избранное
- `payments` - платежи

## API Документация

API доступен по адресу: `http://localhost:4000/api/v1`

Основные endpoints:
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `GET /services` - Список автосервисов
- `GET /services/:id` - Карточка автосервиса
- `POST /services/:id/reviews` - Создать отзыв

Полная документация API: [docs/API.md](docs/API.md)

## Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Deployment

### Развертывание на Ubuntu Server

Полное пошаговое руководство по развертыванию на production сервере:

📖 **[Руководство по развертыванию](docs/DEPLOYMENT.md)**

Включает:
- Настройку Ubuntu Server 20.04/22.04
- Установку PostgreSQL 15, Redis 7, Nginx
- Настройку PM2 для управления процессами
- SSL сертификаты (Let's Encrypt)
- Резервное копирование и мониторинг

📖 **[Troubleshooting](docs/TROUBLESHOOTING.md)**

Решение распространенных проблем при развертывании.

### Быстрый старт с Docker (для разработки)

```bash
# Запустить базы данных
docker-compose up -d

# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Мониторинг

- **Sentry**: Отслеживание ошибок
- **UptimeRobot**: Мониторинг доступности
- **Яндекс.Метрика**: Веб-аналитика
- **Google Analytics**: Дополнительная аналитика

## Безопасность

- JWT токены для аутентификации
- Bcrypt для хеширования паролей
- Rate limiting на API endpoints
- CSRF защита
- XSS защита (DOMPurify)
- SQL injection защита (Prisma)

## Лицензия

MIT

## Контакты

- GitHub Issues: [https://github.com/your-repo/autohub/issues](https://github.com/your-repo/autohub/issues)
- Email: support@autohub.ru

---

**Версия:** 1.0.0 (MVP)
**Последнее обновление:** 2025-11-04
