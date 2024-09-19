import productsModel from "../../dao/models/productsModel.js";
import messagesModel from "../../dao/models/messagesModel.js";
import usersModel from "../../dao/models/usersModel.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log("Usuario conectado");

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
