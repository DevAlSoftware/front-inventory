# Usa la imagen de Node.js
FROM node:18 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto y las dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente
COPY . .

# Construye la aplicación en modo de producción
RUN npm run build --prod

# Expone el puerto 4200
EXPOSE 4200

# Comando para iniciar el servidor de desarrollo de Angular
CMD ["npm", "start"]
