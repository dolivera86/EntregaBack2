class ProductFSHelper {
    
    static getProductID(products) {
        const productsLength = products.length;
        if (productsLength > 0) {
            return parseInt(products[productsLength - 1].id) + 1;
        }
        return 1;
    }

    static findProductIndex(products, pid) {
        return products.findIndex(product => product.id == pid);
    }

    static productExists(products, pid) {
        return products.some(product => product.id == pid);
    }

    static getProductById(products, pid) {
        const productFilter = products.filter(product => product.id == pid);
        if (productFilter.length > 0) {
            return productFilter[0];
        }
        return null;
    }

    static validateProduct(product) {
        const { title, description, code, price, stock, category } = product;
        return title && description && code && price && stock && category;
    }
}

export default ProductFSHelper;