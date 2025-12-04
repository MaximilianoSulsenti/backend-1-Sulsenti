import { Router } from "express";

export default function createViewsRouter(productManager, cartManager) {
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


    // Vista para productos paginados
    router.get("/products", async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const sort = req.query.sort;
            const query = req.query.query;

            const result = await productManager.getProductsPaginated({limit, page, sort, query});

         // Renderiza la vista products.handlebars
            res.render("products", {
            title: "Productos",
            products: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevLink,
            nextLink: result.nextLink,
            cartId: "692f9013d6b4154d791e0445" 
        });

        } catch (error) {
            console.error(error);
            res.status(500).send("Error al cargar productos");
        }
    });

    // Vista para mostrar un carrito específico// 
        router.get("/carts/:cid", async (req, res) => {
           try {
               const cartId = req.params.cid;
       
               const cart = await cartManager.getCartById(cartId); 
               if (!cart) return res.status(404).send("Carrito no encontrado");
       
               res.render("cart", {
                   title: "Mi Carrito",
                   cart
               });
       
           } catch (error) {
               console.error(error);
               res.status(500).send("Error al cargar el carrito");
           }
         });

             // Renderizar vista del carrito
        router.get("/:cartId/view", async (req, res) => {
            try {
                const cart = await cartManager.getCartById(req.params.cartId);
        
                if (!cart)
                    return res.status(404).send("Carrito no encontrado");
        
                for (let item of cart.productos) {
                    const product = await cartManager.getProductById(item.product);
                    item.product = product;
                }
        
                res.render("carrito", {
                    cart,
                    helpers: {
                        multiply: (a, b) => a * b,
                        calculateTotal: (items) => {
                            let total = 0;
                            items.forEach(i => total += i.product.precio * i.quantity);
                            return total;
                        }
                    }
                });
        
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

      return router;
  }
