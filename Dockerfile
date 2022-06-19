FROM node:14.18.1-alpine as build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:14.18.1-alpine
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD npm run start:prod


