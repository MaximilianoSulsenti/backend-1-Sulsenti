import productModel from "../models/product.model.js";

export default class ProductManager {
    
  async getProducts() {
    return await productModel.find().lean();
  }

  async getProductsPaginated({ limit = 10, page = 1, sort, query }) {
        const filter = {};

        // FILTRO GENERAL
        if (query) {
            if (query === "disponible") filter.disponible = true;
            else filter.categoria = query;
        }

        let sortOption = {};
        if (sort === "asc") sortOption = { price: 1 };
        if (sort === "desc") sortOption = { price: -1 };

        const result = await productModel.paginate(filter, {limit, page, sort: sortOption, lean: true});

        //link de paginacion
         result.prevLink = result.hasPrevPage 
            ? `/products?page=${result.prevPage}&limit=${limit}` 
            : null;

        result.nextLink = result.hasNextPage 
            ? `/products?page=${result.nextPage}&limit=${limit}` 
            : null;

            return result;

      }

  async getProductById(id) {
    return await productModel.findById(id).lean();
  }

  async addProduct(product) {
    const newProduct = new productModel(product);
    return await newProduct.save();
  }

  async updateProduct(id, updatedData) {
    const updated = await productModel.findByIdAndUpdate(id, updatedData, { new: true }).lean();
    return updated;
  }

  async deleteProduct(id) {
   return await productModel.findByIdAndDelete(id);
  }

}
