import MessageService from "../services/messagesService.js";
import logger from "../utils/logger.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await MessageService.getMessages();
    res.send({ result: "success", payload: messages });
  } catch (error) {
    logger.error("Error al obtener los mensajes:", error);
    res
      .status(500)
      .send({ status: "error", error: "Error al obtener los mensajes" });
  }
};

export const createMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.session.user._id;
  const userEmail = req.session.user.email;

  if (!userId || !message) {
    return res
      .status(400)
      .json({ status: "error", error: "Faltan parámetros" });
  }

  try {
    const newMessage = await MessageService.createMessage(
      userId,
      userEmail,
      message
    );
    res.status(201).json({ status: "success", payload: newMessage });
  } catch (error) {
    logger.error("Error al guardar el mensaje:", error);
    res
      .status(500)
      .json({ status: "error", error: "Error al guardar el mensaje" });
  }
};
