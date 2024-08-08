import UsersMongoDAO from "../dao/models/usersModel.js";
import CartsMongoDAO from "../dao/models/cartsModel.js";
import ProductModel from "../dao/models/productsModel.js";
import ticketsService from "./ticketsService.js";
import { sendPurchaseEmail } from "../utils/mailer.js";
import logger from "../utils/logger.js";

class CartService {
  async getCarts() {
    try {
      const carts = await CartsMongoDAO.find();
      logger.info("Carritos obtenidos correctamente");
      return carts;
    } catch (error) {
      logger.error("Error al obtener carritos:", error);
      throw new Error("Error al obtener carritos");
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartsMongoDAO.findById(cartId);
      if (!cart) {
        logger.warn(`Carrito con ID ${cartId} no encontrado`);
      } else {
        logger.info(`Carrito con ID ${cartId} obtenido correctamente`);
      }
      return cart;
    } catch (error) {
      logger.error("Error al obtener carrito por ID:", error);
      throw new Error("Error al obtener carrito por ID");
    }
  }

  async addProductToCart(userId, productId) {
    try {
      const user = await UsersMongoDAO.findById(userId).populate("cart").lean();
      if (!user || !user.cart) {
        throw new Error("Carrito no encontrado");
      }

      const cart = await CartsMongoDAO.findById(user.cart._id);
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      await cart.save();
      logger.info(
        `Producto ${productId} agregado al carrito del usuario ${userId}`
      );
      return cart;
    } catch (error) {
      logger.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await CartsMongoDAO.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }

      cart.products[productIndex].quantity = quantity;
      await cart.save();
      logger.info(
        `Cantidad del producto ${productId} en el carrito ${cartId} actualizada a ${quantity}`
      );
      return cart;
    } catch (error) {
      logger.error("Error al actualizar cantidad del producto:", error);
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await CartsMongoDAO.findById(cartId);
      cart.products = [];
      await cart.save();
      logger.info(`Carrito ${cartId} vaciado correctamente`);
      return cart;
    } catch (error) {
      logger.error("Error al eliminar todos los productos del carrito:", error);
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartsMongoDAO.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }

      cart.products.splice(productIndex, 1);
      await cart.save();
      logger.info(`Producto ${productId} eliminado del carrito ${cartId}`);
      return cart;
    } catch (error) {
      logger.error("Error al eliminar producto del carrito:", error);
      throw error;
    }
  }

  async purchaseCart(cartId, userEmail) {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      let totalAmount = 0;
      const productsNotPurchased = [];

      for (const item of cart.products) {
        const product = await ProductModel.findById(item.product);
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          totalAmount += product.price * item.quantity;
          await product.save();
        } else {
          productsNotPurchased.push(item.product);
        }
      }

      if (totalAmount > 0) {
        const ticket = await ticketsService.createTicket({
          amount: totalAmount,
          purchaser: userEmail,
          products: cart.products.filter(
            (item) => !productsNotPurchased.includes(item.product)
          ),
        });

        await sendPurchaseEmail(userEmail, ticket);
        logger.info(
          `Compra realizada con éxito por ${userEmail}, ticket creado`
        );
      }

      cart.products = cart.products.filter((item) =>
        productsNotPurchased.includes(item.product)
      );
      await cart.save();

      return {
        message: "Compra realizada con éxito",
        productsNotPurchased,
      };
    } catch (error) {
      logger.error("Error al procesar la compra:", error);
      throw error;
    }
  }
}

export default new CartService();
