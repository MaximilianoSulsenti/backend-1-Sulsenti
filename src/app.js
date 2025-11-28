import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";
import { Server } from "socket.io";
import exphbs from "express-handlebars";
import path from "path";
import viewsRouter from "./routes/view.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./carts.json", productManager);

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.use("/", viewsRouter);

// Servidor HTTP
const PORT = 8080;
const httpServer = app.listen(PORT, () =>
  console.log(`Servidor en puerto ${PORT}`)
);

// Servidor Socket.io
const io = new Server(httpServer);

io.on("connection", socket => {
  console.log("Cliente conectado:", socket.id);

  // Enviar lista inicial
  socket.emit("productos_actualizados", productManager.getProducts());

  // Crear nuevo producto
  socket.on("nuevo_producto", data => {
    productManager.addProduct(data);
    io.emit("productos_actualizados", productManager.getProducts());
  });

  // Eliminar producto
  socket.on("eliminar_producto", id => {
    productManager.deleteProduct(id);
    io.emit("productos_actualizados", productManager.getProducts());
  });
  
});
