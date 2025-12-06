import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';
import { productFSManager } from '../dao/productFSManager.js';
import { cartFSManager } from '../dao/cartFSManager.js';
import ticketDBManager from '../dao/ticketDBManager.js';
import ticketFSManager from '../dao/ticketFSManager.js';

class DAOFactory {

    static persistenceType = process.env.PERSISTENCE_TYPE || 'db';

    static createProductDAO() {
        if (this.persistenceType === 'fs') {
            return new productFSManager('./src/data/products.json');
        }
        return new productDBManager();
    }

    static createCartDAO() {
        if (this.persistenceType === 'fs') {
            return new cartFSManager('./src/data/carts.json');
        }
        return new cartDBManager();
    }

    static createTicketDAO() {
        if (this.persistenceType === 'fs') {
            return ticketFSManager;
        }
        return ticketDBManager;
    }

    static getPersistenceType() {
        return this.persistenceType;
    }

    static setPersistenceType(type) {
        if (type !== 'db' && type !== 'fs') {
            throw new Error('Tipo de persistencia inválido. Use "db" o "fs"');
        }
        this.persistenceType = type;
    }

    static getInfo() {
        return {
            persistenceType: this.persistenceType,
            productDAO: this.persistenceType === 'fs' ? 'productFSManager' : 'productDBManager',
            cartDAO: this.persistenceType === 'fs' ? 'cartFSManager' : 'cartDBManager',
            ticketDAO: this.persistenceType === 'fs' ? 'ticketFSManager' : 'ticketDBManager'
        };
    }
}

export default DAOFactory;