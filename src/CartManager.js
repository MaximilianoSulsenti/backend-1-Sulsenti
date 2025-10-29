import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.loadCarts();
    }

    // carga los carritos desde el archivo
    loadCarts() {
        if (fs.existsSync(this.path)) {
            const data = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            this.carts = data.data || [];
        } else {
            this.carts = [];
            fs.writeFileSync(this.path, JSON.stringify({ data: [] }, null, 2));
        }
    }

     // guarda los carritos en el archivo
    saveCarts() {
        fs.writeFileSync(this.path, JSON.stringify({ data: this.carts }, null, 2));
    }
    
    getCarts() {
        return this.carts;
    }

    getCartById(id) {
        return this.carts.find(c => c.id === id) || null;
    }

     // crea un nuevo carrito
    createCart() {
        const newCart = { id: uuidv4(), products: [] };
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    // agrega un producto al carrito
    addProductToCart(cartId, productId) {
        const cart = this.carts.find(c => c.id === cartId);
        if (!cart) return null;

        const productInCart = cart.products.find(p => p.product === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        this.saveCarts();
        return cart;
    }
}

