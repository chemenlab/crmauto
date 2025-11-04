# AutoHub - Инструкция по установке и запуску

## Содержание
1. [Предварительные требования](#предварительные-требования)
2. [Установка](#установка)
3. [Настройка базы данных](#настройка-базы-данных)
4. [Запуск проекта](#запуск-проекта)
5. [Проверка работы](#проверка-работы)
6. [Возможные проблемы](#возможные-проблемы)

---

## Предварительные требования

Убедитесь, что у вас установлено следующее ПО:

- **Node.js** 18.x или выше ([скачать](https://nodejs.org/))
- **npm** 9.x или выше (устанавливается вместе с Node.js)
- **Docker** и **Docker Compose** ([скачать](https://www.docker.com/))
- **Git** ([скачать](https://git-scm.com/))

Проверить версии можно командами:
```bash
node --version
npm --version
docker --version
docker-compose --version
git --version
```

---

## Установка

### 1. Клонировать репозиторий

```bash
git clone <repository-url>
cd crmauto
```

### 2. Установить зависимости Backend

```bash
cd backend
npm install
```

### 3. Установить зависимости Frontend

```bash
cd ../frontend
npm install
```

---

## Настройка базы данных

### 1. Запустить PostgreSQL и Redis через Docker

Вернитесь в корневую директорию проекта:
```bash
cd ..
```

Запустите контейнеры:
```bash
docker-compose up -d
```

Это запустит:
- PostgreSQL на порту **5432**
- Redis на порту **6379**

Проверить статус контейнеров:
```bash
docker-compose ps
```

### 2. Настроить переменные окружения Backend

```bash
cd backend
cp .env.example .env
```

Отредактируйте `.env` файл (по умолчанию настройки уже корректные для локальной разработки):

```env
DATABASE_URL="postgresql://autohub_user:autohub_password@localhost:5432/autohub"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key-change-this"
JWT_REFRESH_SECRET="your-refresh-secret-change-this"
PORT=4000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

### 3. Применить миграции базы данных

```bash
npx prisma migrate dev --name init
```

Эта команда:
- Создаст все необходимые таблицы в PostgreSQL
- Сгенерирует Prisma Client

### 4. (Опционально) Заполнить БД тестовыми данными

```bash
npm run prisma:seed
```

---

## Настройка Frontend

### 1. Настроить переменные окружения Frontend

```bash
cd ../frontend
cp .env.local.example .env.local
```

Отредактируйте `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Запуск проекта

### Вариант 1: Запуск Backend и Frontend отдельно (рекомендуется для разработки)

#### Терминал 1 - Backend:
```bash
cd backend
npm run dev
```

Сервер запустится на **http://localhost:4000**

#### Терминал 2 - Frontend:
```bash
cd frontend
npm run dev
```

Фронтенд запустится на **http://localhost:3000**

### Вариант 2: Использование Docker Compose (весь стек)

Раскомментируйте секции `backend` и `frontend` в `docker-compose.yml`, затем:

```bash
docker-compose up --build
```

---

## Проверка работы

### 1. Проверить Backend API

Откройте в браузере или через curl:
```bash
curl http://localhost:4000/health
```

Ожидаемый ответ:
```json
{
  "success": true,
  "message": "AutoHub API is running",
  "timestamp": "2025-11-04T..."
}
```

### 2. Проверить API endpoints:
```bash
curl http://localhost:4000/api/v1
```

### 3. Проверить Frontend

Откройте в браузере:
```
http://localhost:3000
```

### 4. Проверить Prisma Studio (GUI для БД)

```bash
cd backend
npx prisma studio
```

Откроется на **http://localhost:5555**

---

## Полезные команды

### Backend

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm run start

# Prisma команды
npm run prisma:generate    # Сгенерировать Prisma Client
npm run prisma:migrate     # Создать и применить миграцию
npm run prisma:studio      # Открыть Prisma Studio
npm run prisma:seed        # Заполнить БД тестовыми данными
```

### Frontend

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm run start

# Проверка кода
npm run lint
```

### Docker

```bash
# Запустить контейнеры
docker-compose up -d

# Остановить контейнеры
docker-compose down

# Просмотр логов
docker-compose logs -f

# Очистить все данные (включая volumes)
docker-compose down -v
```

---

## Возможные проблемы

### 1. Ошибка "Cannot connect to PostgreSQL"

**Решение:**
- Убедитесь, что Docker контейнер запущен: `docker-compose ps`
- Проверьте `DATABASE_URL` в `.env`
- Перезапустите контейнер: `docker-compose restart postgres`

### 2. Ошибка "Port 3000 already in use"

**Решение:**
```bash
# Найти процесс использующий порт
lsof -i :3000

# Убить процесс
kill -9 <PID>
```

### 3. Prisma ошибка "Schema engine error"

**Решение:**
```bash
cd backend
npx prisma generate
npx prisma migrate reset  # Осторожно: удалит все данные!
```

### 4. CORS ошибки

**Решение:**
- Убедитесь, что `CORS_ORIGIN` в backend `.env` соответствует URL фронтенда
- По умолчанию: `CORS_ORIGIN="http://localhost:3000"`

### 5. JWT ошибки "Invalid token"

**Решение:**
- Убедитесь, что `JWT_SECRET` и `JWT_REFRESH_SECRET` установлены в `.env`
- Очистите localStorage в браузере

---

## Следующие шаги

После успешного запуска:

1. Ознакомьтесь с [API документацией](./API.md)
2. Изучите [структуру проекта](../README.md#структура-проекта)
3. Прочитайте [техническое задание](../docs/TZ.md)
4. Начните разработку с создания базовых страниц

---

## Контакты

Если возникли вопросы:
- Создайте Issue в GitHub
- Обратитесь к команде разработки

**Удачи в разработке! 🚀**
