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

