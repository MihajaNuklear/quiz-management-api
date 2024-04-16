FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g npm@10.5.2

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

RUN npm run build
