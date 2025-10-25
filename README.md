# Para ejecutar los ejercicios es necesario ejecutar npm install para que se genere el package-lock.json y copie las dependencias de este mismo

npm install

# EJERCICIO 1

# Construir la imagen
docker build -t parcial-api .

# Ejecutar el contenedor
docker run -d -p 3000:3000 --name parcial-container parcial-api

# Verificar contenedores en ejecución
docker ps

# Probar endpoints
curl http://localhost:3000/
curl http://localhost:3000/health

# Ver logs del contenedor
docker logs parcial-container

# Inspeccionar la imagen
docker images | grep parcial-api


# EJERCICIO 2
Comandos de Ejecución
# 1. Crear volumen para persistencia
docker volume create db_data

# 2. Ejecutar contenedor PostgreSQL
docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=12345 \
  -e POSTGRES_DB=parcial_db \
  -v db_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15-alpine

# 3. Crear tabla en la base de datos
docker exec postgres-db psql -U admin -d parcial_db -c "
CREATE TABLE estudiantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    expediente VARCHAR(50) UNIQUE NOT NULL,
    codigo_estudiantil VARCHAR(50) UNIQUE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"

# 4. Insertar datos de prueba
docker exec postgres-db psql -U admin -d parcial_db -c "
INSERT INTO estudiantes (nombre, expediente, codigo_estudiantil) VALUES 
('Marcos Steven Bonilla Navarrete', '25610', 'BN22I04001'),
('Ana María García López', '25611', 'GL22I04002'),
('Carlos José Hernández', '25612', 'HE22I04003'),
('Laura Patricia Martínez', '25613', 'MA22I04004');"

# 5. Verificar datos insertados
docker exec postgres-db psql -U admin -d parcial_db -c "SELECT * FROM estudiantes;"

# Detener y eliminar contenedor PostgreSQL
docker stop postgres-db
docker rm postgres-db

# Volver a ejecutar con mismo volumen
docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=12345 \
  -e POSTGRES_DB=parcial_db \
  -v db_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15-alpine

# Verificar que los datos persisten
docker exec postgres-db psql -U admin -d parcial_db -c "SELECT * FROM estudiantes;"

#  EJERCICIO 3 - INTEGRACIÓN CON DOCKER COMPOSE

###  Objetivo
Integrar los servicios en un único archivo docker-compose.yml con red, dependencias y healthcheck.

### 📁 Archivos del Ejercicio 3
- `docker-compose.yml` - Orquestación de servicios (versión 3.8)
- `.env` - Variables de entorno
- `docs/evidencias/ejercicio3/` - Capturas de evidencia

---

##  CONFIGURACIÓN DOCKER COMPOSE

###  docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: parcial-db
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: parcial-api
    environment:
      DB_HOST: db
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      DB_PORT: 5432
      API_PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app_net
    restart: unless-stopped

volumes:
  db_data:
    external: true

networks:
  app_net:
    driver: bridge


## env
DB_HOST=db
DB_USER=admin
DB_PASSWORD=12345
DB_NAME=parcial_db
DB_PORT=5432
API_PORT=3000

## COMANDOS DE EJECUCIÓN
## Levantar todos los servicios

docker compose up -d --build

##Ver estado de los servicios

docker compose ps

## Probar endpoint

# Endpoint básico
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health

# Health check de base de datos
curl http://localhost:3000/db-health

# Listar estudiantes
curl http://localhost:3000/estudiantes

# Crear nuevo estudiante
curl -X POST http://localhost:3000/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Estudiante Docker Compose",
    "expediente": "EXP-DC-001", 
    "codigo_estudiantil": "COD-DC-001"
  }'

  # Detener sin eliminar volúmenes
docker compose down

# Detener y eliminar volúmenes
docker compose down -v