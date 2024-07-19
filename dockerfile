FROM node:lts-alpine3.20

ENV DIR=/app

WORKDIR $DIR

RUN apk update && apk upgrade

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

ARG PORT
EXPOSE $PORT
