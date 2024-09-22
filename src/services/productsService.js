import productsModel from "../dao/models/productsModel.js";
import logger from "../utils/logger.js";

export default class ProductService {
  static async getAllProducts(query, options) {
    try {
      const products = await productsModel.paginate(query, options);
      logger.info("Productos obtenidos correctamente");
      return products;
    } catch (error) {
      logger.error("Error al obtener los productos:", error.message);
      throw new Error("Error al obtener los productos");
    }
  }

  static async getProductById(id) {
    try {
      const product = await productsModel.findById(id);
      if (!product) {
        logger.info(`Producto ${product.title} no encontrado`);
      } else {
        logger.info(`Producto ${product.title} obtenido correctamente`);
      }
      return product;
    } catch (error) {
      logger.error("Error al obtener el producto por ID:", error.message);
      throw new Error("Error al obtener el producto por ID");
    }
  }

  static async createProduct(productData) {
    try {
      const product = await productsModel.create(productData);
      logger.info("Producto creado correctamente:", productData);
      return product;
    } catch (error) {
      logger.error("Error al crear el producto:", error);
      throw new Error("Error al crear el producto");
    }
  }

  static async updateProduct(id, productData) {
    try {
      const result = await productsModel.updateOne({ _id: id }, productData);
      if (result.nModified === 0) {
        logger.info(
          `Producto con ID ${result.id} no encontrado para actualizar`
        );
      } else {
        logger.info(`Producto con ID ${result.id} actualizado correctamente`);
      }
      return result;
    } catch (error) {
      logger.error("Error al actualizar el producto:", error.message);
      throw new Error("Error al actualizar el producto");
    }
  }

  static async deleteProduct(id) {
    try {
      const product = await productsModel.findById(id);

      if (!product) {
        logger.info(`Producto con ID ${id} no encontrado para eliminar`);
        return { deletedCount: 0 };
      }

      const result = await productsModel.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        logger.info(`Producto con ID ${id} no encontrado para eliminar`);
      } else {
        logger.info(
          `Producto "${product.title}" (ID: ${id}) eliminado correctamente`
        );
      }
      return result;
    } catch (error) {
      logger.error("Error al eliminar el producto:", error.message);
      throw new Error("Error al eliminar el producto");
    }
  }
}
