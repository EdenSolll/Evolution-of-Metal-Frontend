FROM node:alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm i --silent

COPY . .

RUN npm run build

FROM nginxinc/nginx-unprivileged as serve

WORKDIR /app

COPY --from=build /app/dist /app/

COPY nginx.conf /etc/nginx
