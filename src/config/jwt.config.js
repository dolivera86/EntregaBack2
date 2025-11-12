import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES = '24h';

export const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id,
            email: user.email,
            role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};