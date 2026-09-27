/**
 * auth.controller.js
 * ------------------------------------------------------------
 * Contiene la lógica del servicio web:
 *   - registrar: crea un usuario con su contraseña cifrada.
 *   - iniciarSesion: valida usuario y contraseña y responde
 *     "Autenticación satisfactoria" o "Error en la autenticación".
 * ------------------------------------------------------------
 */

// Módulo propio que cifra y verifica contraseñas (usa "crypto", incluido en Node.js)
const { cifrarContrasena, verificarContrasena } = require('../utils/cifrado');
const { buscarUsuario, agregarUsuario } = require('../data/usuarios.store');

/**
 * Valida que la petición traiga usuario y contraseña como texto no vacío.
 * @returns {string|null} Mensaje de error o null si los datos son válidos
 */
function validarDatos(usuario, contrasena) {
  if (typeof usuario !== 'string' || typeof contrasena !== 'string') {
    return 'Debe enviar "usuario" y "contrasena" como texto';
  }
  if (usuario.trim() === '' || contrasena.trim() === '') {
    return 'El usuario y la contraseña son obligatorios';
  }
  return null;
}

/**
 * POST /api/registro
 * Cuerpo esperado: { "usuario": "daiela", "contrasena": "Clave123" }
 */
async function registrar(req, res) {
  const { usuario, contrasena } = req.body || {};

  // 1. Validamos que lleguen los datos obligatorios
  const error = validarDatos(usuario, contrasena);
  if (error) {
    return res.status(400).json({ exito: false, mensaje: error });
  }

  // 2. Validamos una longitud mínima para la contraseña
  if (contrasena.length < 6) {
    return res.status(400).json({
      exito: false,
      mensaje: 'La contraseña debe tener al menos 6 caracteres'
    });
  }

  // 3. Verificamos que el usuario no esté registrado previamente
  if (buscarUsuario(usuario.trim())) {
    return res.status(409).json({ exito: false, mensaje: 'El usuario ya existe' });
  }

  // 4. Ciframos la contraseña antes de guardarla
  const contrasenaCifrada = await cifrarContrasena(contrasena);

  // 5. Guardamos el usuario
  agregarUsuario({
    usuario: usuario.trim(),
    contrasena: contrasenaCifrada,
    fechaRegistro: new Date().toISOString()
  });

  // 6. Respondemos con código 201 (creado)
  return res.status(201).json({
    exito: true,
    mensaje: 'Usuario registrado correctamente',
    usuario: usuario.trim()
  });
}

/**
 * POST /api/login
 * Cuerpo esperado: { "usuario": "daiela", "contrasena": "Clave123" }
 */
async function iniciarSesion(req, res) {
  const { usuario, contrasena } = req.body || {};

  // 1. Validamos que lleguen los datos obligatorios
  const error = validarDatos(usuario, contrasena);
  if (error) {
    return res.status(400).json({ exito: false, mensaje: error });
  }

  // 2. Buscamos el usuario registrado
  const usuarioEncontrado = buscarUsuario(usuario.trim());

  // 3. Comparamos la contraseña enviada con la cifrada que está guardada
  const contrasenaValida = usuarioEncontrado
    ? await verificarContrasena(contrasena, usuarioEncontrado.contrasena)
    : false;

  // 4. Si el usuario no existe o la contraseña no coincide -> error en la autenticación.
  //    Por seguridad no se indica cuál de los dos datos es incorrecto.
  if (!contrasenaValida) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Error en la autenticación'
    });
  }

  // 5. Credenciales correctas -> autenticación satisfactoria
  return res.status(200).json({
    exito: true,
    mensaje: 'Autenticación satisfactoria',
    usuario: usuarioEncontrado.usuario
  });
}

module.exports = { registrar, iniciarSesion };
