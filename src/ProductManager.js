import fs from "fs";
import { v4 as uuidv4 } from "uuid";

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

export default class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();

      // Si el JSON está vacío → cargar productos iniciales
        if (this.products.length === 0) {
            console.log("⚠ JSON vacío → cargando productos iniciales...");
            productos.forEach(p => this.addProduct(p));
        }

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
       const { descripcion, stock, precio} = product;

        // valida todos los campos obligatorios
        if (!descripcion || stock === undefined || precio === undefined) {
            throw new Error("Faltan campos obligatorios al crear el producto");
        }

        const stockNum = Number(stock);
        const precioNum = Number(precio);

        if (isNaN(stockNum) || isNaN(precioNum)) {
            throw new Error("Stock y precio deben ser números válidos");
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
