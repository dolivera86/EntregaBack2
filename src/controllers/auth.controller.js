import { generateToken } from '../config/jwt.config.js';
import { UserResponseDTO } from '../dto/UserResponseDTO.js';

export const register = async (req, res) => {
    try {
        const token = generateToken(req.user);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: req.user });
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
    try {
        const user = req.user;

        const userDTO = new UserResponseDTO(user);
        const validation = userDTO.validate();

        if (!validation.isValid) {
            return res.status(400).json({
                status: 'error',
                message: 'Error en datos del usuario',
                errors: validation.errors
            });
        }

        res.json({
            status: 'success',
            user: userDTO.toObject()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener usuario actual'
        });
    }
};