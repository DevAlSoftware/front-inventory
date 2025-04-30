# Etapa 1: Build de SSR
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:ssr

# Etapa 2: Producción para Angular SSR
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
EXPOSE 4000
CMD ["node", "dist/front-inventory/server/main.server.mjs"]
