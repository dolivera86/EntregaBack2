export class UserResponseDTO {
    constructor(user) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
    }

    validate() {
        const errors = [];

        if (!this.id) errors.push('ID de usuario es requerido');
        if (!this.first_name) errors.push('Nombre es requerido');
        if (!this.last_name) errors.push('Apellido es requerido');
        if (!this.email) errors.push('Email es requerido');
        if (!this.role) errors.push('Rol es requerido');

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toObject() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            role: this.role
        };
    }
}