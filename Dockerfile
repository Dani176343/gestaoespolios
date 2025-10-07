# Stage 1: Build
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json


EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
