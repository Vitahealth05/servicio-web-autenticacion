/**
 * app.js
 * ------------------------------------------------------------
 * Punto de entrada del servicio web de autenticación.
 * Evidencia: GA7-220501096-AA5-EV01
 * Autora: Daiela Rojas
 *
 * Levanta un servidor HTTP con Express que expone dos servicios:
 *   POST /api/registro  -> registra un usuario nuevo
 *   POST /api/login     -> valida usuario y contraseña
 * ------------------------------------------------------------
 */

// Importamos Express, framework para construir la API REST
const express = require('express');

// Importamos las rutas de autenticación
const authRoutes = require('./routes/auth.routes');

// Creamos la aplicación
const app = express();

// Puerto en el que escuchará el servidor (variable de entorno o 3000 por defecto)
const PUERTO = process.env.PORT || 3000;

// Middleware que permite leer el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Ruta raíz: sirve para comprobar que el servicio está activo
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servicio web de autenticación activo',
    endpoints: {
      registro: 'POST /api/registro',
      login: 'POST /api/login'
    }
  });
});

// Registramos las rutas de autenticación bajo el prefijo /api
app.use('/api', authRoutes);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores, por ejemplo un JSON mal formado en la petición
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciamos el servidor solo si este archivo se ejecuta directamente
if (require.main === module) {
  app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
  });
}

// Exportamos la app para poder usarla en pruebas
module.exports = app;
