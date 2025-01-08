# Build stage
FROM node:alpine as build

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
