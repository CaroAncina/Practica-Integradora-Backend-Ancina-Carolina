const socket = io();

const addProductForm = document.getElementById('add-product-form');
const listaProductos = document.getElementById('listaProductos');
const btnEnviar = document.getElementById('btnEnviar');

btnEnviar.addEventListener('click', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const thumbnail = document.getElementById('thumbnail').value;

    const producto = { title, description, price, code, stock, category, thumbnail };

    socket.emit('nuevoProducto', producto);
});

socket.on('productos', (productos) => {
    listaProductos.innerHTML = '';
    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.innerHTML = `
            <p><strong>${producto.title}</strong>: ${producto.description} - ${producto.price}</p>
            <button onclick="eliminarProducto('${producto._id}')">Eliminar</button>
        `;
        listaProductos.appendChild(productoElement);
    });
});

function eliminarProducto(id) {
    socket.emit('eliminarProducto', id);
}

socket.on('respuestaAdd', (mensaje) => {
    alert(mensaje);
});

socket.on('respuestaDelete', (mensaje) => {
    alert(mensaje);
});

