import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

     // carga los productos desde el archivo
    loadProducts() {
        if (fs.existsSync(this.path)) {
            const data = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            this.products = data.data || [];
        } else {
            this.products = [];
            fs.writeFileSync(this.path, JSON.stringify({ data: [] }, null, 2));
        }
    }

    // guarda los productos en el archivo
    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify({ data: this.products }, null, 2));
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id === id) || null;
    }

    // crea un nuevo producto 
    addProduct(product) {
       const { description, stock, precio, esDescuento} = product;

        // valida todos los campos obligatorios
        if (!description || stock === undefined || precio === undefined || esDescuento === undefined) {
            throw new Error("Faltan campos obligatorios al crear el producto");
        }

        // valida tipos de datos
         if (typeof description !== "string" || typeof stock !== "number" || typeof precio !== "number" || typeof esDescuento !== "boolean") {
            throw new Error("los tipos de datos son incorrectos");
        }

        const newProduct = { id: uuidv4(), ...product };
        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    // actualiza un producto que ya existe
    updateProduct(id, updatedData) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return null;
        this.products[index] = { ...this.products[index], ...updatedData };
        this.saveProducts();
        return this.products[index];
    }

    // elimina un producto por ID
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return null;
        const deleted = this.products.splice(index, 1)[0];
        this.saveProducts();
        return deleted;
    }
}
