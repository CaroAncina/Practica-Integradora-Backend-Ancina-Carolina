# Proyecto Ecommerce Backend

## Descripción
Este proyecto es un backend para un ecommerce que permite la gestión de usuarios, productos, carritos de compra y procesos de compra, además de una capa de autenticación y roles (`user`, `premium`, `admin`). 

## Tecnologías Usadas
- **Node.js**
- **Express**
- **MongoDB** (Mongoose)
- **JWT** (Autenticación)
- **Swagger** (Documentación de API)
- **Handlebars** (Motor de plantillas para vistas)
- **Multer** (Carga de archivos)
- **Postman** (verificación de endpoints)

## Características
- **Autenticación de Usuarios:**
    - Login/Logout
    - Roles de usuarios (admin, premium, user)
- **Gestión de Productos:**
    - Crear, actualizar y eliminar productos (admin)
    - Listado de productos disponibles
- **Carrito de Compras:**
    - Añadir y eliminar productos
    - Resumen de carrito con cantidad y total a pagar
- **Documentación de la API:**
    - Documentada con Swagger

## Estructura del Proyecto
- **src/**
    - **controllers/**: Controladores de la lógica del negocio
    - **dao/**: Acceso a la base de datos
    - **docs/**: Archivos YAML para Swagger
    - **middleware/**: Middleware de autenticación y validaciones
    - **public/**: Archivos públicos como imágenes y scripts JS
    - **routes/**: Rutas para la API y vistas
    - **services/**: Lógica de negocios en servicios

## Instalación

1. Clonar el repositorio:
        ```
           git clone https://github.com/tu-usuario/proyecto-ecommerce-backend.git
           cd proyecto-ecommerce-backend
         ```

2. Instalar dependencias:
        ```
           npm install
        ```

## Endpoints Principales

### Autenticación
- **POST** `/api/sessions/login`: Inicia sesión
- **POST** `/api/sessions/logout`: Cierra sesión

![alt text](<src/public/img readme/login.png>) 

### Usuarios
- **GET** `/api/users`: Lista todos los usuarios (admin)
- **PUT** `/api/users`: Actualiza datos del usuario autenticado
- **POST** `/api/users/premium`: Cambia el rol del usuario a premium
![alt text](<src/public/img readme/admin-users.png>) 

![alt text](<src/public/img readme/modificar-perfil.png>)

![alt text](<src/public/img readme/perfil-usuario.png>)

### Productos
- **GET** `/api/products`: Lista productos disponibles
- **POST** `/api/products`: Crea un nuevo producto (admin y premium)

![alt text](<src/public/img readme/agregar-producto.png>) 

![alt text](<src/public/img readme/editar-productos.png>)

### Carrito
- **GET** `/api/carts/:cid`: Obtiene los detalles de un carrito
- **POST** `/api/carts/purchase`: Realiza la compra de los productos del carrito, y se le envia un correo al usuario

![alt text](<src/public/img readme/detalle-carrito.png>)

![alt text](<src/public/img readme/proceso-compra.png>)

## Funcionalidades Clave
- Autenticación JWT y manejo de roles
- Gestión de carritos y productos
- Subida de imágenes y documentos
- API documentada con Swagger

## Base de Datos - MongoDB
 - Se guardan usuarios, carritos, mensajes, productos, tickets de compra y sessions.
 
![alt text](<src/public/img readme/mongo1.png>)

![alt text](<src/public/img readme/mongo2.png>)

## Postman

 - Link a documentación de Postman

https://documenter.getpostman.com/view/34227122/2sA3s1osHX

![alt text](<src/public/img readme/postman.png>)