#!/bin/bash

echo "========================================="
echo "Проверка конфигурации сервера AutoHub"
echo "========================================="
echo ""

echo "1. Проверка статуса Nginx:"
sudo systemctl status nginx --no-pager | head -10
echo ""

echo "2. Проверка портов 80 и 443:"
sudo netstat -tulpn | grep -E ':80|:443'
echo ""

echo "3. Проверка firewall (ufw):"
sudo ufw status
echo ""

echo "4. Список конфигураций Nginx:"
ls -la /etc/nginx/sites-enabled/
echo ""

echo "5. Проверка конфигурации Nginx:"
sudo nginx -t
echo ""

echo "6. Проверка PM2 процессов:"
pm2 status
echo ""

echo "7. Проверка портов приложений (3000, 4000):"
sudo netstat -tulpn | grep -E ':3000|:4000'
echo ""

echo "8. Проверка логов Nginx (последние 10 строк):"
sudo tail -10 /var/log/nginx/error.log
echo ""

echo "9. Тест localhost backend:"
curl -s http://localhost:4000/health || echo "Backend не отвечает"
echo ""

echo "10. Тест localhost frontend:"
curl -s http://localhost:3000 | head -5 || echo "Frontend не отвечает"
echo ""

echo "========================================="
echo "Проверка завершена"
echo "========================================="
