class AddToCartDTO {
    constructor(data) {
        this.cid = data.cid;
        this.pid = data.pid;
        this.quantity = data.quantity ? parseInt(data.quantity) : 1;
    }


    validate() {
        const errors = [];

        if (!this.cid || this.cid.trim().length === 0) {
            errors.push('El ID del carrito es requerido');
        }

        if (!this.pid || this.pid.trim().length === 0) {
            errors.push('El ID del producto es requerido');
        }

        if (isNaN(this.quantity) || this.quantity < 1) {
            errors.push('La cantidad debe ser un número mayor o igual a 1');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toObject() {
        return {
            cid: this.cid,
            pid: this.pid,
            quantity: this.quantity
        };
    }
}

export default AddToCartDTO;