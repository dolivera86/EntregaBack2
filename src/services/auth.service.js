import User from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { generateToken } from '../config/jwt.config.js';

class AuthService {
    async registerUser(userData) {
        try {
            const { email } = userData;
            const existingUser = await User.findOne({ email });
            
            if (existingUser) {
                throw new Error('El email ya está registrado');
            }

            const hashedPassword = hashPassword(userData.password);
            const newUser = new User({
                ...userData,
                password: hashedPassword
            });

            await newUser.save();
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async loginUser(email, password) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const isPasswordValid = comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Contraseña incorrecta');
            }

            const token = generateToken(user);
            return { user, token };
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser(userId) {
        try {
            const user = await User.findById(userId).select('-password');
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthService();