import { ticketModel } from './models/ticketModel.js';

class TicketDBManager {
    /**
     * GET: Obtiene todos los tickets
     */
    async get() {
        return await ticketModel.find().populate('purchaser', 'first_name last_name email').sort({ purchase_datetime: -1 });
    }

    /**
     * GETById: Obtiene un ticket por ID
     */
    async getById(ticketId) {
        const ticket = await ticketModel
            .findOne({ _id: ticketId })
            .populate('purchaser', 'first_name last_name email');

        if (!ticket) throw new Error(`El ticket ${ticketId} no existe!`);

        return ticket;
    }

    /**
     * CREATE: Crea un nuevo ticket
     */
    async create(ticketData) {
        return await ticketModel.create(ticketData);
    }

    /**
     * UPDATE: Actualiza un ticket
     */
    async update(ticketId, updateData) {
        const result = await ticketModel.updateOne({ _id: ticketId }, updateData);

        if (result.matchedCount === 0) {
            throw new Error(`El ticket ${ticketId} no existe!`);
        }

        return result;
    }

    /**
     * DELETE: Elimina un ticket
     */
    async delete(ticketId) {
        const result = await ticketModel.deleteOne({ _id: ticketId });

        if (result.deletedCount === 0) {
            throw new Error(`El ticket ${ticketId} no existe!`);
        }

        return result;
    }

    /**
     * Obtiene un ticket por código
     */
    async getByCode(code) {
        const ticket = await ticketModel
            .findOne({ code })
            .populate('purchaser', 'first_name last_name email');

        if (!ticket) throw new Error(`El ticket con código ${code} no existe!`);

        return ticket;
    }

    /**
     * Obtiene tickets de un usuario específico
     */
    async getByPurchaser(userId) {
        return await ticketModel
            .find({ purchaser: userId })
            .populate('purchaser', 'first_name last_name email')
            .sort({ purchase_datetime: -1 });
    }

    /**
     * Obtiene tickets por estado
     */
    async getByStatus(status) {
        return await ticketModel
            .find({ status })
            .populate('purchaser', 'first_name last_name email')
            .sort({ purchase_datetime: -1 });
    }
}

export default new TicketDBManager();
