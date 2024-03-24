#stage 1: Build frontend
FROM node:20-alpine AS frontend_builder
WORKDIR /var/www/frontend
COPY ./frontend/package*.json .
COPY ./frontend .
RUN npm install
RUN npm run build

# # Stage 2: Build backend 
FROM php:8.2-apache AS backend_builder
RUN apt-get update
RUN apt-get install -y unzip git
WORKDIR /var/www/backend
COPY ./backend/composer.* .
COPY --from=composer:lts /usr/bin/composer /usr/bin/composer
RUN composer install --no-progress --no-interaction
COPY ./backend .
RUN cp ./backend/.env.docker ./backend/.env
RUN php artisan migrate

# Stage 3: Final image 
FROM php:8.2-apache

RUN apt-get update
RUN apt-get install -y unzip git
RUN docker-php-ext-install pdo pdo_mysql bcmath

COPY ports.conf /etc/apache2/ports.conf

COPY --from=frontend_builder /var/www/frontend /var/www/frontend
COPY --from=backend_builder /var/www/backend /var/www/backend


COPY ./frontend/apache-config/frontend.conf /etc/apache2/sites-available/frontend.conf
COPY ./backend/apache-config/backend.conf /etc/apache2/sites-available/backend.conf

RUN a2enmod rewrite
RUN ln -s /etc/apache2/sites-available/frontend.conf /etc/apache2/sites-enabled/ 
RUN ln -s /etc/apache2/sites-available/backend.conf /etc/apache2/sites-enabled/

WORKDIR /var/www
RUN chown -R www-data:www-data frontend
RUN chown -R www-data:www-data backend

CMD ["apache2-foreground"]  





