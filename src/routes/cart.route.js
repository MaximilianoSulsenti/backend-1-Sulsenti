import { Router } from "express";

export default function createCartRouter(cartManager) {
    const router = Router();

    // Crear carrito
    router.post("/", async (req, res) => {
        try {
            const cart = await cartManager.createCart();
            res.status(201).json({ message: "Carrito creado", payload: cart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Obtener carrito por ID
    router.get("/:cartId", async (req, res) => {
        try {
            const cart = await cartManager.getCartById(req.params.cartId);

            if (!cart)
                return res.status(404).json({ msg: "Carrito no encontrado" });

            res.status(200).json({ payload: cart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Agregar producto al carrito
    router.post("/:cartId/product/:productId", async (req, res) => {
        try {
            const cart = await cartManager.addProductToCart(req.params.cartId, req.params.productId);

            if (!cart)
                return res.status(404).json({ msg: "Carrito o producto no encontrado" });

            res.status(200).json({message: "Producto agregado al carrito", payload: cart});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    //actualiza todos los productos del carrito
    router.put("/:cartId",async (req, res) => {
        try{
            const cart = await cartManager.updateCartProducts(req.params.cartId, req.body.products);
            if(!cart)
                return res.status(404).json({msg: "Carrito no encontrado"});

            res.status(200).json({message: "Carrito actualizado", payload: cart});
        } catch (error){
            res.status(500).json({error: error.message});
        }
    })

    //actualizar cantidad de un producto en el carrito
    router.put("/:cartId/product/:productId", async (req, res) => {
        try{
             const cart = await cartManager.updateProductQuantity(req.params.cartId, req.params.productId, req.body.quantity); 

            if(!cart)
                return res.status(404).json({msg: "Carrito no encontrado"});

            res.status(200).json({message: "Cantidad de producto actualizada", payload: cart});  

        } catch (error){
            res.status(500).json({error: error.message});
        }
    })

    // elimina del carrito el producto seleccionado 
    router.delete("/:cartId/product/:productId", async (req, res) => {
        try {
            const cart = await cartManager.deleteProductFromCart(req.params.cartId, req.params.productId);
            if (!cart)
                return res.status(404).json({msg: "carrito no encontrado"});

            res.status(200).json ({message: "Producto eliminado del carrito", payload: cart});

        } catch (error){
            res.status(500).json({error: error.message});
        }
    })

    //elimina todos los productos del carrito 
    router.delete("/:cartId", async (req, res) => {
        try {
            const cart = await cartManager.clearCart(req.params.cartId);
            if (!cart)
                return res.status(404).json({msg: "carrito no encontrado"});

            res.status(200).json ({message: "Carrito vaciado", payload: cart});
        } catch (error){
            res.status(500).json({error: error.message});
        }

    });

    return router;
}

