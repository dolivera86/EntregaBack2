import User from '../models/user.model.js';
import PasswordReset from '../models/passwordReset.model.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import mailService from '../utils/mailService.js';
import crypto from 'crypto';

class PasswordResetService {

    async requestPasswordReset(email) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error('El usuario no existe');
            }

            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

            await PasswordReset.create({
                userId: user._id,
                token,
                expiresAt,
                used: false
            });

            await mailService.sendPasswordResetEmail(
                user.email,
                user.first_name,
                token
            );

            return {
                success: true,
                message: 'Email de recuperación enviado exitosamente'
            };
        } catch (error) {
            throw error;
        }
    }

    async validateResetToken(token) {
        try {
            const resetRecord = await PasswordReset.findOne({
                token,
                used: false,
                expiresAt: { $gt: new Date() }
            });

            if (!resetRecord) {
                throw new Error('Token inválido o expirado');
            }

            return resetRecord;
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(token, newPassword) {
        try {

            const resetRecord = await this.validateResetToken(token);

            const user = await User.findById(resetRecord.userId);

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            if (comparePassword(newPassword, user.password)) {
                throw new Error('La nueva contraseña no puede ser igual a la anterior');
            }

            const hashedPassword = hashPassword(newPassword);
            user.password = hashedPassword;
            await user.save();

            resetRecord.used = true;
            resetRecord.usedAt = new Date();
            await resetRecord.save();

            return {
                success: true,
                message: 'Contraseña actualizada exitosamente'
            };
        } catch (error) {
            throw error;
        }
    }

    async cleanExpiredTokens() {
        try {
            const result = await PasswordReset.deleteMany({
                expiresAt: { $lt: new Date() }
            });

            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default new PasswordResetService();