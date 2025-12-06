import fs from 'fs';
import ProductFSHelper from './helpers/productFSHelper.js';

class productFSManager {
    constructor(file) {
        this.file = file;
    }

    /**
     * GET: Obtiene todos los productos
     */
    async get() {
        try {
            const products = await fs.promises.readFile(this.file, 'utf-8');
            return JSON.parse(products);
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    /**
     * GETById: Obtiene un producto por ID
     */
    async getById(pid) {
        const products = await this.get();
        const product = ProductFSHelper.getProductById(products, pid);

        if (!product) throw new Error(`El producto ${pid} no existe!`);

        return product;
    }

    /**
     * CREATE: Crea un nuevo producto
     */
    async create(product) {
        if (!ProductFSHelper.validateProduct(product)) {
            throw new Error('Error al crear el producto');
        }

        const products = await this.get();

        const newProduct = {
            id: ProductFSHelper.getProductID(products),
            ...product,
            status: true,
            thumbnails: product.thumbnails ?? []
        }

        products.push(newProduct);

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(products, null, '\t'));
            return newProduct;
        } catch (error) {
            throw new Error('Error al crear el producto');
        }
    }

    /**
     * UPDATE: Actualiza un producto
     */
    async update(pid, productUpdate) {
        const products = await this.get();
        const productIndex = ProductFSHelper.findProductIndex(products, pid);

        if (productIndex === -1) throw new Error(`El producto ${pid} no existe!`);

        // Actualizar solo los campos proporcionados
        const updatedProduct = {
            ...products[productIndex],
            ...productUpdate
        };

        products[productIndex] = updatedProduct;

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(products, null, '\t'));
            return products[productIndex];
        } catch (error) {
            throw new Error('Error al actualizar el producto');
        }
    }

    /**
     * DELETE: Elimina un producto
     */
    async delete(pid) {
        const products = await this.get();
        const productsFilter = products.filter(product => product.id != pid);

        if (products.length === productsFilter.length) {
            throw new Error(`El producto ${pid} no existe!`);
        }

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(productsFilter, null, '\t'));
            return { deletedCount: 1 };
        } catch (error) {
            throw new Error(`Error al eliminar el producto ${pid}`);
        }
    }
}

export { productFSManager };