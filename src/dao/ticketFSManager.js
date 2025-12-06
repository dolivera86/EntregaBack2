import fs from 'fs';
import path from 'path';
import { TicketGenerator } from '../utils/ticketGenerator.js';

class TicketFSManager {
    constructor() {
        this.filePath = path.join(process.cwd(), 'data', 'tickets.json');
        this.ensureFileExists();
    }

    ensureFileExists() {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
        }
    }

    readTickets() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    writeTickets(tickets) {
        fs.writeFileSync(this.filePath, JSON.stringify(tickets, null, 2));
    }

    /**
     * GET: Obtiene todos los tickets
     */
    async get() {
        return this.readTickets();
    }

    /**
     * GETById: Obtiene un ticket por ID
     */
    async getById(ticketId) {
        const tickets = this.readTickets();
        const ticket = tickets.find((t) => t._id === ticketId);

        if (!ticket) throw new Error(`El ticket ${ticketId} no existe!`);

        return ticket;
    }

    /**
     * CREATE: Crea un nuevo ticket
     */
    async create(ticketData) {
        const tickets = this.readTickets();
        const newTicket = {
            _id: TicketGenerator.generateCode(),
            ...ticketData,
            createdAt: new Date().toISOString()
        };

        tickets.push(newTicket);
        this.writeTickets(tickets);

        return newTicket;
    }

    /**
     * UPDATE: Actualiza un ticket
     */
    async update(ticketId, updateData) {
        const tickets = this.readTickets();
        const index = tickets.findIndex((t) => t._id === ticketId);

        if (index === -1) {
            throw new Error(`El ticket ${ticketId} no existe!`);
        }

        tickets[index] = { ...tickets[index], ...updateData };
        this.writeTickets(tickets);

        return { modifiedCount: 1 };
    }

    /**
     * DELETE: Elimina un ticket
     */
    async delete(ticketId) {
        const tickets = this.readTickets();
        const index = tickets.findIndex((t) => t._id === ticketId);

        if (index === -1) {
            throw new Error(`El ticket ${ticketId} no existe!`);
        }

        tickets.splice(index, 1);
        this.writeTickets(tickets);

        return { deletedCount: 1 };
    }

    /**
     * Obtiene un ticket por código
     */
    async getByCode(code) {
        const tickets = this.readTickets();
        const ticket = tickets.find((t) => t.code === code);

        if (!ticket) throw new Error(`El ticket con código ${code} no existe!`);

        return ticket;
    }

    /**
     * Obtiene tickets de un usuario
     */
    async getByPurchaser(userId) {
        const tickets = this.readTickets();
        return tickets.filter((t) => t.purchaser === userId).sort((a, b) => new Date(b.purchase_datetime) - new Date(a.purchase_datetime));
    }

    /**
     * Obtiene tickets por estado
     */
    async getByStatus(status) {
        const tickets = this.readTickets();
        return tickets
            .filter((t) => t.status === status)
            .sort((a, b) => new Date(b.purchase_datetime) - new Date(a.purchase_datetime));
    }
}

export default new TicketFSManager();