import { Router } from "express";

export default function createProductRouter(productManager, io) {
    const router = Router();

    // GET todos los productos
    router.get("/", (req, res) => {
        res.status(200).json({ payload: productManager.getProducts() });
    });

    // GET producto por ID
    router.get("/:productId", (req, res) => {
        const product = productManager.getProductById(req.params.productId);
        if (!product)
            return res.status(404).json({ payload: null, msg: "Producto no encontrado" });

        res.status(200).json({ payload: product });
    });

    // POST crear producto
    router.post("/", (req, res) => {
        try {
            const newProduct = productManager.addProduct(req.body);

            io.emit("productos_actualizados", productManager.getProducts());

            res.status(201).json({ message: "Producto creado", payload: newProduct });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // PUT actualizar producto
    router.put("/:productId", (req, res) => {
        const updated = productManager.updateProduct(req.params.productId, req.body);

        if (!updated)
            return res.status(404).json({ msg: "Producto no encontrado" });

        io.emit("productos_actualizados", productManager.getProducts());

        res.status(200).json({ message: "Producto actualizado", payload: updated });
    });

    // DELETE eliminar producto
    router.delete("/:productId", (req, res) => {
        const deleted = productManager.deleteProduct(req.params.productId);

        if (!deleted)
            return res.status(404).json({ msg: "Producto no encontrado" });

        io.emit("productos_actualizados", productManager.getProducts());

        res.status(200).json({ message: "Producto eliminado", payload: deleted });
    });

    return router;
}
