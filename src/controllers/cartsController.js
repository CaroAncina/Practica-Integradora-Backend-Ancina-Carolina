import CartService from "../services/cartsService.js";
import ProductModel from "../dao/models/productsModel.js";
import ticketsService from "../services/ticketsService.js";
import { sendPurchaseEmail } from "../utils/mailer.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/EErrors.js";
import logger from "../utils/logger.js";

export const getCarts = async (req, res) => {
  try {
    const carts = await CartService.getCarts();
    res.status(200).json({ result: "success", payload: carts });
  } catch (error) {
    logger.error("Error al obtener carritos:", error);
    res
      .status(500)
      .json({ result: "error", error: "Error al obtener carritos" });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { user } = req;

    if (!user || !user._id) {
      return res.status(400).json({ error: "Usuario no autenticado o sin ID" });
    }

    const cart = await CartService.getCartById(user._id);

    if (!cart) {
      CustomError.createError({
        name: "CartNotFoundError",
        cause: `Carrito con ID ${user._id} no encontrado`,
        message: "Carrito no encontrado",
        code: EErrors.ROUTING_ERROR,
      });
    }

    return res.status(200).json(cart);
  } catch (error) {
    logger.error("Error al obtener el carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { pid } = req.params;
    const { user } = req;

    if (!user) {
      CustomError.createError({
        name: "UserNotAuthenticatedError",
        cause: "Usuario no autenticado",
        message: "Usuario no autenticado",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const product = await ProductModel.findById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (user.role === "premium" && product.owner === user.email) {
      return res
        .status(403)
        .json({ error: "No puedes agregar tu propio producto al carrito" });
    }

    const cart = await CartService.addProductToCart(user._id, pid);

    return res
      .status(200)
      .json({ message: "Producto agregado al carrito con éxito", cart });
  } catch (error) {
    logger.error("Error al agregar el producto al carrito:", error);
    return res
      .status(500)
      .json({ error: "Error al agregar el producto al carrito" });
  }
};

export const updateProductQuantity = async (req, res) => {
  const { pid } = req.params;
  const { user } = req;
  const { quantity } = req.body;
  try {
    const updatedCart = await CartService.updateProductQuantity(
      user._id,
      pid,
      quantity
    );
    res.status(200).json({ result: "success", payload: updatedCart });
  } catch (error) {
    logger.error("Error al actualizar cantidad del producto:", error);
    res.status(500).json({
      result: "error",
      error: "Error al actualizar cantidad del producto",
    });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { pid } = req.params;
    const { user } = req;
    const updatedCart = await CartService.removeProductFromCart(user._id, pid);
    res.status(200).json({
      status: "success",
      message: "Producto eliminado del carrito",
      cart: updatedCart,
    });
  } catch (error) {
    logger.error("Error al eliminar producto del carrito:", error);
    res.status(400).json({
      status: "error",
      message: "Error al eliminar producto del carrito",
      error: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  const { user } = req;
  try {
    const cart = await CartService.clearCart(user._id);
    res.status(200).json({ result: "success", payload: cart });
  } catch (error) {
    logger.error("Error al eliminar todos los productos del carrito:", error);
    res.status(500).json({
      result: "error",
      error: "Error al eliminar todos los productos del carrito",
    });
  }
};

export const purchaseCart = async (req, res) => {
  const { user } = req;
  try {
    const cart = await CartService.getCartById(user._id);
    if (!cart) {
      CustomError.createError({
        name: "CartNotFoundError",
        cause: `Carrito con ID ${user._id} no encontrado`,
        message: "Carrito no encontrado",
        code: EErrors.ROUTING_ERROR,
      });
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
        purchaser: req.session.user.email,
        products: cart.products.filter(
          (item) => !productsNotPurchased.includes(item.product)
        ),
      });

      await sendPurchaseEmail(user.email, ticket);
    }

    cart.products = cart.products.filter((item) =>
      productsNotPurchased.includes(item.product)
    );

    await cart.save();

    res.status(200).json({
      message: "Compra realizada con éxito",
      productsNotPurchased,
    });
  } catch (error) {
    logger.error("Error al procesar la compra:", error);
    res.status(500).json({ error: "Error al procesar la compra" });
  }
};
