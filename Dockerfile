### First stage ###
FROM node:14-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

##########################

### Second stage ###
FROM node:14-alpine

COPY --from=build /app/build /app

WORKDIR /app

RUN npm ci --production

CMD ["node", "ace", "start"]