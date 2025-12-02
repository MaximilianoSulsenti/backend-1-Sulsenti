import productModel from "../models/product.model.js";

export default class ProductManager {
    
  async getProducts() {
    return await productModel.find().lean();
  }

  async getProductsPaginated({ limit = 10, page = 1, sort, query }) {
        const filter = {};

        // Construcción dinámica del filtro
        if (query) {
            const [field, value] = query.split(":");
            filter[field] = value;
        }

        let sortOption = {};
        if (sort === "asc") sortOption = { price: 1 };
        if (sort === "desc") sortOption = { price: -1 };

        return await productModel.paginate(filter, {
            limit,
            page,
            sort: sortOption,
            lean: true
        });
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
