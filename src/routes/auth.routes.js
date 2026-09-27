/**
 * auth.routes.js
 * ------------------------------------------------------------
 * Define las rutas (endpoints) del servicio de autenticación
 * y las conecta con las funciones del controlador.
 * ------------------------------------------------------------
 */

const { Router } = require('express');
const { registrar, iniciarSesion } = require('../controllers/auth.controller');

const router = Router();

// POST /api/registro -> crea un usuario nuevo
router.post('/registro', registrar);

// POST /api/login -> valida las credenciales del usuario
router.post('/login', iniciarSesion);

module.exports = router;
