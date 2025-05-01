# Usa una imagen base con Node.js
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del proyecto
COPY . .

# Instala las dependencias necesarias para Angular
RUN npm install -g @angular/cli

# Expone el puerto donde va a correr dentro del contenedor
EXPOSE 4200

#  Reemplazamos el serve por build + SSR server (y así toma el environment.prod.ts)
CMD ["sh", "-c", "npm run build:ssr -- --configuration production && node dist/front-inventory/server/main.js"]
