import { Router } from 'express';
import ServiceFactory from '../factory/serviceFactory.js';
import { PasswordResetRequestDTO, PasswordResetDTO } from '../dto/index.js';
import { requireAuth, requireAdmin } from '../middlewares/authorization.middleware.js';
import PasswordResetService from '../services/passwordReset.service.js';

const router = Router();

const TicketService = ServiceFactory.createTicketService();

router.get('/', requireAdmin, async (req, res) => {
    try {
        const tickets = await TicketService.get();

        res.json({
            status: 'success',
            count: tickets.length,
            payload: tickets
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/:tid', requireAuth, async (req, res) => {
    try {
        const ticket = await TicketService.getById(req.params.tid);

        if (ticket.purchaser._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'No tienes permiso para ver este ticket'
            });
        }

        res.json({
            status: 'success',
            payload: ticket
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/user/:uid', requireAuth, async (req, res) => {
    try {

        if (req.params.uid !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'No tienes permiso para ver estos tickets'
            });
        }

        const tickets = await TicketService.getByPurchaser(req.params.uid);

        res.json({
            status: 'success',
            count: tickets.length,
            payload: tickets
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const resetDTO = new PasswordResetRequestDTO(req.body);
        const validation = resetDTO.validate();

        if (!validation.isValid) {
            return res.status(400).json({
                status: 'error',
                message: 'Validación fallida',
                errors: validation.errors
            });
        }

        const result = await PasswordResetService.requestPasswordReset(resetDTO.email);

        res.json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const resetDTO = new PasswordResetDTO(req.body);
        const validation = resetDTO.validate();

        if (!validation.isValid) {
            return res.status(400).json({
                status: 'error',
                message: 'Validación fallida',
                errors: validation.errors
            });
        }

        const result = await PasswordResetService.resetPassword(
            resetDTO.token,
            resetDTO.newPassword
        );

        res.json({
            status: 'success',
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/validate-reset/:token', async (req, res) => {
    try {
        await PasswordResetService.validateResetToken(req.params.token);

        res.json({
            status: 'success',
            message: 'Token válido'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;