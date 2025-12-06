export class CartRepository {
    constructor(cartDAO) {
        this.dao = cartDAO;
    }

    async getAllCarts() {
        return await this.dao.get();
    }

    async getCartById(cartId) {
        return await this.dao.getById(cartId);
    }

    async createCart() {
        return await this.dao.create();
    }

    async updateCart(cartId, updateData) {
        return await this.dao.update(cartId, updateData);
    }

    async deleteCart(cartId) {
        return await this.dao.delete(cartId);
    }

    async getCartProducts(cartId) {
        const cart = await this.dao.getById(cartId);
        return cart.products;
    }

    async clearCart(cartId) {
        return await this.dao.update(cartId, { products: [] });
    }

    async getCartProductCount(cartId) {
        const cart = await this.dao.getById(cartId);
        return cart.products.reduce((total, item) => total + item.quantity, 0);
    }
}

export default CartRepository;