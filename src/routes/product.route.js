import { Router } from "express";

export default function createProductRouter(productManager, io) {
    const router = Router();

  // GET productos con paginación, filtros y orden
      router.get("/", async (req, res) => {
          try {
              const limit = parseInt(req.query.limit) || 10;
              const page = parseInt(req.query.page) || 1;
              const sort = req.query.sort;         
              const query = req.query.query;            
      
              const result = await productManager.getProductsPaginated({limit, page, sort, query });
      
              // Construcción automática de links
              const baseUrl = req.protocol + "://" + req.get("host") + req.baseUrl;
      
              const buildLink = (newPage) => {
                  return `${baseUrl}?limit=${limit}&page=${newPage}`
                       + (sort ? `&sort=${sort}` : "")
                       + (query ? `&query=${query}` : "");
              };
      
              res.status(200).json({
                  status: "success",
                  payload: result.docs,
                  totalPages: result.totalPages,
                  page: result.page,
                  hasPrevPage: result.hasPrevPage,
                  hasNextPage: result.hasNextPage,
                  prevPage: result.prevPage,
                  nextPage: result.nextPage,
                  prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
                  nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
              });
      
          } catch (error) {
              res.status(500).json({ error: error.message });
          }
      });



    // GET producto por ID
    router.get("/:productId", async (req, res) => {
        try {
            const product = await productManager.getProductById(req.params.productId);

            if (!product)
                return res.status(404).json({ payload: null, msg: "Producto no encontrado" });

            res.status(200).json({ payload: product });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // POST crear producto
    router.post("/", async (req, res) => {
        try {
            const newProduct = await productManager.addProduct(req.body);

            // Emitimos actualización a sockets
            const updatedList = await productManager.getProducts();
            io.emit("productos_actualizados", updatedList);

            res.status(201).json({message: "Producto creado",payload: newProduct});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // PUT actualizar producto
    router.put("/:productId", async (req, res) => {
        try {
            const updated = await productManager.updateProduct(req.params.productId,req.body);

            if (!updated)
                return res.status(404).json({ msg: "Producto no encontrado" });

            const updatedList = await productManager.getProducts();
            io.emit("productos_actualizados", updatedList);

            res.status(200).json({message: "Producto actualizado",payload: updated});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // DELETE eliminar producto
    router.delete("/:productId", async (req, res) => {
        try {
            const deleted = await productManager.deleteProduct(req.params.productId);

            if (!deleted)
                return res.status(404).json({ msg: "Producto no encontrado" });

            const updatedList = await productManager.getProducts();
            io.emit("productos_actualizados", updatedList);

            res.status(200).json({message: "Producto eliminado", payload: deleted});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}
