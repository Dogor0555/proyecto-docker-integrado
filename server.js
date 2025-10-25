const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({
    estudiante: {
      nombre: 'Marcos Steven Bonilla Navarrete',
      expediente: '25610',
      codigo: 'BN22I04001',
      asignatura: 'Implantación de Sistemas',
      parcial: 'Segundo Parcial'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});