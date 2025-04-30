# Usa una imagen base con Node.js
FROM node:18 AS build

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia dependencias y construye el proyecto
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g @angular/cli
RUN ng build --configuration production

# Fase final: Servir contenido estático
FROM nginx:alpine

COPY --from=build /app/dist/front-inventory /usr/share/nginx/html

# Copia una configuración de nginx si quieres (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
