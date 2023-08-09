FROM node:18-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install npm@latest -g

COPY package*.json ./
RUN  npm install

COPY ./src ./src
COPY ./files ./files

CMD [ "npm","run","dev"]
