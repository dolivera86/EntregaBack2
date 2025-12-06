export class TicketDTO {
    constructor(ticket) {
        this.code = ticket.code;
        this.purchase_datetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser_email = ticket.purchaser_email;
        this.products = ticket.products;
        this.status = ticket.status;
    }

    validate() {
        const errors = [];

        if (!this.code) errors.push('Código de ticket es requerido');
        if (!this.purchase_datetime) errors.push('Fecha de compra es requerida');
        if (this.amount === undefined || this.amount === null) errors.push('Monto es requerido');
        if (!this.purchaser_email) errors.push('Email del comprador es requerido');
        if (!Array.isArray(this.products)) errors.push('Productos debe ser un array');
        if (!this.status) errors.push('Estado es requerido');

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toObject() {
        return {
            code: this.code,
            purchase_datetime: this.purchase_datetime,
            amount: this.amount,
            purchaser_email: this.purchaser_email,
            products: this.products,
            status: this.status
        };
    }
}

export class PasswordResetRequestDTO {
    constructor(data) {
        this.email = data.email;
    }

    validate() {
        const errors = [];

        if (!this.email) {
            errors.push('Email es requerido');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            errors.push('Email inválido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toObject() {
        return { email: this.email };
    }
}

export class PasswordResetDTO {
    constructor(data) {
        this.token = data.token;
        this.newPassword = data.newPassword;
        this.confirmPassword = data.confirmPassword;
    }

    validate() {
        const errors = [];

        if (!this.token) {
            errors.push('Token es requerido');
        }

        if (!this.newPassword) {
            errors.push('Nueva contraseña es requerida');
        } else if (this.newPassword.length < 6) {
            errors.push('Contraseña debe tener al menos 6 caracteres');
        }

        if (!this.confirmPassword) {
            errors.push('Confirmación de contraseña es requerida');
        }

        if (this.newPassword && this.confirmPassword && this.newPassword !== this.confirmPassword) {
            errors.push('Las contraseñas no coinciden');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toObject() {
        return {
            token: this.token,
            newPassword: this.newPassword
        };
    }
}