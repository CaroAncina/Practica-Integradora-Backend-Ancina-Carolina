import TicketService from "../services/ticketsService.js";
import logger from "../utils/logger.js";

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await TicketService.getAllTickets();
    res.status(200).json({ result: "success", payload: tickets });
  } catch (error) {
    logger.error("Error al obtener los tickets:", error);
    res
      .status(500)
      .json({ result: "error", error: "Error al obtener los tickets" });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await TicketService.getTicketById(ticketId);

    if (!ticket) {
      return res
        .status(404)
        .json({ result: "error", error: "Ticket no encontrado" });
    }

    res.status(200).json({ result: "success", payload: ticket });
  } catch (error) {
    logger.error("Error al obtener el ticket:", error);
    res
      .status(500)
      .json({ result: "error", error: "Error al obtener el ticket" });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { amount, purchaser, products } = req.body;
    const newTicket = await TicketService.createTicket({
      amount,
      purchaser,
      products,
    });
    res.status(201).json({ result: "success", payload: newTicket });
  } catch (error) {
    logger.error("Error al crear el ticket:", error);
    res
      .status(500)
      .json({ result: "error", error: "Error al crear el ticket" });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const updateData = req.body;
    const updatedTicket = await TicketService.updateTicket(
      ticketId,
      updateData
    );

    if (!updatedTicket) {
      return res
        .status(404)
        .json({ result: "error", error: "Ticket no encontrado" });
    }

    res.status(200).json({ result: "success", payload: updatedTicket });
  } catch (error) {
    logger.error("Error al actualizar el ticket:", error);
    res
      .status(500)
      .json({ result: "error", error: "Error al actualizar el ticket" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const deletedTicket = await TicketService.deleteTicket(ticketId);

    if (!deletedTicket) {
      return res
        .status(404)
        .json({ result: "error", error: "Ticket no encontrado" });
    }

    res.status(200).json({ result: "success", payload: deletedTicket });
  } catch (error) {
    logger.error("Error al eliminar el ticket:", error);
    res
      .status(500)
      .json({ result: "error", error: "Error al eliminar el ticket" });
  }
};
