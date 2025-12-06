import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        token: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }
        },
        used: {
            type: Boolean,
            default: false
        },
        usedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.model('PasswordReset', passwordResetSchema);