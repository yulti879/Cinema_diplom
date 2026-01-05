# Cinema Booking App

Приложение для бронирования билетов в кинотеатр. Backend на Laravel 12+, frontend на React + Vite (TypeScript).

Позволяет гостям бронировать места, а администраторам управлять залами, фильмами и сеансами.

## Требования

PHP 8.2+

Composer

Node.js 18+

NPM

SQLite (по умолчанию; можно использовать MySQL/PostgreSQL)

Windows / Linux / MacOS

## Установка проекта

### 1. Клонирование репозитория

git clone <REPO_URL>
cd <PROJECT_FOLDER>


### 2. Установка зависимостей

Backend (Laravel):

composer install


Frontend (React + Vite):

cd resources/js
npm install
cd ../..


### 3. Настройка окружения

copy .env.example .env

По умолчанию используется SQLite: database/database.sqlite


### 4. Генерация ключа приложения

php artisan key:generate


### 5. Миграции базы данных

php artisan migrate


Если нужно начать с чистого листа: 

php artisan migrate:fresh


### 6. Запуск сервера

php artisan serve
npm run dev


Frontend будет доступен по умолчанию на http://localhost:5173


## Пользователи и роли

**Администратор (admin)** — управляет залами, фильмами, сеансами и бронированиями.

**Гость (guest)** — может просматривать расписание, выбирать места и бронировать билеты без авторизации.

Пароли хранятся в захешированном виде, используется Laravel Hash.

### Создание администратора
Для создания администратора используется встроенная команда Artisan:

php artisan admin:create <email> <password>

Пример:

php artisan admin:create admin@cinema.ru password123

Администратор сможет управлять залами, фильмами, сеансами и бронированиями через API.

## Структура базы данных

Таблицы:

users — пользователи (роль: admin/guest)

cinema_halls — залы (рядов, мест, цены)

movies — фильмы (название, постер, описание)

screenings — сеансы (дата, время, зал, фильм)

bookings — бронирования (места, общая цена, QR-код, email)

personal_access_tokens — для API токенов (если используется Sanctum)

Все данные валидируются на сервере:

email уникален

пароли захешированы

бронирование проверяет занятость мест

QR-код уникален для каждого бронирования

## API Endpoints
### Аутентификация

Администратор
- Логин: POST /api/login
  Body (JSON):
  {
    "email": "admin@example.com",
    "password": "пароль"
  }
  Ответ: данные админа + роль

- Логаут: POST /api/logout
  Cookie сессии обязательно
  Ответ: success: true

Гости
- Не требуют регистрации или логина
- Бронирование возможно сразу, только через email для получения QR-кода

## Фильмы

GET /api/movies — список фильмов

GET /api/movies/{id} — конкретный фильм

Админ: создание/редактирование/удаление фильмов

Залы

GET /api/halls — список залов

GET /api/halls/{id} — конкретный зал

Админ: CRUD залов, настройка цен VIP/обычные

Сеансы

GET /api/screenings — список сеансов

GET /api/screenings/{id} — конкретный сеанс

Админ: CRUD сеансов, связь с фильмами и залами

Бронирование

Гость:

POST /api/bookings
Body: {
  "screening_id": 1,
  "seats": [
    { "row": 1, "seat": 5, "type": "standard" },
    { "row": 1, "seat": 6, "type": "vip" }
  ],
  "email": "guest@example.com"
}


Response:

{
  "booking_code": "BKABC123",
  "qr_code_url": "http://localhost:8000/api/bookings/BKABC123/qr"
}


QR-код билета

GET /api/bookings/{code}/qr


Возвращает изображение QR-кода с информацией о бронировании (ряд, место, сеанс).

Админ:

GET /api/admin/bookings
DELETE /api/bookings/{id}

Загрузка постеров (админ)
POST /api/upload-poster
FormData: poster=<файл>

Frontend (React + Vite)

Установка

cd resources/js
npm install


Запуск разработки

npm run dev


Сборка для продакшена

npm run build


Сборка будет в resources/js/dist

Примечание для SPA и Vite:
Если фронтенд и бэкенд на разных портах, настройка прокси в vite.config.ts:

server: { proxy: { '/api': 'http://localhost:8000' } }

## Особенности проекта

SPA на React + Vite

QR-коды для билетов (simplesoftwareio/simple-qrcode)

Валидация данных на сервере (Laravel FormRequest)

Защищённые маршруты для админа через Middleware

Бронирование не позволяет выбрать уже занятое место

SQLite по умолчанию, можно сменить на любую поддерживаемую СУБД

Полная CRUD функциональность для фильмов, залов, сеансов и бронирований