# ALPAC (GO Lampa 0.1b)

ALPAC — это self-hosted backend для Lampa с упором на быстрый запуск, стабильную работу и удобное тестирование через Docker.

## Что умеет

- Онлайн-балансеры (включая multi-source сценарии)
- Торренты и TorrServer-интеграции
- YouTube-интеграция
- SISI-модуль
- Прокси-режимы для воспроизведения
- Готовый Docker-пакет для развёртывания “из коробки”

## Для кого

- Для тестеров, которым нужен быстрый запуск без ручной сборки
- Для админов, которые хотят развернуть сервис на VPS/домашнем сервере

## Быстрый старт (рекомендуется)
 

```bash
git clone https://github.com/Kirill9732/Alcopac_docker.git
cd <YOUR_REPO>/for_docker
chmod +x install.sh
./install.sh
docker compose up -d --build
```

### Установщик запросит:

Telegram Bot Token @BotFather

Telegram Admin ID @Get_myidrobot

Токены провайдеров (опционально)

### Плагины Lampa
После запуска доступны стандартные endpoints:

http://<HOST>:18118/on.js

http://<HOST>:18118/online.js

http://<HOST>:18118/sisi.js

http://<HOST>:18118/dlna.js

http://<HOST>:18118/tracks.js

http://<HOST>:18118/backup.js

http://<HOST>:18118/sync.js

http://<HOST>:18118/ts.js

### Конфигурация
Основной конфиг: current.conf
Инициализационные параметры: init.json
Кэш: cache/

### Обновление
docker compose down
docker compose pull
docker compose up -d

### Если обновляете локальную сборку:

docker compose down
docker compose build --no-cache
docker compose up -d
Логи и диагностика
docker compose logs -f lampac-go

### Дисклеймер
Проект предоставляется “как есть”. В данный момент находится на этапе разработки.
Использование и настройка источников контента — зона ответственности пользователя и в рамках законов вашей страны.

Помощь: [https://t.me/@LampacTalks](http://tlgg.ru/LampacTalks)
