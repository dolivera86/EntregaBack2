import fs from 'fs';
import CartFSHelper from './helpers/cartFSHelper.js';

class cartFSManager {
    constructor(file) {
        this.file = file;
    }

    /**
     * GET: Obtiene todos los carritos
     */
    async get() {
        try {
            const carts = await fs.promises.readFile(this.file, 'utf-8');
            return JSON.parse(carts);
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    /**
     * GETById: Obtiene un carrito por ID
     */
    async getById(cid) {
        const carts = await this.get();
        const cart = CartFSHelper.getCartById(carts, cid);

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        return cart;
    }

    /**
     * CREATE: Crea un nuevo carrito
     */
    async create() {
        const carts = await this.get();

        const newCart = {
            id: CartFSHelper.getCartID(carts),
            products: []
        }

        carts.push(newCart);

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(carts, null, '\t'));
            return newCart;
        } catch (error) {
            throw new Error('Error al crear el carrito');
        }
    }

    /**
     * UPDATE: Actualiza los datos de un carrito
     */
    async update(cid, updateData) {
        const carts = await this.get();
        const cartIndex = CartFSHelper.findCartIndex(carts, cid);

        if (cartIndex === -1) throw new Error(`El carrito ${cid} no existe!`);

        carts[cartIndex] = { ...carts[cartIndex], ...updateData };

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(carts, null, '\t'));
            return carts[cartIndex];
        } catch (error) {
            throw new Error('Error al actualizar el carrito');
        }
    }

    /**
     * DELETE: Elimina un carrito
     */
    async delete(cid) {
        const carts = await this.get();
        const initialLength = carts.length;

        const updatedCarts = carts.filter(cart => cart.id != cid);

        if (updatedCarts.length === initialLength) {
            throw new Error(`El carrito ${cid} no existe!`);
        }

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(updatedCarts, null, '\t'));
            return { deletedCount: 1 };
        } catch (error) {
            throw new Error('Error al eliminar el carrito');
        }
    }
}

export { cartFSManager };