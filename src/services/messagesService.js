import MessagesDAO from "../dao/classes/messages.dao.js";
import logger from "../utils/logger.js";

export default class MessageService {
  static async getMessages() {
    try {
      const messages = await MessagesDAO.findAll();
      logger.info("Mensajes obtenidos correctamente");
      return messages;
    } catch (error) {
      logger.error("Error al obtener los mensajes:", error);
      throw new Error("Error al obtener los mensajes");
    }
  }

  static async createMessage(userId, userEmail, messageText) {
    try {
      const newMessage = await MessagesDAO.create({
        user: userId,
        userEmail,
        text: messageText,
      });
      logger.info(`Mensaje creado correctamente por el usuario ${userEmail}`);
      return newMessage;
    } catch (error) {
      logger.error("Error al guardar el mensaje:", error);
      throw new Error("Error al guardar el mensaje");
    }
  }
}
