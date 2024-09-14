const socket = io();

const addProductForm = document.getElementById("add-product-form");
const listaProductos = document.getElementById("listaProductos");
const btnActualizar = document.getElementById("btnActualizar");
const productIdField = document.getElementById("productId");
const userRoleElement = document.getElementById("userRole");

let userRole = "";

if (userRoleElement) {
  userRole = userRoleElement.value;

  if (userRole === "admin" || userRole === "premium") {
    if (addProductForm) {
      addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const stock = document.getElementById("stock").value;
        const category = document.getElementById("category").value;
        const thumbnail = document.getElementById("thumbnail").value || "";

        if (!title || !description || !price || !stock || !category) {
          alert("Por favor completa todos los campos obligatorios.");
          return;
        }

        const producto = {
          title,
          description,
          price,
          stock,
          category,
          thumbnail,
        };

        if (productIdField.value) {
          producto.id = productIdField.value;
          socket.emit("actualizarProducto", producto);
        } else {
          socket.emit("nuevoProducto", producto);
        }
      });
    }

    if (btnActualizar) {
      btnActualizar.addEventListener("click", (e) => {
        e.preventDefault();
        const id = productIdField.value;
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const stock = document.getElementById("stock").value;
        const category = document.getElementById("category").value;
        const thumbnail = document.getElementById("thumbnail").value || "";

        if (!title || !description || !price || !stock || !category) {
          alert("Por favor completa todos los campos obligatorios.");
          return;
        }

        const producto = {
          id,
          title,
          description,
          price,
          stock,
          category,
          thumbnail,
        };

        socket.emit("actualizarProducto", producto);
      });
    }
  }

  socket.on("productos", (productos) => {
    listaProductos.innerHTML = "";
    productos.forEach((producto) => {
      const productoElement = document.createElement("div");
      productoElement.innerHTML = `
        <p><strong>${producto.title}</strong>: ${producto.description} - ${
        producto.price
      }</p>
        ${
          userRole === "premium" || userRole === "admin"
            ? `<button onclick="editarProducto('${producto._id}')">Editar</button>
               <button onclick="eliminarProducto('${producto._id}')">Eliminar</button>`
            : ""
        }
      `;
      listaProductos.appendChild(productoElement);
    });
  });

  window.editarProducto = function (id) {
    socket.emit("obtenerProducto", id);
  };

  socket.on("productoObtenido", (producto) => {
    document.getElementById("title").value = producto.title;
    document.getElementById("description").value = producto.description;
    document.getElementById("price").value = producto.price;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("category").value = producto.category;
    document.getElementById("thumbnail").value = producto.thumbnail || "";
    productIdField.value = producto._id;

    btnActualizar.style.display = "inline";
  });

  window.eliminarProducto = function (id) {
    if (userRole === "admin" || userRole === "premium") {
      socket.emit("eliminarProducto", id);
    } else {
      alert("No tienes permiso para eliminar productos");
    }
  };

  socket.on("respuestaAdd", (mensaje) => {
    alert(mensaje);
  });

  socket.on("respuestaDelete", (mensaje) => {
    alert(mensaje);
  });

  socket.on("respuestaUpdate", (mensaje) => {
    alert(mensaje);
    btnActualizar.style.display = "none";
    productIdField.value = "";
  });
}
