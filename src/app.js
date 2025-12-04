import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

// Managers con mongoose
import ProductManager from "./managers/ProductManager.js";
import CartManager from "./managers/CartManager.js";

// Routers
import createProductRouter from "./routes/product.route.js";
import createCartRouter from "./routes/cart.route.js";
import createViewsRouter from "./routes/view.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Handlebars helpers 
const hbs = exphbs.create({
    helpers: {
        multiply: (a, b) => a * b,
        calculateTotal: (items) =>{
         return items.reduce((sum, item) => sum + (item.product.precio * item.quantity), 0);
        }
    }
});

// Configuración Handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// conexion a Mongo DB
mongoose.connect("mongodb+srv://sulsentimaximiliano_db_user:TbfYqIvysujWgrp8@cluster0.tscagks.mongodb.net/")
.then(() => {
    console.log("Conectado a MongoDB");
}).catch(err => {
    console.error("Error al conectar a MongoDB:", err);
});

const productManager = new ProductManager();
const cartManager = new CartManager();

// conexion del servidor
const PORT = 8080;
const httpServer = app.listen(PORT, () =>
  console.log(`Servidor escuchando en puerto ${PORT}`)
);

const io = new Server(httpServer);

// rutas con los managers correspondientes
app.use("/api/products", createProductRouter(productManager, io));
app.use("/api/carts", createCartRouter(cartManager, productManager));
app.use("/", createViewsRouter(productManager, cartManager));

 // Socket.io para productos en tiempo real
 io.on("connection", async socket => {
  console.log("Cliente conectado:", socket.id);

  // Enviar lista inicial desde Mongo
  socket.emit("productos_actualizados", await productManager.getProducts());

  socket.on("nuevo_producto", async data => {
    await productManager.addProduct(data);
    io.emit("productos_actualizados", await productManager.getProducts());
  });

  socket.on("eliminar_producto", async id => {
    await productManager.deleteProduct(id);
    io.emit("productos_actualizados", await productManager.getProducts());
  });
});
