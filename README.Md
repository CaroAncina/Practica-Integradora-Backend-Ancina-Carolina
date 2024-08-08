# **Practica integradora ecommerce**

Al modelo de persistencia de Mongo y mongoose del proyecto, se agrega: implementación de login, arquitectura por capas, patrones de diseño, servicio de mailing, manejo de variables de entorno.

## **Mongoose**

En la base de datos de Mongoose Atlas se pueden encontrar:

- usuarios
- productos
- carros de compra
- mensajes de chat
- inicios de sesión
- tickets de compra

![alt text](<src/public/img readme/mongo1.png>)

![alt text](<src/public/img readme/mongo2.png>)

## **Handlebars**

1. _Accedemos como página principal al login de usuario(ya registrado)._
   ![alt text](<src/public/img readme/loggin.png>)

2. _Tenemos un panel de usuario_
   ![alt text](<src/public/img readme/user panel.png>)

3. _Podemos ver el detalle del carrito del usuario_
   ![alt text](<src/public/img readme/cart.png>)

4. _Podemos acceder al perfil del usuario_
   ![alt text](<src/public/img readme/profile.png>)

5. _Podemos ver el chat para enviar mensajes_
   ![alt text](<src/public/img readme/chat.png>)

6. _Se agrega un user **"Premium"** que puede acceder a la pagina para crear, actualizar y eliminar productos._
   ![alt text](<src/public/img readme/user premium.png>)

## **Mailing**

Se utiliza el servicio de nodemailer, para luego de finalizar la compra, el usuario, reciba un correo electronico con la confirmación de la misma.

![alt text](<src/public/img readme/email compra.png>)

## **Postman**

![alt text](<src/public/img readme/postman.png>)

Todos los endpoint se pueden verificar a tráves de POSTMAN.

![alt text](<src/public/img readme/endpoints-postman.png>)

_Se adjunta link con la documentación completa:_
[Endpoints Backend](https://documenter.getpostman.com/view/34227122/2sA3s1osHX)
