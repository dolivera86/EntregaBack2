class CartProductService {
    constructor(cartDBManager, productDBManager) {
        this.cartDBManager = cartDBManager;
        this.productDBManager = productDBManager;
    }

    async addProductToCart(cid, pid) {

        await this.productDBManager.getProductByID(pid);

        const cart = await this.cartDBManager.getById(cid);

        let productIndex = null;
        const productExists = cart.products.some((item, index) => {
            if (item.product.toString() === pid) {
                productIndex = index;
                return true;
            }
            return false;
        });

        if (productExists) {

            cart.products[productIndex].quantity += 1;
        } else {

            cart.products.push({
                product: pid,
                quantity: 1
            });
        }

        await this.cartDBManager.update(cid, { products: cart.products });

        return await this.cartDBManager.getById(cid);
    }

    async removeProductFromCart(cid, pid) {

        await this.productDBManager.getProductByID(pid);

        const cart = await this.cartDBManager.getById(cid);

        const newProducts = cart.products.filter(item => item.product.toString() !== pid);

        await this.cartDBManager.update(cid, { products: newProducts });

        return await this.cartDBManager.getById(cid);
    }

    async updateProductQuantity(cid, pid, quantity) {

        if (!quantity || isNaN(parseInt(quantity))) {
            throw new Error('La cantidad ingresada no es válida!');
        }

        await this.productDBManager.getProductByID(pid);

        const cart = await this.cartDBManager.getById(cid);

        let productIndex = null;
        const productExists = cart.products.some((item, index) => {
            if (item.product.toString() === pid) {
                productIndex = index;
                return true;
            }
            return false;
        });

        if (!productExists) {
            throw new Error(`El producto ${pid} no existe en el carrito ${cid}!`);
        }

        cart.products[productIndex].quantity = parseInt(quantity);

        await this.cartDBManager.update(cid, { products: cart.products });

        return await this.cartDBManager.getById(cid);
    }

    async getCartTotal(cid) {
        const cart = await this.cartDBManager.getById(cid);
        
        let total = 0;
        for (const item of cart.products) {
            const product = await this.productDBManager.getById(item.product._id || item.product);
            total += product.price * item.quantity;
        }

        return {
            cartId: cid,
            total: total,
            currency: 'USD',
            itemCount: cart.products.length
        };
    }

    async getCartWithDetails(cid) {
        const cart = await this.cartDBManager.getById(cid);

        const detailedProducts = await Promise.all(
            cart.products.map(async (item) => {
                const product = await this.productDBManager.getById(item.product._id || item.product);
                return {
                    product: product,
                    quantity: item.quantity,
                    subtotal: product.price * item.quantity
                };
            })
        );

        return {
            _id: cart._id,
            products: detailedProducts,
            total: detailedProducts.reduce((sum, item) => sum + item.subtotal, 0)
        };
    }
}

export default CartProductService;