async function changeUserRole(userId) {
  try {
    const response = await fetch(`/api/users/${userId}/role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error("Error al cambiar el rol del usuario");
    }

    const data = await response.json();
    alert(`Rol cambiado exitosamente: ${data.message}`);
    location.reload();
  } catch (error) {
    console.error("Error al cambiar el rol del usuario:", error);
  }
}

async function deleteUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el usuario");
    }

    alert("Usuario eliminado correctamente");
    location.reload();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
  }
}
