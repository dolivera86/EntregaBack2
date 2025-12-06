import { authenticateToken } from './auth.middleware.js';

export const requireAuth = (req, res, next) => {
    authenticateToken(req, res, (err) => {
        if (err) return res.status(401).json({ message: 'No autenticado. Debe registrarse o iniciar sesión' });
        if (!req.user) return res.status(401).json({ message: 'Usuario no encontrado. Debe registrarse o iniciar sesión' });
        next();
    });
};

export const requireRole = (roles) => {
    return (req, res, next) => {

        authenticateToken(req, res, (err) => {
            if (err) return res.status(401).json({ message: 'No autenticado. Debe registrarse o iniciar sesión' });
            if (!req.user) return res.status(401).json({ message: 'Usuario no encontrado. Debe registrarse o iniciar sesión' });

            const allowedRoles = Array.isArray(roles) ? roles : [roles];
            const userRole = req.user.role || 'user';

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: `Acceso denegado. Requiere ser: ${allowedRoles.join(' o ')}`,
                    requiredRole: allowedRoles,
                    userRole: userRole
                });
            }

            next();
        });
    };
};

export const requireAdmin = requireRole('admin');

export const requireUserOrAdmin = requireRole(['user', 'admin']);

export const optionalAuth = (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.jwt;
    
    if (token) {
        authenticateToken(req, res, (err) => {

            next();
        });
    } else {

        next();
    }
};

export const requireOwnCart = (req, res, next) => {
    authenticateToken(req, res, (err) => {
        if (err) return res.status(401).json({ message: 'No autenticado' });
        if (!req.user) return res.status(401).json({ message: 'Usuario no encontrado' });

        const userRole = req.user.role || 'user';
        const isAdmin = userRole === 'admin';

        if (isAdmin) {
            return next();
        }

        next();
    });
};

export const allowPublicOptionalAuth = optionalAuth;

export const requireCheckoutAuth = (req, res, next) => {
    authenticateToken(req, res, (err) => {
        if (err) return res.status(401).json({ message: 'Debe iniciar sesión para hacer una compra' });
        if (!req.user) return res.status(401).json({ message: 'Usuario no encontrado' });
        next();
    });
};