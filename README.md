# Онлайн-система бронирования кинотеатра

## Описание проекта

Приложение для онлайн-бронирования билетов с административной панелью.

Позволяет:

- гостям просматривать расписание, выбирать места и бронировать билеты;

- администраторам управлять залами, фильмами, сеансами и ценами;

- генерировать билеты с уникальным QR-кодом.

## Требования

PHP 8.2+

Composer

Node.js 18+

NPM

SQLite (по умолчанию; можно использовать MySQL/PostgreSQL)

Windows / Linux / MacOS

## Установка проекта

1. Клонирование репозитория

git clone <REPO_URL>

cd <PROJECT_FOLDER>

2. Установка зависимостей

Backend (Laravel): composer install

Frontend (React + Vite): npm install

3. Настройка окружения

copy .env.example .env

4. Генерация ключа приложения

php artisan key:generate

5. Миграции базы данных

php artisan migrate

Если нужно начать с чистого листа:

php artisan migrate:fresh

6. Создание симлинка для storage

Для корректной работы загрузки постеров (формат png, размер до 2 Мб):

php artisan storage:link

Загруженные файлы будут храниться в storage/app/public, а публичный доступ через public/storage.

7. Запуск проекта

Запуск Laravel сервера (бэкенд): php artisan serve

Приложение доступно по адресу: http://localhost:8000

Запуск фронтенда (React + Vite)

В режиме разработки: npm run dev

В режиме продакшена: npm run build

## Пользователи и роли ##

Администратор (admin): управляет залами, фильмами, сеансами и бронированиями.

Гость (guest): может просматривать расписание и бронировать билеты без авторизации.

**Создание администратора**

php artisan admin:create <email> <password>

Пример: php artisan admin:create admin@cinema.ru password123

Пароли хранятся в захешированном виде, используется Laravel Hash.

## Структура базы данных ##

users — пользователи (роль: admin/guest)

cinema_halls — залы (ряды, места, цены)

movies — фильмы (название, постер, описание)

screenings — сеансы (дата, время, зал, фильм)

bookings — бронирования (места, общая цена, QR-код, email)

Все данные валидируются на сервере: email уникален, пароли захешированы, бронирование проверяет занятость мест, QR-код уникален для каждого бронирования

## API Endpoints ##

Аутентификация

POST /api/login — вход администратора
Body: { "email": "...", "password": "..." }

POST /api/logout — выход авторизованного администратора

Фильмы

GET /api/movies — список всех фильмов

GET /api/movies/{id} — информация о конкретном фильме

POST /api/movies, PUT /api/movies/{id}, DELETE /api/movies/{id} — управление фильмами (админ)

Залы

GET /api/halls — список залов

GET /api/halls/{id} — информация о конкретном зале

POST /api/halls, PUT /api/halls/{id}, DELETE /api/halls/{id} — управление залами (админ)

Сеансы

GET /api/screenings — список сеансов

GET /api/screenings/{id} — конкретный сеанс

POST /api/screenings, PUT /api/screenings/{id}, DELETE /api/screenings/{id} — управление сеансами (админ)

Бронирование

POST /api/bookings — создать бронирование (гость)
Body: { "screening_id": 1, "seats": [...], "email": "..." }
Response: { "booking_code": "...", "qr_code_url": "..." }

GET /api/bookings/{code}/qr — получить QR-код билета

GET /api/admin/bookings, DELETE /api/bookings/{id} — управление бронированиями (админ)

QR-коды уникальны для каждого бронирования и включают ряд, место и сеанс


## Особенности проекта ##

SPA на React + Vite

QR-коды для билетов (simplesoftwareio/simple-qrcode)

Валидация данных на сервере (Laravel FormRequest)

Защищённые маршруты для админа через Middleware

Бронирование не позволяет выбрать занятое место

SQLite по умолчанию, можно сменить на любую поддерживаемую СУБД

Полная CRUD функциональность для залов; частичная (без редактирования) — для фильмов, сеансов и бронирований