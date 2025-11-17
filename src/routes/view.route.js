import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager("./products.json");

// Vista principal con lista de productos
router.get("/", (req, res) => {
    const productos = productManager.getProducts();
    res.render("home", { productos });
});

// Vista para productos en tiempo real
router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
});

export default router;
