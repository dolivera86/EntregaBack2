import { Router } from 'express';
import passport from 'passport';
import { register, login, current } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);

router.post('/login', 
    passport.authenticate('local', { session: false }), 
    login
);

router.get('/current', 
    authenticateToken,
    current
);

export default router;