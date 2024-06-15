// Función para agregar un producto a un carrito
async function addToCart(pid) {
    try {
        const response = await fetch(`/api/carts/add-to-cart/${pid}`, {
            method: 'POST',
            credentials: 'same-origin' // Para enviar las cookies de sesión al servidor
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
            alert('Producto agregado al carrito con éxito');
        } else {
            throw new Error('Error al agregar el producto al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el producto al carrito');
    }
}

// Función para mostrar detalles del producto
async function showDetails(productId) {
    window.location.href = `/products/${productId}`;
}
