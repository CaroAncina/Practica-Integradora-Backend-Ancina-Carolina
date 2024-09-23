async function addToCart(pid) {
  try {
    const response = await fetch(`/api/carts/product/${pid}`, {
      method: "POST",
      credentials: "same-origin",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      alert("Producto agregado al carrito con éxito");
    } else {
      throw new Error("Error al agregar el producto al carrito");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al agregar el producto al carrito");
  }
}

async function showDetails(productId) {
  window.location.href = `/products/${productId}`;
}
