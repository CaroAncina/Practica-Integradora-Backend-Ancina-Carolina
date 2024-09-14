import { userDto } from "../dao/DTOs/users.dto.js";
import logger from "../utils/logger.js";
import User from "../dao/models/usersModel.js";
import { sendResetPasswordEmail } from "../utils/mailer.js";

class SessionsController {
  async register(req, res) {
    res.redirect("/login");
  }

  async failRegister(req, res) {
    res.status(400).send({ error: "Falló el registro" });
  }

  async login(req, res) {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", error: "Datos incompletos" });

    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      role: req.user.role,
    };

    try {
      req.user.last_connection = new Date();
      await req.user.save();

      req.session.save((err) => {
        if (err) {
          logger.error("Error guardando sesión:", err);
          return res.status(500).send("Error al guardar la sesión");
        }
        res.redirect("/products");
      });
    } catch (error) {
      logger.error("Error al actualizar last_connection:", error);
      res.status(500).send("Error al iniciar sesión");
    }
  }

  async failLogin(req, res) {
    res.status(400).send({ error: "Login fallido" });
  }

  async logout(req, res) {
    try {
      const user = await User.findById(req.session.user._id);
      if (user) {
        user.last_connection = new Date();
        await user.save();
      }

      req.session.destroy((err) => {
        if (err) return res.status(500).send("Error al cerrar sesión");
        res.redirect("/login");
      });
    } catch (error) {
      logger.error(
        "Error al actualizar last_connection durante logout:",
        error
      );
      res.status(500).send("Error al cerrar sesión");
    }
  }

  async github(req, res) {
    // Redirige a GitHub para autenticación
  }

  async githubCallback(req, res) {
    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      role: req.user.role,
    };

    try {
      req.user.last_connection = new Date();
      await req.user.save();

      res.redirect("/products");
    } catch (error) {
      logger.error("Error al actualizar last_connection con GitHub:", error);
      res.status(500).send("Error al iniciar sesión con GitHub");
    }
  }

  async current(req, res) {
    if (req.session.user) {
      const user = userDto(req.session.user);
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: "Usuario no autenticado" });
    }
  }

  async resetPassword(req, res) {
    const { email, resetUrl } = req.body;

    if (!email || !resetUrl) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos: email o URL de restablecimiento",
      });
    }

    try {
      await sendResetPasswordEmail(email, resetUrl);
      res.status(200).json({
        status: "success",
        message: "Correo de restablecimiento enviado",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "No se pudo enviar el correo de restablecimiento",
        error: error.message,
      });
    }
  }
}

export default new SessionsController();
