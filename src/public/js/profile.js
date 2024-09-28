function showProducts() {
  window.location.href = "/products";
}
function showCart(cartId) {
  window.location.href = "/carts/" + cartId;
}

async function updateUser() {
  const firstName = document.getElementById("first_name").value;
  const lastName = document.getElementById("last_name").value;
  const age = document.getElementById("age").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`/api/users/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        age: age,
        email: email,
        password: password,
      }),
    });
    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      window.location.reload();
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error al actualizar datos:", error);
  }
}

async function uploadProfileImage() {
  const formData = new FormData(document.getElementById("profileImageForm"));
  try {
    const response = await fetch("/api/users/upload/profiles", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      alert(`Imagen de perfil actualizada`);
      location.reload();
    } else {
      alert(`Error al subir imágen de perfil: ${result.message}`);
    }
  } catch (error) {
    console.error("Error al subir la imagen de perfil:", error);
  }
}

async function uploadDocuments() {
  const formData = new FormData(document.getElementById("documentsForm"));
  try {
    const response = await fetch(`/api/users/documents`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      window.location.reload();
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error al subir documentos:", error);
  }
}

async function changeUserRole() {
  try {
    const response = await fetch("/api/users/premium", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result.status === "success") {
      alert(result.message);
      window.location.reload();
    } else {
      alert(result.message || "Error al cambiar el rol");
    }
  } catch (error) {
    console.error("Error al cambiar el rol:", error);
    alert("Error al cambiar el rol");
  }
}
