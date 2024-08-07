import ticketModel from '../models/ticketsModel.js';

class TicketsDAO {
    async getAll() {
        return await ticketModel.find().lean();
    }

    async getById(ticketId) {
        return await ticketModel.findById(ticketId).lean();
    }

    async create(ticketData) {
        const newTicket = new Ticket(ticketData);
        return await newTicket.save();
    }

    async update(ticketId, updateData) {
        return await ticketModel.findByIdAndUpdate(ticketId, updateData, { new: true }).lean();
    }

    async delete(ticketId) {
        return await ticketModel.findByIdAndDelete(ticketId).lean();
    }
}

export default new TicketsDAO();
