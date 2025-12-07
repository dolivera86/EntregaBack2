# Entrega-Backend2 Final #
**Comisión 77260 - Diego Olivera**

Aplicación backend desarrollada con **Node.js y Express**, que implementa un sistema completo de **e-commerce** con autenticación, autorización, gestión de productos, carritos de compra y checkout.

El proyecto sigue una **arquitectura modular de 3 capas** (routes → controllers → services/dao) con separación clara de responsabilidades.

---

## Características Principales

### Autenticación y Seguridad
- Autenticación Local (Registro e Login)
- JWT (JSON Web Tokens) con Passport.js
- Cookies Seguras HTTPOnly
- Encriptación de Contraseñas con bcrypt
- Recuperación de Contraseña por Email

### Gestión de Usuarios
- Registro de usuarios (user/admin)
- Control de Roles (user/admin)
- Gestión de usuarios (solo admin)
- Cambio de roles

### E-Commerce
- CRUD de Productos (solo admin)
- Gestión de Carritos de Compra
- Checkout y Procesamiento de Compras
- Generación de Tickets
- WebSocket para actualizaciones en tiempo real

### Base de Datos
- MongoDB con Mongoose
- Paginación de productos
- Persistencia flexible (DB o FS)

---

## Estructura del Proyecto

```
Entrega-Backend2/
├── src/
│   ├── config/
│   │   ├── passport.config.js
│   │   └── jwt.config.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── admin.controller.js
│   │
│   ├── dao/
│   │   ├── productDBManager.js
│   │   ├── productFSManager.js
│   │   ├── cartDBManager.js
│   │   ├── cartFSManager.js
│   │   ├── ticketDBManager.js
│   │   ├── ticketFSManager.js
│   │   ├── helpers/
│   │   └── models/
│   │
│   ├── dto/
│   │   ├── CreateUserDTO.js
│   │   ├── CreateProductDTO.js
│   │   ├── UpdateProductDTO.js
│   │   ├── AddToCartDTO.js
│   │   ├── UpdateCartProductDTO.js
│   │   ├── CheckoutDTO.js
│   │   ├── PasswordResetDTO.js
│   │   └── index.js
│   │
│   ├── factory/
│   │   ├── daoFactory.js
│   │   ├── serviceFactory.js
│   │   └── index.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── authorization.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── productModel.js
│   │   ├── cartModel.js
│   │   ├── ticketModel.js
│   │   └── passwordReset.model.js
│   │
│   ├── repository/
│   │   ├── CartRepository.js
│   │   ├── ProductRepository.js
│   │   ├── TicketRepository.js
│   │   ├── UserRepository.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── productRouter.js
│   │   ├── cartRouter.js
│   │   ├── checkoutRouter.js
│   │   ├── ticketsRouter.js
│   │   ├── admin.routes.js
│   │   └── viewsRouter.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── cartProduct.service.js
│   │   ├── checkout.service.js
│   │   └── passwordReset.service.js
│   │
│   ├── utils/
│   │   ├── constantsUtil.js
│   │   ├── mailService.js
│   │   ├── multerUtil.js
│   │   ├── password.util.js
│   │   └── ticketGenerator.js
│   │
│   ├── views/
│   │   ├── index.handlebars
│   │   ├── cart.handlebars
│   │   ├── realTimeProducts.handlebars
│   │   ├── notFound.handlebars
│   │   └── layouts/
│   │       └── main.handlebars
│   │
│   ├── public/
│   │   ├── css/
│   │   │   └── index.css
│   │   └── js/
│   │       ├── index.js
│   │       └── ecommerce.js
│   │
│   ├── websocket.js
│   └── app.js
│
├── scripts/
│   └── setup-admin.js
│
├── data/
│   └── tickets.json
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## Instalación y Configuración

### Requisitos
- Node.js v18+
- MongoDB Atlas o MongoDB local
- Postman (para pruebas)

### Pasos

1. **Clonar el repositorio**

2. **Instalar dependencias**

3. **Ejecutar el servidor**

---

## Endpoints Principales

### Autenticación
```
POST   /api/sessions/register          # Registrar nuevo usuario
POST   /api/sessions/login             # Login
GET    /api/sessions/current           # Obtener usuario actual (requiere auth)
POST   /api/sessions/forgot-password   # Solicitar reset de contraseña
POST   /api/sessions/reset-password    # Resetear contraseña
GET    /api/sessions/validate-reset/:token  # Validar token de reset
```

### Productos
```
GET    /api/products                   # Listar productos (paginado)
GET    /api/products/:pid              # Obtener producto por ID
POST   /api/products                   # Crear producto (solo admin)
PUT    /api/products/:pid              # Actualizar producto (solo admin)
DELETE /api/products/:pid              # Eliminar producto (solo admin)
```

### Carritos
```
POST   /api/carts                      # Crear carrito
GET    /api/carts/:cid                 # Obtener carrito
POST   /api/carts/:cid/product/:pid    # Agregar producto al carrito
PUT    /api/carts/:cid/product/:pid    # Actualizar cantidad de producto
DELETE /api/carts/:cid/product/:pid    # Eliminar producto del carrito
DELETE /api/carts/:cid                 # Vaciar carrito
GET    /api/carts/:cid/total           # Obtener total del carrito
```

### Checkout
```
POST   /api/checkout/:cid              # Procesar compra (genera ticket)
```

### Tickets
```
GET    /api/tickets                    # Listar todos los tickets (solo admin)
GET    /api/tickets/:tid               # Obtener ticket por ID
GET    /api/tickets/user/:uid          # Obtener tickets del usuario
```

### Admin (solo usuarios admin)
```
GET    /api/admin/users                # Listar todos los usuarios
GET    /api/admin/users/:uid           # Obtener usuario por ID
PUT    /api/admin/users/:uid/role      # Cambiar rol del usuario
DELETE /api/admin/users/:uid           # Eliminar usuario
```

### Health Check
```
GET    /health                         # Verificar estado del servidor
```

---

## Pruebas en Postman

### Base URL
```
http://localhost:8080
```

### Flujo Completo de Pruebas

**1. Registrar Usuario Admin**
```
POST /api/sessions/register
{
  "first_name": "Admin",
  "last_name": "Sistema",
  "email": "admin@example.com",
  "age": 35,
  "password": "Admin123!",
  "role": "admin"
}
```

**2. Login Admin**
```
POST /api/sessions/login
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```
Guardar el token JWT de la cookie `jwt`

**3. Crear Producto**
```
POST /api/products
Headers: Authorization: Bearer <token_admin>
{
  "title": "Laptop HP",
  "description": "Laptop 15 pulgadas",
  "code": "LAP001",
  "price": 899.99,
  "stock": 25,
  "category": "electronica"
}
```

**4. Registrar Usuario Normal**
```
POST /api/sessions/register
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 28,
  "password": "User123!",
  "role": "user"
}
```

**5. Crear Carrito**
```
POST /api/carts
Headers: Authorization: Bearer <token_usuario>
```

**6. Agregar Producto al Carrito**
```
POST /api/carts/:cid/product/:pid
Headers: Authorization: Bearer <token_usuario>
{
  "quantity": 1
}
```

**7. Procesar Compra**
```
POST /api/checkout/:cid
Headers: Authorization: Bearer <token_usuario>
```

---

## Autenticación y Autorización

### Roles
- **user**: Puede comprar, ver tickets
- **admin**: Acceso total, gestión de productos y usuarios

### Headers Requeridos
```
Authorization: Bearer <jwt_token>
```

### Middlewares de Autorización
- `requireAuth`: Requiere estar autenticado
- `requireAdmin`: Requiere ser admin
- `requireUserOrAdmin`: Usuario o admin
- `optionalAuth`: Autenticación opcional
- `requireCheckoutAuth`: Autenticado para checkout

---

---

## Configuración de Email

Para recuperación de contraseña, configurar en `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_contraseña_app_16_caracteres
```

---

## Tecnologías Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Passport.js** - Autenticación
- **JWT** - Tokens seguros
- **bcrypt** - Hash de contraseñas
- **Socket.IO** - Comunicación en tiempo real
- **Nodemailer** - Envío de emails
- **Multer** - Upload de archivos
- **Express-Handlebars** - Motor de plantillas
- **Dotenv** - Gestión de variables de entorno

---
