import { Router } from "express";

export default function createCartRouter(cartManager) {
    const router = Router();

    // Crear carrito
    router.post("/", (req, res) => {
        const cart = cartManager.createCart();
        res.status(201).json({ message: "Carrito creado", payload: cart });
    });

    // Obtener carrito por ID
    router.get("/:cartId", (req, res) => {
        const cart = cartManager.getCartById(req.params.cartId);

        if (!cart)
            return res.status(404).json({ msg: "Carrito no encontrado" });

        res.status(200).json({ payload: cart });
    });

    // Agregar producto al carrito
    router.post("/:cartId/product/:productId", (req, res) => {
        const cart = cartManager.addProductToCart(req.params.cartId, req.params.productId);

        if (!cart)
            return res.status(404).json({ msg: "Carrito no encontrado" });

        res.status(200).json({
            message: "Producto agregado al carrito",
            payload: cart
        });
    });

    return router;
}
