class UpdateProductDTO {
    constructor(data) {
        this.title = data.title?.trim();
        this.description = data.description?.trim();
        this.code = data.code?.trim();
        this.price = data.price ? parseFloat(data.price) : undefined;
        this.stock = data.stock ? parseInt(data.stock) : undefined;
        this.category = data.category?.trim();
        this.thumbnails = data.thumbnails;
    }

    validate() {
        const errors = [];

        if (this.title !== undefined && (!this.title || this.title.length === 0)) {
            errors.push('El título no puede estar vacío');
        }

        if (this.description !== undefined && (!this.description || this.description.length === 0)) {
            errors.push('La descripción no puede estar vacía');
        }

        if (this.code !== undefined && (!this.code || this.code.length === 0)) {
            errors.push('El código no puede estar vacío');
        }

        if (this.price !== undefined && (isNaN(this.price) || this.price <= 0)) {
            errors.push('El precio debe ser un número mayor a 0');
        }

        if (this.stock !== undefined && (isNaN(this.stock) || this.stock < 0)) {
            errors.push('El stock debe ser un número mayor o igual a 0');
        }

        if (this.category !== undefined && (!this.category || this.category.length === 0)) {
            errors.push('La categoría no puede estar vacía');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toObject() {
        const data = {};

        if (this.title !== undefined) data.title = this.title;
        if (this.description !== undefined) data.description = this.description;
        if (this.code !== undefined) data.code = this.code;
        if (this.price !== undefined) data.price = this.price;
        if (this.stock !== undefined) data.stock = this.stock;
        if (this.category !== undefined) data.category = this.category;
        if (this.thumbnails !== undefined) data.thumbnails = this.thumbnails;

        return data;
    }
}

export default UpdateProductDTO;