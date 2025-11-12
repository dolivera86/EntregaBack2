import passport from 'passport';

export const authenticateToken = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'No autorizado' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autorizado' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso prohibido' });
        }
        
        next();
    };
};