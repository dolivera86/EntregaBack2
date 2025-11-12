import User from '../models/user.model.js';
import { hashPassword } from '../utils/password.util.js';
import { generateToken } from '../config/jwt.config.js';

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const hashedPassword = hashPassword(password);
        const user = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        const token = generateToken(user);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

export const login = async (req, res) => {
    const token = generateToken(req.user);
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
    res.json({ message: 'Login exitoso' });
};

export const current = async (req, res) => {
    const user = req.user;
    res.json({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role
    });
};