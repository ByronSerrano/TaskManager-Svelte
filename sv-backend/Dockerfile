FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el código fuente
COPY src ./src
COPY public ./public

# Crear directorio para imágenes si no existe
RUN mkdir -p /app/public/images

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "src/index.js"]
