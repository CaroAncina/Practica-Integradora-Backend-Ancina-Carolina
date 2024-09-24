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

  async getCartById(userId) {
    try {
      const user = await UsersMongoDAO.findById(userId).populate("cart");
      if (!user || !user.cart) {
        logger.info(`Usuario con ID ${userId} no tiene un carrito asociado`);
        return null;
      }
      return user.cart;
    } catch (error) {
      logger.error("Error al obtener el carrito del usuario:", error);
      throw new Error("Error al obtener el carrito");
    }
  }

  async addProductToCart(userId, productId) {
    try {
      const user = await UsersMongoDAO.findById(userId).populate("cart");
      if (!user || !user.cart) {
        throw new Error("Carrito no encontrado");
      }

      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
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
        `Producto ${product.title} agregado al carrito del usuario ${user.email}`
      );
      return cart;
    } catch (error) {
      logger.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  }

  async updateProductQuantity(userId, productId, quantity) {
    try {
      const user = await UsersMongoDAO.findById(userId).populate("cart");
      if (!user || !user.cart) {
        throw new Error("Carrito no encontrado");
      }

      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      const cart = await CartsMongoDAO.findById(user.cart._id).populate(
        "products.product"
      );
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product._id.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }

      cart.products[productIndex].quantity = quantity;
      await cart.save();

      const productTitle = cart.products[productIndex].product.title;
      logger.info(
        `Cantidad del producto ${productTitle} actualizada a ${quantity}`
      );

      return cart;
    } catch (error) {
      logger.error("Error al actualizar cantidad del producto:", error);
      throw error;
    }
  }

  async removeProductFromCart(userId, productId) {
    try {
      const user = await UsersMongoDAO.findById(userId).populate("cart");
      if (!user || !user.cart) {
        throw new Error("Carrito no encontrado");
      }
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      const cart = await CartsMongoDAO.findById(user.cart._id);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const productsIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (cart.products[productsIndex].quantity > 1) {
        cart.products[productsIndex].quantity -= 1;
      } else {
        cart.products.splice(productsIndex, 1);
      }

      await cart.save();
      logger.info(`Producto ${product.title} eliminado del carrito`);
      return cart;
    } catch (error) {
      logger.error("Error al eliminar el producto del carrito:", error);
      throw error;
    }
  }

  async clearCart(userId) {
    try {
      const user = await UsersMongoDAO.findById(userId).populate("cart");
      if (!user || !user.cart) {
        throw new Error("Carrito no encontrado");
      }
      const cart = await CartsMongoDAO.findById(user.cart._id);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = [];
      await cart.save();
      logger.info(`Carrito vaciado correctamente`);
      return cart;
    } catch (error) {
      logger.error("Error al eliminar todos los productos del carrito:", error);
      throw error;
    }
  }

  async purchaseCart(cartId, userEmail) {
    try {
      const cart = await this.getCartById(cartId).populate("products.product");
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
