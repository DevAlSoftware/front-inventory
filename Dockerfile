# Etapa de construcción
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Etapa final: usar Nginx para servir
FROM nginx:alpine

COPY --from=build /app/dist/front-inventory /usr/share/nginx/html

# Opcional: configuración personalizada de Nginx
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
