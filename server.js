const express = require('express');
const { Pool } = require('pg');
const app = express();

// Configuración desde variables de entorno
const port = process.env.API_PORT || 3000;

// Configuración de la base de datos con variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'parcial_db',
  port: process.env.DB_PORT || 5432,
});

// Endpoint raíz - Muestra datos quemados (Ejercicio 1)
app.get('/', (req, res) => {
  res.json({
    estudiante: {
      nombre: 'Marcos Steven Bonilla Navarrete',
      expediente: '25610', 
      codigo: 'BN22I04001',
      asignatura: 'Implantación de Sistemas',
      parcial: 'Segundo Parcial',
      mensaje: 'Datos quemados - Ejercicio 1'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    servicio: 'API Parcial Docker',
    environment: {
      db_host: process.env.DB_HOST,
      db_name: process.env.DB_NAME
    }
  });
});

// Endpoint para crear estudiantes (INSERT)
app.post('/estudiantes', async (req, res) => {
  try {
    const { nombre, expediente, codigo_estudiantil } = req.body;
    
    const result = await pool.query(
      'INSERT INTO estudiantes (nombre, expediente, codigo_estudiantil) VALUES ($1, $2, $3) RETURNING *',
      [nombre, expediente, codigo_estudiantil]
    );
    
    res.json({
      mensaje: 'Estudiante creado exitosamente',
      estudiante: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error creando estudiante',
      detalle: error.message 
    });
  }
});

// Endpoint para listar estudiantes (SELECT)
app.get('/estudiantes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM estudiantes ORDER BY id');
    
    res.json({
      estudiantes: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error obteniendo estudiantes',
      detalle: error.message 
    });
  }
});

// Health check de la base de datos
app.get('/db-health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      database: 'Conectado correctamente',
      config: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
  console.log('Configuración BD:', {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER
  });
});