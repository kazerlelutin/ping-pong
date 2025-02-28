FROM node:14 AS base

WORKDIR /app

FROM base AS dependencies

COPY package*.json ./

RUN npm install && npm run build

FROM dependencies AS build

WORKDIR /app

COPY src /app/src
COPY tsconfig.json /app

USER node

EXPOSE 3500
EXPOSE 3505


CMD [ "npm","run","dev" ]