# Руководство по устранению неполадок AutoHub

Это руководство поможет вам решить распространенные проблемы при развертывании и эксплуатации AutoHub.

## Содержание

1. [Проблемы с Backend API](#проблемы-с-backend-api)
2. [Проблемы с Frontend](#проблемы-с-frontend)
3. [Проблемы с базой данных](#проблемы-с-базой-данных)
4. [Проблемы с Nginx](#проблемы-с-nginx)
5. [Проблемы с PM2](#проблемы-с-pm2)
6. [Проблемы с SSL](#проблемы-с-ssl)
7. [Проблемы производительности](#проблемы-производительности)

---

## Проблемы с Backend API

### Backend не запускается

**Симптомы:**
- PM2 показывает статус "errored" или "stopped"
- API недоступен

**Решение:**

```bash
# Проверить логи PM2
pm2 logs autohub-backend --lines 100

# Проверить, занят ли порт
sudo lsof -i :5000

# Если порт занят, убить процесс
sudo kill -9 <PID>

# Проверить .env файл
cd ~/crmauto/backend
cat .env

# Попробовать запустить вручную
npm start
```

**Возможные причины:**
- Неправильные переменные окружения
- Порт уже занят
- Отсутствуют зависимости (npm install)
- Не применены миграции БД

---

### Ошибка подключения к PostgreSQL

**Симптомы:**
- Error: `connect ECONNREFUSED 127.0.0.1:5432`
- Error: `password authentication failed`

**Решение:**

```bash
# Проверить статус PostgreSQL
sudo systemctl status postgresql

# Запустить PostgreSQL, если остановлен
sudo systemctl start postgresql

# Проверить подключение
sudo -u postgres psql -c "SELECT version();"

# Проверить существование базы данных
sudo -u postgres psql -l | grep autohub

# Проверить пользователя и пароль
sudo -u postgres psql

# В psql:
\du
\c autohub
SELECT current_user;
```

**Проверить DATABASE_URL в .env:**

```env
DATABASE_URL=postgresql://autohub_user:ваш_пароль@localhost:5432/autohub
```

---

### Ошибка подключения к Redis

**Симптомы:**
- Error: `connect ECONNREFUSED 127.0.0.1:6379`

**Решение:**

```bash
# Проверить статус Redis
sudo systemctl status redis-server

# Запустить Redis
sudo systemctl start redis-server

# Проверить подключение
redis-cli ping
# Должно вернуть: PONG

# Проверить REDIS_URL в .env
cat ~/crmauto/backend/.env | grep REDIS_URL
```

---

### JWT ошибки

**Симптомы:**
- Error: `jwt malformed`
- Error: `invalid signature`
- 401 Unauthorized

**Решение:**

```bash
# Проверить JWT секреты в .env
cat ~/crmauto/backend/.env | grep JWT

# Сгенерировать новые ключи
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Обновить .env
nano ~/crmauto/backend/.env

# Перезапустить backend
pm2 restart autohub-backend
```

**Важно:** После смены JWT ключей все пользователи должны войти заново!

---

## Проблемы с Frontend

### Frontend не отображается

**Симптомы:**
- Белая страница
- 502 Bad Gateway
- Cannot GET /

**Решение:**

```bash
# Проверить PM2 статус
pm2 status autohub-frontend

# Проверить логи
pm2 logs autohub-frontend --lines 50

# Проверить, занят ли порт 3000
sudo lsof -i :3000

# Попробовать запустить вручную
cd ~/crmauto/frontend
npm start

# Проверить .env.local
cat .env.local
```

---

### API запросы не работают

**Симптомы:**
- CORS ошибки
- Network errors
- 404 Not Found для API

**Решение:**

```bash
# Проверить NEXT_PUBLIC_API_URL
cat ~/crmauto/frontend/.env.local

# Должно быть:
# NEXT_PUBLIC_API_URL=https://api.autohub.ru/api/v1

# Проверить доступность API
curl https://api.autohub.ru/health

# Проверить CORS_ORIGIN в backend .env
cat ~/crmauto/backend/.env | grep CORS_ORIGIN

# Должно быть:
# CORS_ORIGIN=https://autohub.ru

# Пересобрать frontend
cd ~/crmauto/frontend
npm run build
pm2 restart autohub-frontend
```

---

## Проблемы с базой данных

### Ошибка миграции Prisma

**Симптомы:**
- Error: `Migration ... failed`
- Error: `Table already exists`

**Решение:**

```bash
cd ~/crmauto/backend

# Проверить статус миграций
npx prisma migrate status

# Применить миграции заново
npx prisma migrate deploy

# Если миграции сломаны, сбросить (ОСТОРОЖНО!)
npx prisma migrate reset  # Удалит все данные!

# Или создать схему без миграций
npx prisma db push
```

---

### База данных заполнена

**Симптомы:**
- Error: `disk full`
- Медленные запросы

**Решение:**

```bash
# Проверить размер БД
sudo -u postgres psql autohub -c "SELECT pg_size_pretty(pg_database_size('autohub'));"

# Проверить размер таблиц
sudo -u postgres psql autohub -c "SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"

# Очистить логи PostgreSQL
sudo -u postgres psql -c "SELECT pg_stat_statements_reset();"

# Vacuum (очистка)
sudo -u postgres psql autohub -c "VACUUM FULL;"
```

---

## Проблемы с Nginx

### 502 Bad Gateway

**Симптомы:**
- Nginx показывает 502 Bad Gateway

**Решение:**

```bash
# Проверить статус Nginx
sudo systemctl status nginx

# Проверить логи Nginx
sudo tail -f /var/log/nginx/error.log

# Проверить, работает ли backend/frontend
pm2 status

# Проверить конфигурацию Nginx
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx

# Проверить SELinux (если включен)
sudo setenforce 0  # Временно отключить для теста
```

---

### Загрузка файлов не работает

**Симптомы:**
- Error: `413 Request Entity Too Large`
- Файлы не загружаются

**Решение:**

```bash
# Проверить client_max_body_size в Nginx
sudo nano /etc/nginx/sites-available/autohub-api

# Должно быть:
# client_max_body_size 10M;

# Перезапустить Nginx
sudo systemctl restart nginx

# Проверить права на папку uploads
ls -la ~/crmauto/backend/uploads
chmod 755 ~/crmauto/backend/uploads
```

---

## Проблемы с PM2

### PM2 процессы не сохраняются после перезагрузки

**Симптомы:**
- После reboot процессы не запускаются

**Решение:**

```bash
# Запустить процессы
cd ~/crmauto/backend
pm2 start ecosystem.config.js

cd ~/crmauto/frontend
pm2 start npm --name "autohub-frontend" -- start

# Сохранить
pm2 save

# Создать startup script
pm2 startup

# Выполнить команду, которую вернул pm2 startup
```

---

### PM2 показывает высокое использование памяти

**Симптомы:**
- Высокое потребление RAM
- Memory leak

**Решение:**

```bash
# Проверить использование памяти
pm2 monit

# Перезапустить процессы
pm2 restart all

# Настроить автоперезагрузку при достижении лимита памяти
# В ecosystem.config.js добавить:
# max_memory_restart: '500M'

# Включить режим cluster для backend
# В ecosystem.config.js:
# instances: 2,
# exec_mode: 'cluster'
```

---

## Проблемы с SSL

### Certbot не может получить сертификат

**Симптомы:**
- Error: `Failed to obtain certificate`
- DNS validation failed

**Решение:**

```bash
# Проверить, что домен указывает на ваш IP
nslookup autohub.ru
nslookup api.autohub.ru

# Проверить, что порты 80 и 443 открыты
sudo ufw status

# Проверить Nginx конфигурацию
sudo nginx -t

# Попробовать получить сертификат вручную
sudo certbot certonly --webroot -w /var/www/html -d autohub.ru -d www.autohub.ru

# Если не помогает, использовать DNS validation
sudo certbot certonly --manual --preferred-challenges dns -d autohub.ru -d www.autohub.ru
```

---

### SSL сертификат истек

**Симптомы:**
- Error: `certificate has expired`

**Решение:**

```bash
# Продлить сертификат вручную
sudo certbot renew

# Проверить автоматическое продление
sudo certbot renew --dry-run

# Проверить cron/systemd timer
sudo systemctl status certbot.timer
```

---

## Проблемы производительности

### Медленная загрузка страниц

**Решение:**

```bash
# Включить gzip сжатие в Nginx
sudo nano /etc/nginx/nginx.conf

# Добавить в http секцию:
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

# Перезапустить Nginx
sudo systemctl restart nginx

# Настроить кэширование в Nginx
# В server блоке добавить:
location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

---

### Высокая нагрузка на CPU

**Решение:**

```bash
# Проверить процессы
htop

# Проверить PM2
pm2 monit

# Включить режим cluster для backend
# ecosystem.config.js:
instances: 'max',  # Использовать все доступные ядра
exec_mode: 'cluster'

# Перезапустить
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

---

### Медленные запросы к базе данных

**Решение:**

```bash
# Проверить медленные запросы
sudo -u postgres psql autohub

# В psql:
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

# Создать индексы (если нужно)
CREATE INDEX idx_services_city_id ON services(city_id);
CREATE INDEX idx_reviews_service_id ON reviews(service_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

# Обновить статистику
ANALYZE;
```

---

## Полезные команды для диагностики

```bash
# Проверить все сервисы
sudo systemctl status postgresql
sudo systemctl status redis-server
sudo systemctl status nginx
pm2 status

# Проверить порты
sudo netstat -tulpn | grep LISTEN

# Проверить диск
df -h
du -sh ~/crmauto/*

# Проверить память
free -h

# Проверить CPU
top
htop

# Проверить логи системы
sudo journalctl -xe

# Проверить последние ошибки Nginx
sudo tail -n 100 /var/log/nginx/error.log

# Проверить подключения к PostgreSQL
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

---

## Получение помощи

Если проблема не решена:

1. **Соберите информацию:**
   ```bash
   # Версии
   node --version
   npm --version
   psql --version
   redis-cli --version
   nginx -v

   # Логи
   pm2 logs --lines 100 > ~/logs.txt
   sudo tail -n 100 /var/log/nginx/error.log >> ~/logs.txt
   ```

2. **Создайте issue на GitHub:**
   - https://github.com/your-username/crmauto/issues

3. **Отправьте email:**
   - support@autohub.ru

**Укажите в запросе:**
- Описание проблемы
- Шаги для воспроизведения
- Версии ПО
- Логи ошибок
- ОС и версия Ubuntu
