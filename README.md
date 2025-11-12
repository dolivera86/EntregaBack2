# Entrega-Backend2
## Comisión 77260
## Diego Olivera

Aplicación backend desarrollada con Node.js y Express, que implementa un sistema completo de autenticación y autorización de usuarios utilizando Passport.js con estrategias Local y JWT.

El proyecto sigue una arquitectura modular y escalable, con separación por capas (rutas, controladores, servicios, middlewares y configuración).

## Características Principales

* Autenticación Local: Registro e inicio de sesión con validación de credenciales
* JWT (JSON Web Tokens): Generación y validación de tokens seguros
* Cookies Seguras: Almacenamiento seguro de tokens en cookies HTTPOnly
* Passport.js: Estrategias de autenticación (Local y JWT)
* Encriptación de Contraseñas: Uso de bcrypt para hash seguro
* Gestión de Usuarios: Modelo con validación de datos
* Control de Roles: Autorización basada en roles (user/admin)
* MongoDB + Mongoose: Persistencia NoSQL robusta
* Manejo Centralizado de Errores: Middleware personalizado

Entrega-Backend2/
├── src/
│   ├── config/
│   │   ├── passport.config.js
│   │   └── jwt.config.js
│   │
│   ├── controllers/
│   │   └── auth.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── models/
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── productRouter.js
│   │   ├── cartRouter.js
│   │   └── viewsRouter.js
│   │
│   ├── services/
│   │   └── auth.service.js
│   │
│   ├── utils/
│   │   ├── password.util.js
│   │   └── constantsUtil.js
│   │
│   ├── views/
│   ├── public/
│   ├── websocket.js
│   └── app.js
│
├── .env
├── package.json
└── README.md

# Pruebas en Postman
## Registrar Nuevo Usuario
* BASE_URL: http://localhost:3000
* POST {{BASE_URL}}/api/sessions/register

Ejemplo:
{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 30,
    "password": "password123"
}

## Login Usuario
* BASE_URL: http://localhost:3000
* POST {{BASE_URL}}/api/sessions/login

Ejemplo:
{
    "email": "juan@test.com",
    "password": "test1234"
}

## Usuario Actual
* BASE_URL: http://localhost:3000
* POST {{BASE_URL}}/api/sessions/current

Ejemplo:
Bearer {{token}}

## Registro Duplicado
* BASE_URL: http://localhost:3000
* POST {{BASE_URL}}/api/sessions/register

Ejemplo:
{
    "first_name": "Pedro",
    "last_name": "Gómez",
    "email": "juan@test.com",
    "age": 25,
    "password": "test5678"
}