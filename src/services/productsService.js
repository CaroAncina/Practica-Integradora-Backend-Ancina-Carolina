import ProductsMongoDAO from "../dao/classes/products.dao.js";
import logger from "../utils/logger.js";

class ProductService {
  async getAllProducts(query, options) {
    try {
      const products = await ProductsMongoDAO.getProducts(query, options);
      logger.info("Productos obtenidos correctamente");
      return products;
    } catch (error) {
      logger.error("Error al obtener los productos:", error.message);
      throw new Error("Error al obtener productos");
    }
  }

  async getProductById(pid) {
    try {
      const product = await ProductsMongoDAO.getProductById(pid);
      if (!product) {
        logger.info(`Producto ${product.title} no encontrado`);
      } else {
        logger.info(`Producto ${product.title} obtenido correctamente`);
      }
      return product;
    } catch (error) {
      throw new Error("Error al obtener el producto por ID");
    }
  }

  async createProduct(productData) {
    try {
      logger.info("Producto creado correctamente:", productData);
      return await ProductsMongoDAO.createProduct(productData);
    } catch (error) {
      logger.error("Error al crear el producto:", error);
      throw new Error("Error al crear el producto");
    }
  }

  async updateProduct(id, updateData) {
    try {
      logger.info(`Producto con ID ${id.title} actualizado correctamente`);
      return await ProductsMongoDAO.updateProduct(id, updateData);
    } catch (error) {
      logger.error("Error al actualizar el producto:", error.message);
      throw new Error("Error al actualizar producto");
    }
  }

  async deleteProduct(id) {
    try {
      const product = await ProductsMongoDAO.getProductById(id);

      if (!product) {
        logger.info(`Producto con ID ${id} no encontrado para eliminar`);
        return { deletedCount: 0 };
      }

      const result = await ProductsMongoDAO.deleteProduct({ _id: id });

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

  async updateProductImage(id, imagePath) {
    try {
      const product = await this.getProductById(id);
      product.thumbnail = imagePath;
      const updatedProduct = await ProductsMongoDAO.updateProduct(id, {
        thumbnail: imagePath,
      });
      return updatedProduct;
    } catch (error) {
      throw new Error("Error al actualizar la imagen del producto");
    }
  }
}

export default new ProductService();
