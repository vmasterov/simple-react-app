Это приложение создано для того, чтобы разобраться в следующих этапах работы:
- разработка приложения на React
- контейнеризация приложения
- настройка сервера Nginx
- доставка и разворачивание приложения на сервере
- поддержка https соединения с помощью certbot
- CI/CD с github

Искать актуальные статьи на https://www.digitalocean.com
- Первоначальная настройка сервера с Ubuntu
- Установка Nginx в Ubuntu
- Как установить и использовать Docker в Ubuntu
- Установка Docker Compose

В качестве основы для обучения я использовал статью How To Secure a Containerized Node.js Application with Nginx, Let's Encrypt, and Docker Compose (https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose).

Моменты, которые были для меня не очевидны или отличались от способов реализации, предложенных в статье:
- так как мое приложение на React, а не на Node у него нет сервера Express (как в статье), поэтому мой Dockerfile отличается. Я использую multistaging (https://docs.docker.com/build/building/multi-stage/)
- в Step 5 — Modifying the Web Server Configuration and Service Definition (https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-5-modifying-the-web-server-configuration-and-service-definition) предлагается  создать папку dhparam, в которой будет храниться сертификат. Далее эту папку подключают как том (volume) в docker-compose файле, в сервисе webserver -> volumes и в общем разделе volumes. У меня такой способ вызвал ошибку (папка не копировалась) и я, вместо создания тома, выполнил монтирование (bind mount).
- нужно обязательно пройти по шагам статьи последовательно. Запустить docker-compose файл и получить готовое решение у меня не получилось. Потому что в конфигурационном файле сервиса webserver указаны ссылки на сертификаты, которые ещё не создал сервис certbot. Поэтому сначала мы используем конфигурационный файл для Nginx из Step 2 — Defining the Web Server Configuration (https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-2-defining-the-web-server-configuration), а потом из Step 5 — Modifying the Web Server Configuration and Service Definition (https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-5-modifying-the-web-server-configuration-and-service-definition)

Для запуска приложения на сервер нужно поместить следующие файлы и папки:
- папка dhparam с ключом dhparam-2048.pem, сгенерированным в Step 5 — Modifying the Web Server Configuration and Service Definition (https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-5-modifying-the-web-server-configuration-and-service-definition)
- папка nginx-conf с nginx.conf -- конфигурацией Nginx в контейнере webserver, которая используется после того, как certbot создаст сертификат. Step 5 — Modifying the Web Server Configuration and Service Definition (https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-5-modifying-the-web-server-configuration-and-service-definition)
- docker-compose.yml
- nginx.before_certbot.conf -- конфигурация Nginx в контейнере webserver, которая используется до создания сертификатов
- nginx.web.conf -- конфигурация Nginx в контейнере app (сервер статический файлов для React)
- ssl_renew.sh -- скрипт для обновления сертификатов (запускает сервис certbot по cron)

Алгоритм запуска:
- копируем указанные выше файлы на сервер
- помещаем файл nginx.before_certbot.conf в папку nginx-conf
- помещаем файл nginx.conf из папки nginx-conf во внешнюю папку
- переименовываем nginx.before_certbot.conf в nginx.conf
- запускаем docker compose up -d
- проверяем, что контейнеры созданы корректно (docker ps -a)
- останавливаем сервис webserver (docker compose stop webserver)
- заменяем файл nginx.conf в папке nginx-conf файлом nginx.conf из корневой папки
- запускаем webserver (docker compose up -d --force-recreate --no-deps webserver)

Файл с настройками CI/CD находится в папке .github/workflows/CI-CD-action.yml