import { ServiceFactory } from './factory/index.js';
const ProductService = ServiceFactory.createProductService();

export default (io) => {
    io.on("connection", (socket) => {

        socket.on("createProduct", async (data) => {

            try {
                await ProductService.create(data);
                const products = await ProductService.get({});
                socket.emit("publishProducts", products.docs);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });

        socket.on("deleteProduct", async (data) => {
            try {
                const result = await ProductService.delete(data.pid);
                const products = await ProductService.get({});
                socket.emit("publishProducts", products.docs);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });
    });
}