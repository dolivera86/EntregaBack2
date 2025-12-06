import { Router } from 'express';
import { ServiceFactory } from '../factory/index.js';
import { AddToCartDTO, UpdateCartProductDTO } from '../dto/index.js';
import { requireUserOrAdmin } from '../middlewares/authorization.middleware.js';

const router = Router();
const CartService = ServiceFactory.createCartService();
const CartProductService_Instance = ServiceFactory.createCartProductService();

router.get('/:cid', requireUserOrAdmin, async (req, res) => {
    try {
        const result = await CartService.getById(req.params.cid);
        res.send({
            status: 'success',
            payload: result,
            user: { id: req.user._id, email: req.user.email, role: req.user.role }
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', requireUserOrAdmin, async (req, res) => {
    try {
        const result = await CartService.create();
        res.status(201).send({
            status: 'success',
            message: 'Carrito creado exitosamente',
            payload: result,
            user: { id: req.user._id, email: req.user.email, role: req.user.role }
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/:cid/product/:pid', requireUserOrAdmin, async (req, res) => {
    try {

        const cartDTO = new AddToCartDTO({
            cid: req.params.cid,
            pid: req.params.pid,
            quantity: req.body.quantity
        });
        const validation = cartDTO.validate();

        if (!validation.isValid) {
            return res.status(400).send({
                status: 'error',
                message: 'Validación fallida',
                errors: validation.errors
            });
        }

        const result = await CartProductService_Instance.addProductToCart(cartDTO.cid, cartDTO.pid);
        res.status(201).send({
            status: 'success',
            message: 'Producto agregado al carrito',
            payload: result,
            user: { id: req.user._id, email: req.user.email, role: req.user.role }
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid/product/:pid', requireUserOrAdmin, async (req, res) => {
    try {
        const result = await CartProductService_Instance.removeProductFromCart(req.params.cid, req.params.pid);
        res.send({
            status: 'success',
            message: 'Producto eliminado del carrito',
            payload: result,
            user: { id: req.user._id, email: req.user.email, role: req.user.role }
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:cid/product/:pid', requireUserOrAdmin, async (req, res) => {
    try {

        const updateDTO = new UpdateCartProductDTO({
            cid: req.params.cid,
            pid: req.params.pid,
            quantity: req.body.quantity
        });
        const validation = updateDTO.validate();

        if (!validation.isValid) {
            return res.status(400).send({
                status: 'error',
                message: 'Validación fallida',
                errors: validation.errors
            });
        }

        const result = await CartProductService_Instance.updateProductQuantity(updateDTO.cid, updateDTO.pid, updateDTO.quantity);
        res.send({
            status: 'success',
            message: 'Cantidad de producto actualizada',
            payload: result,
            user: { id: req.user._id, email: req.user.email, role: req.user.role }
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:cid', requireUserOrAdmin, async (req, res) => {
    try {
        const result = await CartService.update(req.params.cid, { products: [] });
        res.send({
            status: 'success',
            message: 'Carrito vaciado exitosamente',
            payload: result,
            user: { id: req.user._id, email: req.user.email, role: req.user.role }
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/:cid/total', requireUserOrAdmin, async (req, res) => {
    try {
        const result = await CartProductService_Instance.getCartTotal(req.params.cid);
        res.send({
            status: 'success',
            payload: result,
            user: { id: req.user._id, email: req.user.email, role: req.user.role }
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;