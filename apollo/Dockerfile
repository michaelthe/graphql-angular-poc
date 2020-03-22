FROM node:12-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install


COPY src ./src
COPY tsconfig.json .

RUN ls -la
RUN npm run build

ENV DATABASE='localhost'

CMD npm run start
