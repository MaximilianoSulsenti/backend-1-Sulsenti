import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

export default class CartManager {

    //obtener todos los carritos
    async getCarts() {
        return await cartModel.find().populate('productos.product').lean();
    }

    async getCartById(id) {
        return await cartModel.findById(id).populate('productos.product').lean();
    }

    //crear nuevo carrito
    async createCart () {
        const newCart = new cartModel({ productos: [] });
        return await newCart.save();
    }

    //agregar producto al carrito
    async addProductToCart(cartId, productId) {
        const cart = await cartModel.findById(cartId);
        if (!cart) return null;

        // el producto existe?
        const productExiste = await productModel.findById(productId);
        if (!productExiste) return null;

        // el producto ya esta en el carrito?
        const productInCart = cart.productos.find(p => p.product.toString() === productId.toString());

        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.productos.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        return await cartModel.findById(cartId).populate('productos.product').lean();
    }

    //actualiza todos los productos del carrito
        async updateCartProducts(cartId, products) {

          const cart = await cartModel.findById(cartId);
          if (!cart) return null;

         cart.productos = products;;
         await cart.save();

           return await cartModel.findById(cartId).populate('productos.product').lean();
    }

    //actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {

        const cart = await cartModel.findById(cartId);
        if (!cart) return null;

        const productInCart = cart.productos.find(p => p.product.toString() === productId.toString());
        if (!productInCart) return null;

        productInCart.quantity = quantity;
        await cart.save();

        return await cartModel.findById(cartId).populate('productos.product').lean();
    }

    //eliminar un producto del carrito
       async deleteProductFromCart(cartId, productId) {
          
          const cart = await cartModel.findById(cartId);
            if (!cart) return null;

            cart.productos = cart.productos.filter(p => p.product.toString() !== productId.toString());

            await cart.save();
            return await cartModel.findById(cartId).populate('productos.product').lean();
    }
    
      // eliminar todos los productos del carrito
         async clearCart(cartId) {
             const cart = await cartModel.findById(cartId);
             if (!cart) return null;
     
             cart.productos = [];
              await cart.save();
     
             return await cartModel.findById(cartId).populate('productos.product').lean();
    }
}



