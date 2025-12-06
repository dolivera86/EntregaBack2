import { cartModel } from "./models/cartModel.js";

class cartDBManager {
    /**
     * GET: Obtiene todos los carritos
     */
    async get() {
        return await cartModel.find().populate('products.product');
    }

    /**
     * GETById: Obtiene un carrito por ID
     */
    async getById(cid) {
        const cart = await cartModel.findOne({ _id: cid }).populate('products.product');

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
        
        return cart;
    }

    /**
     * CREATE: Crea un nuevo carrito vacío
     */
    async create() {
        return await cartModel.create({ products: [] });
    }

    /**
     * UPDATE: Actualiza los productos de un carrito
     */
    async update(cid, updateData) {
        const result = await cartModel.updateOne({ _id: cid }, updateData);

        if (result.matchedCount === 0) {
            throw new Error(`El carrito ${cid} no existe!`);
        }

        return result;
    }

    /**
     * DELETE: Elimina un carrito
     */
    async delete(cid) {
        const result = await cartModel.deleteOne({ _id: cid });

        if (result.deletedCount === 0) {
            throw new Error(`El carrito ${cid} no existe!`);
        }

        return result;
    }
}

export { cartDBManager };