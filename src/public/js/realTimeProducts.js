const addProductForm = document.getElementById("add-product-form");
const listaProductos = document.getElementById("listaProductos");
const productIdField = document.getElementById("productId");

// Función para limpiar el formulario
function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("category").value = "";
  document.getElementById("image").value = "";
  document.getElementById("productId").value = "";
}

//Función para mostrar productos
async function cargarProductos() {
  try {
    const response = await fetch("/api/products");
    const productos = await response.json();

    if (
      productos &&
      productos.products &&
      Array.isArray(productos.products.docs)
    ) {
      listaProductos.innerHTML = "";
      productos.products.docs.forEach((producto) => {
        const productoElement = document.createElement("div");
        productoElement.innerHTML = `
          <p><strong>${producto.title}</strong>: ${producto.description} - $${producto.price}</p>
          <img src="${producto.thumbnail}" alt="${producto.title}" width="100">
          <button onclick="editarProducto('${producto._id}')">Editar</button>
          <button onclick="eliminarProducto('${producto._id}')">Eliminar</button>
        `;
        listaProductos.appendChild(productoElement);
      });
    } else {
      console.error("No se recibieron productos o la respuesta es incorrecta");
    }
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

//Función para agregar un producto
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value.trim();
  const stock = document.getElementById("stock").value.trim();
  const category = document.getElementById("category").value.trim();
  const thumbnail = document.getElementById("image").files[0];

  if (!title || !description || !price || !stock || !category) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }

  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("stock", stock);
  formData.append("category", category);

  if (thumbnail) {
    formData.append("product", thumbnail);
  }

  let url = "/api/products";
  let method = "POST";
  if (productIdField.value) {
    url = `/api/products/${productIdField.value}`;
    method = "PUT";
  }

  try {
    const response = await fetch(url, {
      method: method,
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      if (result.result === "success") {
        alert("Producto agregado/actualizado correctamente");
        cargarProductos();
        resetForm();
      } else {
        alert("Error al agregar/actualizar el producto: " + result.message);
      }
    } else {
      throw new Error("Respuesta del servidor no es JSON");
    }
  } catch (error) {
    console.error("Error al agregar/actualizar el producto:", error);
    alert(`Error al agregar/actualizar el producto: ${error.message}`);
  }
});

// Función para editar un producto
window.editarProducto = async function (id) {
  try {
    const response = await fetch(`/api/products/${id}`);
    const result = await response.json();

    if (result.result === "error") {
      throw new Error(result.message);
    }

    const product = result.product;

    document.getElementById("title").value = product.title;
    document.getElementById("description").value = product.description;
    document.getElementById("price").value = product.price;
    document.getElementById("stock").value = product.stock;
    document.getElementById("category").value = product.category;
    document.getElementById("productId").value = product._id;
  } catch (error) {
    console.error("Error al cargar el producto:", error);
    alert("Error al cargar el producto: " + error.message);
  }
};

// Función para eliminar un producto
window.eliminarProducto = async function (id) {
  try {
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (result.result === "success") {
      alert("Producto eliminado correctamente");
      cargarProductos();
    } else {
      alert("Error al eliminar el producto");
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
  }
};

cargarProductos();
