import mongoose from 'mongoose';

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        purchase_datetime: {
            type: Date,
            required: true,
            default: Date.now
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        purchaser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        purchaser_email: {
            type: String,
            required: true
        },
        products: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                title: String,
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                unit_price: {
                    type: Number,
                    required: true,
                    min: 0
                },
                total_price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],
        status: {
            type: String,
            enum: ['completed', 'partial', 'failed'],
            default: 'completed'
        }
    },
    { timestamps: true }
);

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);