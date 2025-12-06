export class ProductRepository {
    constructor(productDAO) {
        this.dao = productDAO;
    }

    async getAllProducts(params = {}) {
        return await this.dao.get(params);
    }

    async getProductById(productId) {
        return await this.dao.getById(productId);
    }

    async createProduct(productData) {
        return await this.dao.create(productData);
    }

    async updateProduct(productId, updateData) {
        return await this.dao.update(productId, updateData);
    }

    async deleteProduct(productId) {
        return await this.dao.delete(productId);
    }

    async hasStock(productId, quantity) {
        const product = await this.dao.getById(productId);
        return product && product.stock >= quantity;
    }

    async reduceStock(productId, quantity) {
        const product = await this.dao.getById(productId);
        const newStock = product.stock - quantity;
        return await this.dao.update(productId, { stock: newStock });
    }

    async getProductsByCategory(category) {
        return await this.dao.get({ category });
    }
}

export default ProductRepository;