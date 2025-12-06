import { Router } from 'express';
import { requireAdmin } from '../middlewares/authorization.middleware.js';
import { getAllUsers, getUserById, updateUserRole, deleteUser } from '../controllers/admin.controller.js';

const router = Router();

router.get('/users', requireAdmin, getAllUsers);

router.get('/users/:uid', requireAdmin, getUserById);

router.put('/users/:uid/role', requireAdmin, updateUserRole);

router.delete('/users/:uid', requireAdmin, deleteUser);

export default router;