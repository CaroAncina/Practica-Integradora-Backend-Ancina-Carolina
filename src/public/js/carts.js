async function addToCart(productId) {
  try {
    const response = await fetch(`/api/carts/product/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 403) {
      alert("No puedes agregar tu propio producto al carrito de compras.");
    } else if (response.status === 404) {
      alert("Producto no encontrado.");
    } else if (response.ok) {
      const result = await response.json();
      alert("Producto agregado al carrito.");
    } else {
      alert("Error al agregar el producto al carrito.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al agregar el producto al carrito.");
  }
}

async function updateProductQuantity(cartId, productId) {
  const quantity = document.getElementById(`quantity-${productId}`).value;

  try {
    const response = await fetch(`/api/carts/product/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: parseInt(quantity) }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la cantidad");
    }

    const data = await response.json();
    console.log(data);
    alert("Cantidad actualizada correctamente");
    location.reload();
  } catch (error) {
    console.error("Error al actualizar la cantidad:", error);
  }
}

async function removeProductFromCart(cartId, productId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      alert("Producto eliminado del carrito.");
      location.reload();
    } else {
      const errorData = await response.json();
      alert(`Error al eliminar el producto: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al eliminar el producto del carrito.");
  }
}

async function clearCart() {
  try {
    const response = await fetch(`/api/carts/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      alert("Carrito vaciado correctamente.");
      location.reload();
    } else if (response.status === 404) {
      alert("Carrito no encontrado.");
    } else {
      const errorData = await response.json();
      alert(`Error al vaciar el carrito: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al vaciar el carrito.");
  }
}

async function purchaseCart() {
  try {
    const response = await fetch(`/api/carts/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      alert("Compra exitosa.");
      location.reload();
    } else if (response.status === 404) {
      alert("No se pudo realizar la compra.");
    } else {
      const errorData = await response.json();
      alert(`Error al realizar la compra: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al realizar la compra.");
  }
}

function goToPurchaseSummary() {
  window.location.href = "/purchase-summary";
}
