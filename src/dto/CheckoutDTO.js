export class CheckoutDTO {
    constructor(data) {
        this.cartId = data.cartId || data.cid;
        this.userId = data.userId || data.uid;
    }

    validate() {
        const errors = [];

        if (!this.cartId) errors.push('ID del carrito es requerido');
        if (!this.userId) errors.push('ID del usuario es requerido');

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toObject() {
        return {
            cartId: this.cartId,
            userId: this.userId
        };
    }
}