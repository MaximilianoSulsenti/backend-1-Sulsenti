import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
app.use(express.json());

const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./carts.json");


const productos = [
    { 
      descripcion: "Camiseta algodón",
      stock: 25,
      precio: 19.99,
      esDescuento: false
    },
    { 
      descripcion: "Pantalón jean",
      stock: 12,
      precio: 39.5,
      esDescuento: true 
    },
    { 
      descripcion: "Zapatillas deportivas",
      stock: 30,
      precio: 59.99,
      esDescuento: false
    },
    { 
      descripcion: "Gorra deportiva",
      stock: 50,
      precio: 12.0,
      esDescuento: true
    },
    { 
      descripcion: "Chaqueta impermeable",
      stock: 8, 
      precio: 89.9,
      esDescuento: false
    },
    {
      descripcion: "Calcetines pack 3",
      stock: 100,
      precio: 9.99,
      esDescuento: true
    },
    {
      descripcion: "Sudadera con capucha",
      stock: 16,
      precio: 49.99,
      esDescuento: false
    },
    { 
      descripcion: "Mochila urbana",
      stock: 20,
      precio: 34.75,
      esDescuento: true
    },
    { 
      descripcion: "Reloj deportivo",
      stock: 7,
      precio: 129.99,
      esDescuento: false
    },
    {
      descripcion: "Cinturón cuero",
      stock: 40,
      precio: 24.5,
      esDescuento: true
    }
];

// solo agrega productos si el JSON está vacío
if (productManager.getProducts().length === 0) {
    productos.forEach(p => productManager.addProduct(p));
}

 // endpoints de productos por id y para obtener todos los productos
app.get("/product", (req, res) => {
    res.status(200).json({ payload: productManager.getProducts() });
});

app.get("/product/:productId", (req, res) => {
    const product = productManager.getProductById(req.params.productId);
    if (!product) return res.status(404).json({ payload: null, msg: "Producto no encontrado" });
    res.status(200).json({ payload: product });
});

// crean , actualizan y eliminan productos 
app.post("/product", (req, res) => {
    try {
        const newProduct = productManager.addProduct(req.body);
        res.status(201).json({ message: "Producto creado ", payload: newProduct });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.put("/product/:productId", (req, res) => {
    const updated = productManager.updateProduct(req.params.productId, req.body);
    if (!updated) return res.status(404).json({ msg: "Producto no encontrado" });
    res.status(200).json({ message: "Producto actualizado", payload: updated });
});

app.delete("/product/:productId", (req, res) => {
    const deleted = productManager.deleteProduct(req.params.productId);
    if (!deleted) return res.status(404).json({ msg: "Producto no encontrado" });
    res.status(200).json({ message: "Producto eliminado ", payload: deleted });
});

// se crean carritos y se agregan productos a los carritos por ID
app.post("/carts", (req, res) => {
    const cart = cartManager.createCart();
    res.status(201).json({ message: "Carrito creado", payload: cart });
});

app.get("/carts/:cartId", (req, res) => {
    const cart = cartManager.getCartById(req.params.cartId);
    if (!cart) return res.status(404).json({ msg: "Carrito no encontrado" });
    res.status(200).json({ payload: cart });
});

app.post("/carts/:cartId/product/:productId", (req, res) => {
    const cart = cartManager.addProductToCart(req.params.cartId, req.params.productId);
    if (!cart) return res.status(404).json({ msg: "Carrito no encontrado" });
    res.status(200).json({ message: "Producto agregado al carrito", payload: cart });
});

// inicializador del servidor
app.listen(8080, () => {
    console.log("Servidor escuchando en puerto 8080");
});