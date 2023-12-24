FROM node:20.10.0-alpine as app
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN yarn install --frozen-lockfile
COPY --chown=node:node . .
EXPOSE 3000
RUN yarn build

FROM nginx:1.25.3-alpine
COPY --from=app /home/node/app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.web.conf /etc/nginx/conf.d
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]