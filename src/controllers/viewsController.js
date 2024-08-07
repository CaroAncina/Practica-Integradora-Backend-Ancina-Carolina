import viewsService from "../services/viewsService.js";
import logger from "../utils/logger.js";

class ViewsController {
  redirectToLogin(req, res) {
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

  getRealTimeProducts(req, res) {
    if (req.session.user && req.session.user.role === "admin") {
      res.render("realTimeProducts", { user: req.session.user });
    } else {
      res.status(403).send("Acceso denegado");
    }
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

  getLoginPage(req, res) {
    res.render("login");
  }

  getRegisterPage(req, res) {
    res.render("register");
  }

  getProfilePage(req, res) {
    res.render("profile", { user: req.session.user });
  }
}

export default new ViewsController();
