export class TicketGenerator {

    static generateCode() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000000)
            .toString()
            .padStart(7, '0');

        return `TICKET-${year}-${month}-${day}-${random}`;
    }

    static generateMultipleCodes(count) {
        const codes = new Set();
        while (codes.size < count) {
            codes.add(this.generateCode());
        }
        return Array.from(codes);
    }
}

export default TicketGenerator;