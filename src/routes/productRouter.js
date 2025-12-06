import { Router } from 'express';
import { ServiceFactory } from '../factory/index.js';
import { CreateProductDTO, UpdateProductDTO } from '../dto/index.js';
import { uploader } from '../utils/multerUtil.js';
import { requireAdmin, optionalAuth } from '../middlewares/authorization.middleware.js';

const router = Router();
const ProductService = ServiceFactory.createProductService();

router.get('/', optionalAuth, async (req, res) => {
    try {
        const result = await ProductService.get(req.query);

        res.send({
            status: 'success',
            payload: result,
            userInfo: req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : null
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/:pid', optionalAuth, async (req, res) => {
    try {
        const result = await ProductService.getById(req.params.pid);
        res.send({
            status: 'success',
            payload: result,
            userInfo: req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : null
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/', requireAdmin, uploader.array('thumbnails', 3), async (req, res) => {
    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.path);
        });
    }

    try {

        const productDTO = new CreateProductDTO(req.body);
        const validation = productDTO.validate();

        if (!validation.isValid) {
            return res.status(400).send({
                status: 'error',
                message: 'Validación fallida',
                errors: validation.errors
            });
        }

        const result = await ProductService.create(productDTO.toObject());
        res.status(201).send({
            status: 'success',
            message: 'Producto creado exitosamente',
            payload: result,
            createdBy: { id: req.user._id, email: req.user.email }
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.put('/:pid', requireAdmin, uploader.array('thumbnails', 3), async (req, res) => {
    if (req.files) {
        req.body.thumbnails = [];
        req.files.forEach((file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {

        const productDTO = new UpdateProductDTO(req.body);
        const validation = productDTO.validate();

        if (!validation.isValid) {
            return res.status(400).send({
                status: 'error',
                message: 'Validación fallida',
                errors: validation.errors
            });
        }

        const result = await ProductService.update(req.params.pid, productDTO.toObject());
        res.send({
            status: 'success',
            message: 'Producto actualizado exitosamente',
            payload: result,
            updatedBy: { id: req.user._id, email: req.user.email }
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.delete('/:pid', requireAdmin, async (req, res) => {
    try {
        const result = await ProductService.delete(req.params.pid);
        res.send({
            status: 'success',
            message: 'Producto eliminado exitosamente',
            payload: result,
            deletedBy: { id: req.user._id, email: req.user.email }
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;