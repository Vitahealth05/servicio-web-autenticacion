/**
 * usuarios.store.js
 * ------------------------------------------------------------
 * Capa de acceso a datos. Guarda los usuarios en un archivo
 * JSON (usuarios.json) para que la información no se pierda
 * al reiniciar el servidor. En un proyecto real esto se
 * reemplazaría por una base de datos (MySQL, MongoDB, etc.).
 * ------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

// Ruta del archivo donde se almacenan los usuarios
const RUTA_ARCHIVO = path.join(__dirname, 'usuarios.json');

/**
 * Lee todos los usuarios del archivo.
 * Si el archivo no existe todavía, devuelve una lista vacía.
 * @returns {Array<{usuario: string, contrasena: string, fechaRegistro: string}>}
 */
function obtenerUsuarios() {
  if (!fs.existsSync(RUTA_ARCHIVO)) {
    return [];
  }
  const contenido = fs.readFileSync(RUTA_ARCHIVO, 'utf-8');
  return contenido ? JSON.parse(contenido) : [];
}

/**
 * Guarda la lista completa de usuarios en el archivo.
 * @param {Array} usuarios
 */
function guardarUsuarios(usuarios) {
  fs.writeFileSync(RUTA_ARCHIVO, JSON.stringify(usuarios, null, 2), 'utf-8');
}

/**
 * Busca un usuario por su nombre (sin distinguir mayúsculas).
 * @param {string} nombreUsuario
 * @returns {object|undefined}
 */
function buscarUsuario(nombreUsuario) {
  return obtenerUsuarios().find(
    (u) => u.usuario.toLowerCase() === nombreUsuario.toLowerCase()
  );
}

/**
 * Agrega un usuario nuevo y lo guarda en el archivo.
 * @param {object} nuevoUsuario
 */
function agregarUsuario(nuevoUsuario) {
  const usuarios = obtenerUsuarios();
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
}

module.exports = { buscarUsuario, agregarUsuario };
