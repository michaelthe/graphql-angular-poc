FROM node:lts-alpine as builder

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY ./src ./src
COPY ./angular.json .
COPY ./tsconfig.json .
COPY ./tsconfig.app.json .

RUN npm run build -- --prod

FROM nginx:alpine

COPY --from=builder /app/dist/client /var/www/html
COPY nginx /etc/nginx/conf.d/default.conf
