import productsModel from "../../dao/models/productsModel.js";
import messagesModel from "../../dao/models/messagesModel.js";
import usersModel from "../../dao/models/usersModel.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log("Usuario conectado");

    if (socket.request.user) {
      console.log("Usuario autenticado: ", socket.request.user);
    } else {
      console.log("Usuario no autenticado.");
    }

    productsModel
      .find()
      .lean()
      .then((productos) => {
        socket.emit("productos", productos);
      });

    socket.on("nuevoProducto", async (producto) => {
      try {
        const generateCode = () => {
          const date = new Date();
          const year = date.getFullYear().toString().slice(-2);
          const month = ("0" + (date.getMonth() + 1)).slice(-2);
          const day = ("0" + date.getDate()).slice(-2);
          const randomNum = Math.floor(Math.random() * 1000);
          return `PRD-${year}${month}${day}-${randomNum}`;
        };

        producto.code = generateCode();

        await productsModel.create(producto);
        const productos = await productsModel.find().lean();
        io.emit("productos", productos);
        socket.emit("respuestaAdd", "Producto agregado correctamente");
      } catch (error) {
        socket.emit(
          "respuestaAdd",
          "Error al agregar el producto: " + error.message
        );
      }
    });

    socket.on("actualizarProducto", (producto) => {
      const { id, ...updateData } = producto;
      productsModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .then(() => productsModel.find().lean())
        .then((productos) => {
          io.emit("productos", productos);
          socket.emit("respuestaUpdate", "Producto actualizado correctamente");
        })
        .catch((error) => {
          socket.emit(
            "respuestaUpdate",
            "Error al actualizar el producto: " + error.message
          );
        });
    });

    socket.on("obtenerProducto", (id) => {
      productsModel
        .findById(id)
        .lean()
        .then((producto) => {
          socket.emit("productoObtenido", producto);
        })
        .catch((error) => {
          console.error("Error al obtener el producto:", error);
        });
    });

    socket.on("eliminarProducto", (pid) => {
      productsModel
        .findByIdAndDelete(pid)
        .then(() => productsModel.find().lean())
        .then((productos) => {
          io.emit("productos", productos);
          socket.emit("respuestaDelete", "Producto eliminado correctamente");
        })
        .catch((error) => {
          socket.emit(
            "respuestaDelete",
            "Error al eliminar el producto: " + error.message
          );
        });
    });

    // CHAT
    messagesModel
      .find()
      .populate("user", "email")
      .lean()
      .then((mensajes) => {
        socket.emit("mensajes", mensajes);
      });

    socket.on("nuevoMensaje", async (mensaje) => {
      try {
        const user = await usersModel
          .findById(mensaje.user)
          .select("email role");
        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        if (user.role !== "user") {
          socket.emit(
            "errorMensaje",
            "Solo los usuarios pueden enviar mensajes"
          );
          return;
        }

        const nuevoMensaje = await messagesModel.create({
          user: user._id,
          text: mensaje.message,
        });
        const mensajes = await messagesModel
          .find()
          .populate("user", "email")
          .lean();
        io.emit("mensajes", mensajes);
      } catch (error) {
        console.error("Error al guardar el mensaje:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
    });
  });
};
