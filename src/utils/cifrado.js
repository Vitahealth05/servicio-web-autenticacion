/**
 * cifrado.js
 * ------------------------------------------------------------
 * Funciones para proteger las contraseñas. Nunca se guardan en
 * texto plano: se genera un "hash" con el algoritmo scrypt y una
 * "sal" (salt) aleatoria distinta para cada usuario.
 * Se usa el módulo "crypto" que viene incluido en Node.js,
 * por lo que no requiere instalar librerías adicionales.
 * ------------------------------------------------------------
 */

const crypto = require('crypto');
const { promisify } = require('util');

// Convertimos scrypt (basado en callbacks) en una función que devuelve promesas
const scrypt = promisify(crypto.scrypt);

// Longitud en bytes del hash resultante
const LONGITUD_HASH = 64;

/**
 * Cifra una contraseña.
 * @param {string} contrasena Contraseña en texto plano
 * @returns {Promise<string>} Texto con el formato "sal:hash"
 */
async function cifrarContrasena(contrasena) {
  const sal = crypto.randomBytes(16).toString('hex');
  const hash = await scrypt(contrasena, sal, LONGITUD_HASH);
  return `${sal}:${hash.toString('hex')}`;
}

/**
 * Verifica si una contraseña coincide con la guardada.
 * @param {string} contrasena Contraseña enviada por el usuario
 * @param {string} guardada Valor almacenado con formato "sal:hash"
 * @returns {Promise<boolean>} true si coincide
 */
async function verificarContrasena(contrasena, guardada) {
  const [sal, hashGuardado] = guardada.split(':');
  const hashCalculado = await scrypt(contrasena, sal, LONGITUD_HASH);
  // timingSafeEqual compara en tiempo constante para evitar ataques de temporización
  return crypto.timingSafeEqual(Buffer.from(hashGuardado, 'hex'), hashCalculado);
}

module.exports = { cifrarContrasena, verificarContrasena };
