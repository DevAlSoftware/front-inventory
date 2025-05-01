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

# Comando para servir el frontend en modo de desarrollo
CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]