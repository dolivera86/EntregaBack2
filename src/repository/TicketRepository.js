export class TicketRepository {
    constructor(ticketDAO) {
        this.dao = ticketDAO;
    }

    async getAllTickets() {
        return await this.dao.get();
    }

    async getTicketById(ticketId) {
        return await this.dao.getById(ticketId);
    }

    async createTicket(ticketData) {
        return await this.dao.create(ticketData);
    }

    async updateTicket(ticketId, updateData) {
        return await this.dao.update(ticketId, updateData);
    }

    async deleteTicket(ticketId) {
        return await this.dao.delete(ticketId);
    }

    async getTicketByCode(code) {
        return await this.dao.getByCode(code);
    }

    async getUserTickets(userId) {
        return await this.dao.getByPurchaser(userId);
    }

    async getTicketsByStatus(status) {
        return await this.dao.getByStatus(status);
    }
}

export default TicketRepository;