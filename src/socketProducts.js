import productsModel from '../src/dao/models/products.model.js';
import messagesModel from '../src/dao/models/messages.model.js';

export default (io) => {
    io.on('connection', (socket) => {
        console.log('Usuario conectado');

        //REALTIMEPRODUCTS
        productsModel.find().lean().then((productos) => {
            socket.emit('productos', productos);
        });

        socket.on('nuevoProducto', (producto) => {
            productsModel.create(producto)
                .then(() => productsModel.find().lean())
                .then((productos) => {
                    io.emit('productos', productos);
                    socket.emit('respuestaAdd', 'Producto agregado correctamente');
                })
                .catch((error) => {
                    socket.emit('respuestaAdd', 'Error al agregar el producto: ' + error.message);
                });
        });

        socket.on('eliminarProducto', (pid) => {
            productsModel.findByIdAndDelete(pid)
                .then(() => productsModel.find().lean())
                .then((productos) => {
                    io.emit('productos', productos);
                    socket.emit('respuestaDelete', 'Producto eliminado correctamente');
                })
                .catch((error) => {
                    socket.emit('respuestaDelete', 'Error al eliminar el producto: ' + error.message);
                });
        });

        //CHAT
        messagesModel.find().then((mensajes) => {
            socket.emit('mensajes', mensajes);
        });

        socket.on('nuevoMensaje', (mensaje) => {
            messagesModel.create(mensaje)
                .then(() => messagesModel.find().lean())
                .then((mensajes) => {
                    io.emit('mensajes', mensajes);
                })
                .catch((error) => {
                    console.error('Error al guardar el mensaje:', error);
                });
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        });
    });
};