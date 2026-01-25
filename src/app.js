import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import {mongoConnect} from "./database/mongoConnection.js";
import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import { initializePassport } from "./config/passport.js";
import { env } from "./config/environment.js";


// Managers con mongoose
import ProductManager from "./managers/ProductManager.js";
import CartManager from "./managers/CartManager.js";
import UserManager from "./managers/UserManager.js";

// Routers
import createProductRouter from "./routes/product.route.js";
import createCartRouter from "./routes/cart.route.js";
import createViewsRouter from "./routes/view.route.js";
import createUserRouter from "./routes/user.route.js";
import sessionRouter from "./routes/sessions.route.js";

// Definiciones de __dirname y __filename en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(passport.initialize());

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

const productManager = new ProductManager();
const cartManager = new CartManager();
const userManager = new UserManager();

// conexion del servidor
const PORT = env.PORT;
const httpServer = app.listen(PORT, () =>{
  console.log(`Servidor escuchando en puerto ${PORT}`)
  mongoConnect().then(() => console.log("Conectado a la base de datos MongoDB"));
});

const io = new Server(httpServer);

// rutas con los managers correspondientes
app.use("/api/products", createProductRouter(productManager, io));
app.use("/api/carts", createCartRouter(cartManager, productManager));
app.use("/api/users", createUserRouter(userManager));
app.use("/", createViewsRouter(productManager, cartManager));
app.use("/api/sessions", sessionRouter);

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
