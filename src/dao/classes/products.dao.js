import productsModel from "../models/productsModel.js";

class ProductsMongoDAO {
  async getProducts(query, options) {
    try {
      return await productsModel.paginate(query, options);
    } catch (error) {
      throw new Error("Error al obtener productos");
    }
  }

  async getProductById(id) {
    return await productsModel.findById(id);
  }

  async createProduct(productData) {
    try {
      const newProduct = new productsModel(productData);
      return await newProduct.save();
    } catch (error) {
      throw new Error("Error al crear producto");
    }
  }

  async updateProduct(id, updateData) {
    try {
      return await productsModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    } catch (error) {
      throw new Error("Error al actualizar producto");
    }
  }

  async deleteProduct(id) {
    try {
      return await productsModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error al eliminar producto");
    }
  }

  async updateProduct(id, updateData) {
    return await productsModel.findByIdAndUpdate(id, updateData, { new: true });
  }
}

export default new ProductsMongoDAO();
