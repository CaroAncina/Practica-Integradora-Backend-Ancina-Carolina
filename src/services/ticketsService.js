import Ticket from "../dao/models/ticketsModel.js";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";

class TicketService {
  async getAllTickets() {
    try {
      const tickets = await Ticket.find().lean();
      logger.info("Tickets obtenidos correctamente");
      return tickets;
    } catch (error) {
      logger.error("Error al obtener los tickets:", error);
      throw new Error("Error al obtener los tickets");
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await Ticket.findById(ticketId).lean();
      if (!ticket) {
        logger.warn(`Ticket con id ${ticketId} no encontrado`);
        throw new Error("Ticket no encontrado");
      }
      logger.info(`Ticket con id ${ticketId} obtenido correctamente`);
      return ticket;
    } catch (error) {
      logger.error("Error al obtener el ticket:", error);
      throw new Error("Error al obtener el ticket");
    }
  }

  async createTicket({ amount, purchaser, products }) {
    try {
      const newTicket = new Ticket({
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount,
        purchaser,
        products,
      });
      await newTicket.save();
      logger.info(`Ticket creado correctamente para el comprador ${purchaser}`);
      return newTicket;
    } catch (error) {
      logger.error("Error al crear el ticket:", error);
      throw new Error("Error al crear el ticket");
    }
  }

  async updateTicket(ticketId, updateData) {
    try {
      const updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        updateData,
        {
          new: true,
        }
      ).lean();
      if (!updatedTicket) {
        logger.warn(`Ticket con id ${ticketId} no encontrado para actualizar`);
        throw new Error("Ticket no encontrado para actualizar");
      }
      logger.info(`Ticket con id ${ticketId} actualizado correctamente`);
      return updatedTicket;
    } catch (error) {
      logger.error("Error al actualizar el ticket:", error);
      throw new Error("Error al actualizar el ticket");
    }
  }

  async deleteTicket(ticketId) {
    try {
      const deletedTicket = await Ticket.findByIdAndDelete(ticketId).lean();
      if (!deletedTicket) {
        logger.warn(`Ticket con id ${ticketId} no encontrado para eliminar`);
        throw new Error("Ticket no encontrado para eliminar");
      }
      logger.info(`Ticket con id ${ticketId} eliminado correctamente`);
      return deletedTicket;
    } catch (error) {
      logger.error("Error al eliminar el ticket:", error);
      throw new Error("Error al eliminar el ticket");
    }
  }
}

export default new TicketService();
