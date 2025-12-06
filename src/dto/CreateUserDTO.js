class CreateUserDTO {
    constructor(data) {
        this.first_name = data.first_name?.trim();
        this.last_name = data.last_name?.trim();
        this.email = data.email?.trim().toLowerCase();
        this.age = data.age ? parseInt(data.age) : undefined;
        this.password = data.password;
        this.role = data.role || 'user';
    }

    validate() {
        const errors = [];

        if (!this.first_name || this.first_name.length === 0) {
            errors.push('El nombre es requerido');
        }

        if (!this.last_name || this.last_name.length === 0) {
            errors.push('El apellido es requerido');
        }

        if (!this.email || !this.isValidEmail(this.email)) {
            errors.push('El email es requerido y debe ser válido');
        }

        if (!this.password || this.password.length < 6) {
            errors.push('La contraseña es requerida y debe tener al menos 6 caracteres');
        }

        if (this.age !== undefined && (isNaN(this.age) || this.age < 13)) {
            errors.push('La edad debe ser un número mayor o igual a 13');
        }

        if (!['user', 'admin'].includes(this.role)) {
            errors.push('El rol debe ser "user" o "admin"');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    toObject() {
        return {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            age: this.age,
            password: this.password,
            role: this.role
        };
    }
}

export default CreateUserDTO;