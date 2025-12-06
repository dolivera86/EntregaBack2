import { Router } from 'express';
import ServiceFactory from '../factory/serviceFactory.js';
import { CheckoutDTO } from '../dto/index.js';
import { requireCheckoutAuth, requireAdmin } from '../middlewares/authorization.middleware.js';

const router = Router();
const CheckoutService_Instance = ServiceFactory.createCheckoutService();

router.post('/:cid', requireCheckoutAuth, async (req, res) => {
    try {
        const checkoutDTO = new CheckoutDTO({
            cartId: req.params.cid,
            userId: req.user._id
        });

        const validation = checkoutDTO.validate();

        if (!validation.isValid) {
            return res.status(400).json({
                status: 'error',
                message: 'Validación fallida',
                errors: validation.errors
            });
        }

        const result = await CheckoutService_Instance.processPurchase(
            checkoutDTO.cartId,
            req.user
        );

        res.status(201).json({
            status: 'success',
            message: 'Compra procesada',
            data: {
                ticket: result.ticket,
                productsProcessed: result.productsProcessed,
                productsNotProcessed: result.productsNotProcessed,
                totalAmount: result.totalAmount,
                status: result.status
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;