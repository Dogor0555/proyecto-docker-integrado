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