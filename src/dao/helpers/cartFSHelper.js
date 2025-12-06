class CartFSHelper {
   
    static getCartID(carts) {
        const cartsLength = carts.length;
        if (cartsLength > 0) {
            return parseInt(carts[cartsLength - 1].id) + 1;
        }
        return 1;
    }

    static findCartIndex(carts, cid) {
        return carts.findIndex(cart => cart.id == cid);
    }

    /**
     * Verifica si un carrito existe
     */
    static cartExists(carts, cid) {
        return carts.some(cart => cart.id == cid);
    }

    /**
     * Obtiene un carrito por ID
     */
    static getCartById(carts, cid) {
        const cartFilter = carts.filter(cart => cart.id == cid);
        if (cartFilter.length > 0) {
            return cartFilter[0];
        }
        return null;
    }
}

export default CartFSHelper;