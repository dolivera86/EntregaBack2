class CreateProductDTO {
    constructor(data) {
        this.title = data.title?.trim();
        this.description = data.description?.trim();
        this.code = data.code?.trim();
        this.price = parseFloat(data.price);
        this.stock = parseInt(data.stock);
        this.category = data.category?.trim();
        this.thumbnails = data.thumbnails || [];
    }

    validate() {
        const errors = [];

        if (!this.title || this.title.length === 0) {
            errors.push('El título es requerido');
        }

        if (!this.description || this.description.length === 0) {
            errors.push('La descripción es requerida');
        }

        if (!this.code || this.code.length === 0) {
            errors.push('El código es requerido');
        }

        if (!this.price || isNaN(this.price) || this.price <= 0) {
            errors.push('El precio debe ser un número mayor a 0');
        }

        if (!this.stock || isNaN(this.stock) || this.stock < 0) {
            errors.push('El stock debe ser un número mayor o igual a 0');
        }

        if (!this.category || this.category.length === 0) {
            errors.push('La categoría es requerida');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toObject() {
        return {
            title: this.title,
            description: this.description,
            code: this.code,
            price: this.price,
            stock: this.stock,
            category: this.category,
            thumbnails: this.thumbnails
        };
    }
}

export default CreateProductDTO;