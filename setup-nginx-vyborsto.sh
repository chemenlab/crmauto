#!/bin/bash

echo "========================================="
echo "Настройка Nginx для vyborsto.ru"
echo "========================================="
echo ""

# Создаем конфигурацию для API
echo "Создание конфигурации для API (api.vyborsto.ru)..."
sudo tee /etc/nginx/sites-available/vyborsto-api > /dev/null <<'EOF'
server {
    listen 80;
    server_name api.vyborsto.ru;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:4000;
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
        alias /home/autohub/testingpanel/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo "✓ Конфигурация API создана"
echo ""

# Создаем конфигурацию для Frontend
echo "Создание конфигурации для Frontend (vyborsto.ru)..."
sudo tee /etc/nginx/sites-available/vyborsto-frontend > /dev/null <<'EOF'
server {
    listen 80;
    server_name vyborsto.ru www.vyborsto.ru;

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
EOF

echo "✓ Конфигурация Frontend создана"
echo ""

# Удаляем старые конфигурации autohub если есть
echo "Удаление старых конфигураций autohub..."
sudo rm -f /etc/nginx/sites-enabled/autohub-api
sudo rm -f /etc/nginx/sites-enabled/autohub-frontend

# Активируем новые конфигурации
echo "Активация конфигураций..."
sudo ln -sf /etc/nginx/sites-available/vyborsto-api /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/vyborsto-frontend /etc/nginx/sites-enabled/

echo "✓ Конфигурации активированы"
echo ""

# Проверяем конфигурацию
echo "Проверка конфигурации Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✓ Конфигурация Nginx корректна"
    echo ""
    echo "Перезагрузка Nginx..."
    sudo systemctl reload nginx
    echo "✓ Nginx перезагружен"
else
    echo "✗ Ошибка в конфигурации Nginx"
    exit 1
fi

echo ""
echo "========================================="
echo "Настройка Nginx завершена!"
echo "========================================="
echo ""
echo "Следующие шаги:"
echo "1. Убедитесь что домены направлены на IP: 5.188.166.3"
echo "   - api.vyborsto.ru -> 5.188.166.3"
echo "   - vyborsto.ru -> 5.188.166.3"
echo "   - www.vyborsto.ru -> 5.188.166.3"
echo ""
echo "2. Проверьте что backend и frontend запущены:"
echo "   pm2 status"
echo ""
echo "3. Откройте порты в firewall:"
echo "   sudo ufw allow 80/tcp"
echo "   sudo ufw allow 443/tcp"
echo "   sudo ufw enable"
echo ""
