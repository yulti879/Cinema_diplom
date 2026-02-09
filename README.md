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

Запуск Laravel сервера (Backend)

php artisan serve

Приложение доступно по адресу:

http://localhost:8000

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

npm install


### 3. Настройка окружения

Windows: copy .env.example .env
Linux/MacOS: cp .env.example .env

По умолчанию используется SQLite: database/database.sqlite


### 4. Генерация ключа приложения

php artisan key:generate


### 5. Миграции базы данных

php artisan migrate


Если нужно начать с чистого листа: 

php artisan migrate:fresh


### 6. Создание симлинка для storage

Файлы (постеры фильмов) загружаются через Laravel Filesystem (disk: public)
и физически хранятся в `storage/app/public`.

Для корректной работы загрузки постеров и других файлов необходимо создать
символическую ссылку из `public/storage` в `storage/app/public`:

php artisan storage:link

(без этого шага загруженные изображения не будут отображаться, несмотря на успешную загрузку).


### 7. Запуск сервера

1. Запустите оба сервера в разных терминалах:

Backend: php artisan serve

Frontend:

в режиме разработки: npm run dev

в режиме продакшена: npm run build

2. Откройте приложение в браузере: http://localhost:8000



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
- Билет можно заказать на почту, заполнив форму на странице бронирования

### Фильмы

GET /api/movies — список фильмов

GET /api/movies/{id} — конкретный фильм

Админ: создание/удаление фильмов

### Залы

GET /api/halls — список залов

GET /api/halls/{id} — конкретный зал

Админ: создание/удаление залов, настройка цен VIP/обычные

### Сеансы

GET /api/screenings — список сеансов

GET /api/screenings/{id} — конкретный сеанс

Админ: создание/удаление сеансов, связь с фильмами и залами

### Бронирование

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

## Frontend (React + Vite)

### Установка

cd resources/js
npm install


### Запуск разработки

npm run dev


### Сборка для продакшена

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

Полная CRUD функциональность для залов, частичная (без редактирования) – для фильмов, сеансов и бронирований