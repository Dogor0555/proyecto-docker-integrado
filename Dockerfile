FROM node:18-alpine

# Información del mantenedor
LABEL maintainer="bn22i04001@usonsonate.edu.sv"

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Cambiar propietario de los archivos al usuario no-root
RUN chown -R nodeuser:nodejs /app

# Cambiar al usuario no-root
USER nodeuser

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]