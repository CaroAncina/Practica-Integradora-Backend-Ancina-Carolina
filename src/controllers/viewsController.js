import viewsService from "../services/viewsService.js";
import userService from '../services/usersService.js';
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendResetPasswordEmail } from "../utils/mailer.js";

class ViewsController {
  async redirectToLogin(req, res) {
    res.redirect("/login");
  }

  async getProductsPage(req, res) {
    try {
      const { page, limit, sort, category } = req.query;
      const productsData = await viewsService.getProducts(
        page,
        limit,
        sort,
        category,
        req.session.user
      );
      res.render("products", productsData);
    } catch (error) {
      logger.error("Error al obtener los productos:", error);
      res.status(500).send("Error al obtener los productos");
    }
  }

  async getProductDetails(req, res) {
    try {
      const productId = req.params.pid;
      const product = await viewsService.getProductDetails(productId);
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.render("productDetails", { product });
    } catch (error) {
      logger.error("Error al obtener los detalles del producto:", error);
      res.status(500).send("Error al obtener los detalles del producto");
    }
  }

  async getRealTimeProducts(req, res) {
    res.render("realTimeProducts", {
      user: req.session.user,
    });
  }

  async getCartDetails(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await viewsService.getCartDetails(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.render("cartDetails", { cart });
    } catch (error) {
      logger.error("Error al obtener el carrito:", error);
      res.status(500).send("Error al obtener el carrito");
    }
  }

  async getChatPage(req, res) {
    try {
      const messages = await viewsService.getMessages();
      res.render("chat", {
        userId: req.session.user._id,
        messages,
      });
    } catch (error) {
      logger.error("Error al obtener los mensajes:", error);
      res.status(500).send("Error al obtener los mensajes");
    }
  }

  async currentPage(req, res) {
    res.render("/current");
  }

  async getLoginPage(req, res) {
    res.render("login");
  }

  async getRegisterPage(req, res) {
    res.render("register");
  }

  async getProfilePage(req, res) {
    res.render("profile", { user: req.session.user });
  }
  async getAdminUsersPage(req, res) {
    try {
      const users = await userService.getBasicUserData();
      res.render("adminUsers", { user: req.session.user, users });
    } catch (error) {
      logger.error("Error al obtener los usuarios:", error);
      res.status(500).send("Error al obtener los usuarios");
    }
  }

  async getForgotPasswordPage(req, res) {
    res.render("forgotPassword");
  }

  async handleForgotPassword(req, res) {
    const { email } = req.body;
    const user = await userService.findOne({ email });

    if (!user) {
      logger.error("Error al buscar el usuario:", error);
      return res.status(400).send("Usuario no encontrado");
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetUrl = `http://${req.headers.host}/reset-password/${token}`;
    await sendResetPasswordEmail(email, resetUrl);

    logger.info("Correo de restablecimiento de contraseña enviado");
    res.status(200).send("Correo de restablecimiento de contraseña enviado");
  }

  async getResetPasswordPage(req, res) {
    const { token } = req.params;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.render("resetPassword", { token });
    } catch (error) {
      logger.error("Token inválido o ha expirado:", error);
      res.status(400).send("Token inválido o ha expirado");
    }
  }

  async handleResetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userService.findById(decoded.id);

      if (!user) {
        logger.error("Error al buscar el usuario:", error);
        return res.status(400).send("Usuario no encontrado");
      }

      user.password = bcrypt.hashSync(password, 10);
      await user.save();
      req.session.resetToken = null;

      logger.info("Contraseña actualizada exitosamente");
      res.status(200).send("Contraseña actualizada exitosamente");
    } catch (error) {
      logger.error("Token inválido o ha expirado:", error);
      res.status(400).send("Token inválido o ha expirado");
    }
  }
}

export default new ViewsController();
