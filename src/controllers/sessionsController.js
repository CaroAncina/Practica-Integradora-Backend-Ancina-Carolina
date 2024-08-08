import { userDto } from "../dao/DTOs/users.dto.js";
import logger from "../utils/logger.js";

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

    req.session.save((err) => {
      if (err) {
        logger.error("Error guardando sesión:", err);
        return res.status(500).send("Error al guardar la sesión");
      }
      res.redirect("/products");
    });
  }

  async failLogin(req, res) {
    res.status(400).send({ error: "Login fallido" });
  }

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) return res.status(500).send("Error al cerrar sesión");
      res.redirect("/login");
    });
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
    res.redirect("/products");
  }

  async current(req, res) {
    if (req.session.user) {
      const user = userDto(req.session.user);
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: "Usuario no autenticado" });
    }
  }
}

export default new SessionsController();
