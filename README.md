Это приложение создано для того, чтобы разобраться в следующих этапах работы:
- разработка приложения на React
- контейниризация приложения
- настройка сервера Nginx
- доставка и разворачивания приложения на сервере
- поддержка https соединения с помощью certbot
- CI/CD с github

В качестве обучающих материалов использовалась статья How To Secure a Containerized Node.js Application with Nginx, Let's Encrypt, and Docker Compose (https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose).

Моменты, которые были для меня не очевидны или отличались от способов реализации, предложенных в статье:
- так как мое приложение на React, а не на Node у него нет сервера Express (как в статье), поэтому мой Dockerfile отличается. Я использую multistaging (https://docs.docker.com/build/building/multi-stage/)
- в Step 5 — Modifying the Web Server Configuration and Service Definition (https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-5-modifying-the-web-server-configuration-and-service-definition) предлагается  создать папку dhparam, в которой будет храниться сертификат. Далее эту папку подключают как том (volume) в docker-compose файле, в сервисе webserver -> volumes и в общем разделе volumes. У меня такой способ вызвал ошибку (папка не копировалась) и я, вместо создания тома, выполнил монтирование (bind mount).
- нужно обязательно пройти по шагам статьи последовательно. Запустить docker-compose файл и получить готовое решение у меня не получилось. Потому что в конфигурационном файле сервиса webserver указаны ссылки на сертификаты, которые ещё не создал сервис certbot. Поэтому сначала мы используем конфигурацию из Step 2 — Defining the Web Server Configuration (https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-2-defining-the-web-server-configuration), а потом из Step 5 — Modifying the Web Server Configuration and Service Definition (https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose#step-5-modifying-the-web-server-configuration-and-service-definition) 