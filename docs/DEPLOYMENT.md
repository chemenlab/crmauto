# Развертывание AutoHub на Ubuntu Server

Это пошаговое руководство для развертывания полнофункциональной платформы AutoHub на Ubuntu Server (20.04/22.04).

## Содержание

1. [Требования](#требования)
2. [Подготовка сервера](#подготовка-сервера)
3. [Установка зависимостей](#установка-зависимостей)
4. [Настройка PostgreSQL](#настройка-postgresql)
5. [Настройка Redis](#настройка-redis)
6. [Клонирование и настройка проекта](#клонирование-и-настройка-проекта)
7. [Настройка Backend](#настройка-backend)
8. [Настройка Frontend](#настройка-frontend)
9. [Настройка Nginx](#настройка-nginx)
10. [Настройка PM2](#настройка-pm2)
11. [Настройка SSL (Let's Encrypt)](#настройка-ssl)
12. [Проверка работоспособности](#проверка-работоспособности)
13. [Обслуживание](#обслуживание)

---

## Требования

### Минимальные требования к серверу:
- **OS**: Ubuntu Server 20.04 или 22.04 LTS
- **CPU**: 2 ядра
- **RAM**: 4 GB
- **Disk**: 20 GB SSD
- **Network**: Публичный IP-адрес
- **Domain**: Доменное имя (например, autohub.ru)

### Рекомендуемые требования для production:
- **CPU**: 4 ядра
- **RAM**: 8 GB
- **Disk**: 50 GB SSD
- **Backup**: Регулярные бэкапы базы данных

---

## 1. Подготовка сервера

### 1.1 Подключение к серверу

```bash
ssh root@ваш_ip_адрес
```

### 1.2 Обновление системы

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Создание пользователя для приложения

```bash
# Создать пользователя
sudo adduser autohub

# Добавить в группу sudo
sudo usermod -aG sudo autohub

# Переключиться на пользователя
su - autohub
```

### 1.4 Настройка firewall

```bash
# Разрешить SSH
sudo ufw allow OpenSSH

# Разрешить HTTP и HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Включить firewall
sudo ufw enable
```

---

## 2. Установка зависимостей

### 2.1 Установка Node.js (v18+)

```bash
# Добавить репозиторий NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Установить Node.js
sudo apt install -y nodejs

# Проверить версию
node --version  # должно быть v18.x или выше
npm --version
```

### 2.2 Установка PostgreSQL 15

```bash
# Добавить репозиторий PostgreSQL
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Добавить ключ
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Обновить и установить
sudo apt update
sudo apt install -y postgresql-15 postgresql-contrib-15

# Проверить статус
sudo systemctl status postgresql
```

### 2.3 Установка Redis 7

```bash
# Установить Redis
sudo apt install -y redis-server

# Включить автозапуск
sudo systemctl enable redis-server

# Запустить
sudo systemctl start redis-server

# Проверить статус
sudo systemctl status redis-server
```

### 2.4 Установка Nginx

```bash
# Установить Nginx
sudo apt install -y nginx

# Запустить
sudo systemctl start nginx
sudo systemctl enable nginx

# Проверить статус
sudo systemctl status nginx
```

### 2.5 Установка PM2 (Process Manager)

```bash
# Установить PM2 глобально
sudo npm install -g pm2

# Проверить версию
pm2 --version
```

### 2.6 Установка Git

```bash
sudo apt install -y git

# Настроить Git
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

---

## 3. Настройка PostgreSQL

### 3.1 Создание базы данных и пользователя

```bash
# Переключиться на пользователя postgres
sudo -u postgres psql

# В psql выполнить:
```

```sql
-- Создать базу данных
CREATE DATABASE autohub;

-- Создать пользователя
CREATE USER autohub_user WITH ENCRYPTED PASSWORD 'ваш_надежный_пароль';

-- Выдать права
GRANT ALL PRIVILEGES ON DATABASE autohub TO autohub_user;

-- Выйти
\q
```

### 3.2 Настройка доступа (опционально для удаленного доступа)

```bash
# Редактировать pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Добавить строку (для локального доступа уже должна быть):
# local   all             all                                     md5

# Перезапустить PostgreSQL
sudo systemctl restart postgresql
```

---

## 4. Настройка Redis

### 4.1 Настройка Redis для production

```bash
# Редактировать конфигурацию
sudo nano /etc/redis/redis.conf
```

Изменить следующие параметры:

```conf
# Привязать к localhost (если не нужен внешний доступ)
bind 127.0.0.1

# Установить максимальную память
maxmemory 256mb
maxmemory-policy allkeys-lru

# Включить persistence
save 900 1
save 300 10
save 60 10000
```

```bash
# Перезапустить Redis
sudo systemctl restart redis-server
```

---

## 5. Клонирование и настройка проекта

### 5.1 Клонирование репозитория

```bash
# Перейти в домашнюю директорию
cd ~

# Клонировать репозиторий
git clone https://github.com/your-username/crmauto.git

# Или клонировать конкретную ветку
git clone -b claude/autohub-aggregator-setup-011CUoXZrW4Xrtw4oTUwYgVY https://github.com/your-username/crmauto.git

# Перейти в директорию
cd crmauto
```

### 5.2 Структура проекта

```
crmauto/
├── backend/          # Backend API (Express.js)
├── frontend/         # Frontend (Next.js)
├── docs/            # Документация
└── docker-compose.yml
```

---

## 6. Настройка Backend

### 6.1 Установка зависимостей

```bash
cd ~/crmauto/backend
npm install
```

### 6.2 Создание .env файла

```bash
cp .env.example .env
nano .env
```

Заполнить переменные окружения:

```env
# Server
NODE_ENV=production
PORT=5000
API_URL=https://api.autohub.ru

# Database
DATABASE_URL=postgresql://autohub_user:ваш_пароль@localhost:5432/autohub

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=сгенерируйте_очень_длинный_случайный_ключ_64_символа
JWT_REFRESH_SECRET=сгенерируйте_другой_очень_длинный_случайный_ключ_64_символа
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# CORS
CORS_ORIGIN=https://autohub.ru

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Email (опционально)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=AutoHub <noreply@autohub.ru>
```

**Генерация секретных ключей:**

```bash
# Сгенерировать случайные ключи
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 6.3 Применение миграций базы данных

```bash
# Генерация Prisma Client
npx prisma generate

# Применить миграции
npx prisma migrate deploy

# Или если миграций нет, создать схему
npx prisma db push
```

### 6.4 Создание папки для загрузок

```bash
mkdir -p ~/crmauto/backend/uploads
chmod 755 ~/crmauto/backend/uploads
```

### 6.5 Сборка TypeScript

```bash
npm run build
```

### 6.6 Создание первого admin пользователя

```bash
# Временно запустить backend
npm start

# В другом терминале выполнить запрос для создания admin
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@autohub.ru",
    "password": "надежный_пароль",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'

# Остановить backend (Ctrl+C)
```

Затем вручную обновить роль в базе данных:

```bash
sudo -u postgres psql autohub

# В psql:
UPDATE users SET role = 'admin' WHERE email = 'admin@autohub.ru';
\q
```

---

## 7. Настройка Frontend

### 7.1 Установка зависимостей

```bash
cd ~/crmauto/frontend
npm install
```

### 7.2 Создание .env файла

```bash
nano .env.local
```

```env
NEXT_PUBLIC_API_URL=https://api.autohub.ru/api/v1
```

### 7.3 Сборка production версии

```bash
npm run build
```

---

## 8. Настройка Nginx

### 8.1 Создание конфигурации для Backend API

```bash
sudo nano /etc/nginx/sites-available/autohub-api
```

```nginx
server {
    listen 80;
    server_name api.autohub.ru;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /home/autohub/crmauto/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 8.2 Создание конфигурации для Frontend

```bash
sudo nano /etc/nginx/sites-available/autohub-frontend
```

```nginx
server {
    listen 80;
    server_name autohub.ru www.autohub.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8.3 Активация конфигураций

```bash
# Создать символические ссылки
sudo ln -s /etc/nginx/sites-available/autohub-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/autohub-frontend /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx
```

---

## 9. Настройка PM2

### 9.1 Запуск Backend через PM2

```bash
cd ~/crmauto/backend

# Запустить backend
pm2 start npm --name "autohub-backend" -- start

# Или с использованием ecosystem файла
pm2 start ecosystem.config.js
```

**Создание ecosystem.config.js:**

```bash
nano ~/crmauto/backend/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'autohub-backend',
    script: 'dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

```bash
# Создать папку для логов
mkdir -p ~/crmauto/backend/logs

# Запустить
pm2 start ecosystem.config.js
```

### 9.2 Запуск Frontend через PM2

```bash
cd ~/crmauto/frontend

# Запустить frontend
pm2 start npm --name "autohub-frontend" -- start
```

### 9.3 Настройка автозапуска PM2

```bash
# Сохранить текущие процессы
pm2 save

# Создать startup script
pm2 startup

# Выполнить команду, которую вернул pm2 startup (будет что-то вроде):
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u autohub --hp /home/autohub
```

### 9.4 Полезные команды PM2

```bash
# Просмотр статуса
pm2 status

# Просмотр логов
pm2 logs

# Перезапуск
pm2 restart all

# Остановка
pm2 stop all

# Удаление процессов
pm2 delete all

# Мониторинг
pm2 monit
```

---

## 10. Настройка SSL (Let's Encrypt)

### 10.1 Установка Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 10.2 Получение SSL сертификатов

```bash
# Для API
sudo certbot --nginx -d api.autohub.ru

# Для Frontend
sudo certbot --nginx -d autohub.ru -d www.autohub.ru
```

### 10.3 Автоматическое продление

```bash
# Certbot автоматически создает cron job
# Проверить:
sudo certbot renew --dry-run
```

---

## 11. Проверка работоспособности

### 11.1 Проверка Backend API

```bash
# Health check
curl https://api.autohub.ru/health

# API info
curl https://api.autohub.ru/api/v1
```

### 11.2 Проверка Frontend

Открыть в браузере:
- https://autohub.ru

### 11.3 Проверка баз данных

```bash
# PostgreSQL
sudo -u postgres psql autohub -c "SELECT COUNT(*) FROM users;"

# Redis
redis-cli ping
# Должно вернуть: PONG
```

---

## 12. Обслуживание

### 12.1 Резервное копирование базы данных

```bash
# Создать бэкап
pg_dump -U autohub_user -h localhost autohub > ~/backups/autohub_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из бэкапа
psql -U autohub_user -h localhost autohub < ~/backups/autohub_20240101_120000.sql
```

**Автоматизация бэкапов (cron):**

```bash
# Создать скрипт
nano ~/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/autohub/backups"
mkdir -p $BACKUP_DIR
pg_dump -U autohub_user -h localhost autohub > $BACKUP_DIR/autohub_$(date +%Y%m%d_%H%M%S).sql

# Удалить бэкапы старше 7 дней
find $BACKUP_DIR -name "autohub_*.sql" -mtime +7 -delete
```

```bash
# Сделать исполняемым
chmod +x ~/backup.sh

# Добавить в crontab (ежедневно в 2:00)
crontab -e

# Добавить строку:
0 2 * * * /home/autohub/backup.sh
```

### 12.2 Обновление проекта

```bash
cd ~/crmauto

# Остановить процессы
pm2 stop all

# Получить обновления
git pull origin main

# Backend
cd backend
npm install
npx prisma migrate deploy
npm run build

# Frontend
cd ../frontend
npm install
npm run build

# Запустить процессы
pm2 restart all
```

### 12.3 Мониторинг логов

```bash
# PM2 логи
pm2 logs

# Nginx логи
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# PostgreSQL логи
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Redis логи
sudo tail -f /var/log/redis/redis-server.log
```

### 12.4 Проверка использования ресурсов

```bash
# CPU и память
htop

# Диск
df -h

# PM2 мониторинг
pm2 monit
```

---

## Поздравляем! 🎉

AutoHub успешно развернут на вашем Ubuntu сервере!

**Следующие шаги:**
1. Настройте регулярные бэкапы
2. Настройте мониторинг (например, UptimeRobot)
3. Настройте email уведомления
4. Добавьте тестовые данные (города, категории, автосервисы)
5. Создайте дополнительных admin пользователей

**Полезные ресурсы:**
- [Документация PostgreSQL](https://www.postgresql.org/docs/)
- [Документация Redis](https://redis.io/docs/)
- [Документация Nginx](https://nginx.org/ru/docs/)
- [Документация PM2](https://pm2.keymetrics.io/docs/)
- [Документация Next.js](https://nextjs.org/docs)
- [Документация Express.js](https://expressjs.com/)

**Поддержка:**
- Email: support@autohub.ru
- GitHub Issues: https://github.com/your-username/crmauto/issues
