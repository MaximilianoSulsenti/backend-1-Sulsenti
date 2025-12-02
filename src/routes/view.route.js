import { Router } from "express";

export default function createViewsRouter(productManager) {
    const router = Router();

    // Vista principal con lista de productos
    router.get("/", async (req, res) => {
        try {
            const productos = await productManager.getProducts();
            res.render("home", { productos });
        } catch (error) {
            res.status(500).send("Error al cargar productos");
        }
    });

    // Vista para productos en tiempo real
    router.get("/realtimeproducts", (req, res) => {
        res.render("realtimeproducts");
    });

    return router;
}
