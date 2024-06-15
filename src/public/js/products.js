//función para agregar un producto a un carrito 
async function addToCart(pid) {
    const cid = '6655256f06492c2a8e4153b8'; 
    const url = `http://localhost:8080/api/carts/${cid}/product/${pid}`;

    try {
        const response = await fetch(url, {
            method: 'POST'
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Producto agregado al carrito:', data);
            alert('Producto agregado al carrito con éxito');
        } else {
            throw new Error('Error al agregar el producto al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el producto al carrito');
    }
}

//función para mostrar detalles del producto
function showDetails(productId) {
    window.location.href = `/products/${productId}`;
}
