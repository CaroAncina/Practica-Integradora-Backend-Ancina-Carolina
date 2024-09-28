import ProductService from "../services/productsService.js";
import UsersMongoDAO from "../dao/models/usersModel.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/EErrors.js";
import logger from "../utils/logger.js";
import { sendNotificationEmail } from "../utils/mailer.js";

export const getAllProducts = async (req, res) => {
  try {
    let query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    let sort = {};
    if (req.query.sort === "asc") {
      sort.price = 1;
    } else if (req.query.sort === "desc") {
      sort.price = -1;
    }

    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const options = {
      limit,
      page,
      sort,
      lean: true,
    };

    const products = await ProductService.getAllProducts(query, options);

    const result = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? products.prevPage : null,
      nextPage: products.hasNextPage ? products.nextPage : null,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/products?limit=${limit}&page=${products.prevPage}&sort=${
            req.query.sort || ""
          }&category=${req.query.category || ""}`
        : null,
      nextLink: products.hasNextPage
        ? `/products?limit=${limit}&page=${products.nextPage}&sort=${
            req.query.sort || ""
          }&category=${req.query.category || ""}`
        : null,
      isValid: !(page <= 0 || page > products.totalPages),
    };

    res.status(200).json({ result: "success", products });
  } catch (error) {
    logger.log(error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductService.getProductById(pid);
    if (!product) {
      CustomError.createError({
        name: "ProductNotFoundError",
        cause: `Producto con ID ${product} no encontrado`,
        message: "Producto no encontrado",
        code: EErrors.ROUTING_ERROR,
      });
    }
    res.status(200).json({ result: "success", product });
  } catch (error) {
    logger.error("Error al obtener los detalles del producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createProduct = async (req, res) => {
  const { title, description, price, stock, category } = req.body;

  if (!title || !description || !price || !stock || !category) {
    return res
      .status(400)
      .json({ status: "error", message: "Faltan datos del producto" });
  }

  try {
    let owner = "admin";
    if (req.user && req.user.role === "premium") {
      owner = req.user.email;
    }

    const generateCode = () => {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const randomNum = Math.floor(Math.random() * 1000);
      return `PRD-${year}${month}${day}-${randomNum}`;
    };

    const productData = {
      title,
      description,
      price,
      stock,
      category,
      owner,
      code: generateCode(),
    };

    if (req.file) {
      productData.thumbnail = `/uploads/products/${req.file.filename}`;
    }

    const newProduct = await ProductService.createProduct(productData);
    res.status(201).json({ result: "success", payload: newProduct });
  } catch (error) {
    logger.error("Error al crear producto:", error);
    res.status(500).json({ result: "error", error: "Error al crear producto" });
  }
};

export const updateProduct = async (req, res) => {
  const { pid } = req.params;
  const { title, description, price, stock, category } = req.body;

  try {
    const product = await ProductService.getProductById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ result: "error", message: "Producto no encontrado" });
    }

    if (req.user.role !== "admin" && req.user.email !== product.owner) {
      return res.status(403).json({
        result: "error",
        message: "No tienes permiso para actualizar este producto",
      });
    }

    const updateData = { title, description, price, stock, category };
    if (req.file) {
      updateData.thumbnail = `/uploads/products/${req.file.filename}`;
    }

    const updatedProduct = await ProductService.updateProduct(pid, updateData);
    res.status(200).json({ result: "success", payload: updatedProduct });
  } catch (error) {
    logger.error("Error al actualizar producto:", error);
    res
      .status(500)
      .json({ result: "error", error: "Error al actualizar producto" });
  }
};

export const deleteProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await ProductService.getProductById(pid);

    if (!product) {
      return res
        .status(404)
        .json({ result: "error", message: "Producto no encontrado" });
    }

    const ownerEmail = product.owner;
    let owner;

    if (ownerEmail === "admin") {
      owner = { role: "admin", email: "admin" };
    } else {
      owner = await UsersMongoDAO.findOne({ email: ownerEmail });

      if (!owner) {
        return res.status(404).json({
          result: "error",
          message: "Propietario del producto no encontrado",
        });
      }
    }

    if (owner.role === "premium") {
      await sendNotificationEmail(owner.email, product.title);
    }

    if (req.user.role === "admin" || req.user.email === product.owner) {
      await ProductService.deleteProduct(pid);
      return res.status(200).json({
        result: "success",
        message: `Producto ${product.title} eliminado correctamente`,
      });
    }

    return res.status(403).json({
      result: "error",
      message: "No tienes permiso para eliminar este producto",
    });
  } catch (error) {
    logger.error("Error al eliminar producto:", error);
    res
      .status(500)
      .json({ result: "error", error: "Error al eliminar producto" });
  }
};

export const uploadImageProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductService.getProductById(pid);

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }

    if (req.user.role !== "admin" && req.user.email !== product.owner) {
      return res.status(403).json({
        result: "error",
        message: "No tienes permiso para actualizar este producto",
      });
    }

    const updatedProduct = await ProductService.updateProductImage(
      pid,
      req.file.path
    );

    res.status(200).json({
      status: "success",
      message: "Imagen del producto actualizada",
      productImage: updatedProduct.thumbnail,
    });
  } catch (error) {
    logger.error("Error al actualizar la imagen del producto:", error);
    res.status(500).json({
      status: "error",
      message: "Error al actualizar imagen del producto",
    });
  }
};
