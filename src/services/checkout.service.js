import DAOFactory from '../factory/daoFactory.js';
import { TicketRepository } from '../repository/index.js';
import { TicketGenerator } from '../utils/ticketGenerator.js';
import mailService from '../utils/mailService.js';

class CheckoutService {
    constructor() {
        this.productDAO = DAOFactory.createProductDAO();
        this.cartDAO = DAOFactory.createCartDAO();
        this.ticketDAO = DAOFactory.createTicketDAO();
        this.ticketRepository = new TicketRepository(this.ticketDAO);
    }

    async processPurchase(cartId, user) {
        try {

            const cart = await this.cartDAO.getById(cartId);

            if (!cart || cart.products.length === 0) {
                throw new Error('El carrito está vacío');
            }

            const productsProcessed = [];
            const productsNotProcessed = [];
            let totalAmount = 0;

            for (const item of cart.products) {
                const product = await this.productDAO.getById(item.product._id || item.product);

                if (product.stock >= item.quantity) {

                    const totalPrice = product.price * item.quantity;

                    productsProcessed.push({
                        product_id: product._id,
                        title: product.title,
                        quantity: item.quantity,
                        unit_price: product.price,
                        total_price: totalPrice
                    });

                    totalAmount += totalPrice;


                    const newStock = product.stock - item.quantity;
                    await this.productDAO.update(product._id, { stock: newStock });
                } else {

                    productsNotProcessed.push({
                        product_id: product._id,
                        title: product.title,
                        quantity: item.quantity,
                        stock_available: product.stock,
                        reason: 'Stock insuficiente'
                    });
                }
            }

            if (productsProcessed.length === 0) {
                throw new Error('No hay productos con stock disponible para comprar');
            }

            const status = productsNotProcessed.length === 0 ? 'completed' : 'partial';

            const ticketCode = TicketGenerator.generateCode();
            const ticketData = {
                code: ticketCode,
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: user._id,
                purchaser_email: user.email,
                products: productsProcessed,
                status
            };

            const ticket = await this.ticketDAO.create(ticketData);

            if (productsNotProcessed.length > 0) {
                const updatedProducts = cart.products.filter((item) => {
                    const notProcessed = productsNotProcessed.find(
                        (p) => p.product_id.toString() === (item.product._id || item.product).toString()
                    );
                    return !!notProcessed;
                });

                await this.cartDAO.update(cartId, { products: updatedProducts });
            } else {

                await this.cartDAO.update(cartId, { products: [] });
            }

            try {
                await mailService.sendPurchaseConfirmationEmail(user.email, user.first_name, ticket);
            } catch (mailError) {
                console.warn('No se pudo enviar email de confirmación:', mailError.message);

            }

            return {
                ticket: ticket.toObject ? ticket.toObject() : ticket,
                productsProcessed: productsProcessed.length,
                productsNotProcessed,
                totalAmount,
                status
            };
        } catch (error) {
            throw error;
        }
    }

    async getUserPurchaseHistory(userId) {
        try {
            return await this.ticketRepository.getUserTickets(userId);
        } catch (error) {
            throw error;
        }
    }

    async getTicketDetails(ticketId) {
        try {
            return await this.ticketRepository.getTicketById(ticketId);
        } catch (error) {
            throw error;
        }
    }
}

export default CheckoutService;