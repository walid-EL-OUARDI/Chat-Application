FROM php:8.2

RUN apt-get update -y
RUN apt-get install -y unzip libpq-dev libcurl4-gnutls-dev
RUN docker-php-ext-install pdo pdo_mysql bcmath


WORKDIR /var/www

COPY . .

COPY --from=composer:lts /usr/bin/composer /usr/bin/composer

ENV PORT=8000

# EXPOSE 8000

ENTRYPOINT [ "docker/entrypoint.sh" ]