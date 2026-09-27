# Servicio web de autenticación (Registro e Inicio de sesión)

**Evidencia:** GA7-220501096-AA5-EV01 – Diseño y desarrollo de servicios web – caso

**Aprendiz:** Daniela Rojas

**Tecnologías:** Node.js, Express, Git

## 1. Descripción
API REST que permite **registrar** usuarios e **iniciar sesión**. El servicio recibe un usuario y una contraseña:
- Si la autenticación es correcta responde **"Autenticación satisfactoria"**.
- En caso contrario responde **"Error en la autenticación"**.

Las contraseñas se guardan cifradas (algoritmo *scrypt* con sal aleatoria) en `src/data/usuarios.json`.

## 2. Diseño del servicio

| Método | Endpoint        | Descripción                  | Cuerpo (JSON)                                   |
|--------|-----------------|------------------------------|-------------------------------------------------|
| GET    | `/`             | Verifica que el servicio esté activo | —                                       |
| POST   | `/api/registro` | Registra un usuario nuevo    | `{ "usuario": "daniela", "contrasena": "Clave123" }` |
| POST   | `/api/login`    | Inicia sesión                | `{ "usuario": "daniela", "contrasena": "Clave123" }` |

### Respuestas

| Caso | Código HTTP | Respuesta |
|------|-------------|-----------|
| Registro exitoso | 201 | `{ "exito": true, "mensaje": "Usuario registrado correctamente" }` |
| Usuario ya existe | 409 | `{ "exito": false, "mensaje": "El usuario ya existe" }` |
| Datos incompletos / contraseña < 6 caracteres | 400 | `{ "exito": false, "mensaje": "..." }` |
| Login correcto | 200 | `{ "exito": true, "mensaje": "Autenticación satisfactoria" }` |
| Login incorrecto | 401 | `{ "exito": false, "mensaje": "Error en la autenticación" }` |

### Estructura del proyecto
```
servicio-web-autenticacion/
├── package.json                  # Dependencias y scripts
├── README.md                     # Documentación
├── postman_coleccion.json        # Pruebas listas para importar en Postman
└── src/
    ├── app.js                    # Punto de entrada: configura y levanta el servidor
    ├── routes/auth.routes.js     # Define los endpoints /registro y /login
    ├── controllers/auth.controller.js  # Lógica de registro y autenticación
    ├── data/usuarios.store.js    # Lectura/escritura de usuarios (archivo JSON)
    └── utils/cifrado.js          # Cifrado y verificación de contraseñas
```

## 3. Cómo ejecutarlo
Requisitos: Node.js 18 o superior.
```bash
npm install     # instala Express
npm start       # inicia en http://localhost:3000
```

## 4. Pruebas
Importar `postman_coleccion.json` en Postman, o usar curl:
```bash
curl -X POST http://localhost:3000/api/registro -H "Content-Type: application/json" -d "{\"usuario\":\"daiela\",\"contrasena\":\"Clave123\"}"
curl -X POST http://localhost:3000/api/login    -H "Content-Type: application/json" -d "{\"usuario\":\"daiela\",\"contrasena\":\"Clave123\"}"
```

## 5. Control de versiones
El proyecto se gestiona con **Git** y está publicado en GitHub (ver `ENLACE_REPOSITORIO.txt`).
