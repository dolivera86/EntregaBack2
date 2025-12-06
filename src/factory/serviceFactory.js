import DAOFactory from './daoFactory.js';
import CartProductService from '../services/cartProduct.service.js';
import CheckoutService from '../services/checkout.service.js';
import PasswordResetService from '../services/passwordReset.service.js';

class ServiceFactory {

    static instances = {};

    static createCartProductService() {
        if (!this.instances.cartProductService) {
            const productDAO = DAOFactory.createProductDAO();
            const cartDAO = DAOFactory.createCartDAO();
            this.instances.cartProductService = new CartProductService(cartDAO, productDAO);
        }
        return this.instances.cartProductService;
    }

    static createCheckoutService() {
        if (!this.instances.checkoutService) {
            this.instances.checkoutService = new CheckoutService();
        }
        return this.instances.checkoutService;
    }

    static createPasswordResetService() {
        if (!this.instances.passwordResetService) {
            this.instances.passwordResetService = PasswordResetService;
        }
        return this.instances.passwordResetService;
    }

    static createProductService() {
        return DAOFactory.createProductDAO();
    }

    static createCartService() {
        return DAOFactory.createCartDAO();
    }

    static createTicketService() {
        return DAOFactory.createTicketDAO();
    }

    static clearCache() {
        this.instances = {};
    }

    static getInfo() {
        return {
            daoInfo: DAOFactory.getInfo(),
            cachedServices: Object.keys(this.instances)
        };
    }
}

export default ServiceFactory;