import ProductService from "../services/productsService.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/EErrors.js";
import logger from "../utils/logger.js";

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
    const productId = req.params.pid;
    const product = await ProductService.getProductById(productId);

    if (!product) {
      CustomError.createError({
        name: "ProductNotFoundError",
        cause: `Producto con ID ${productId} no encontrado`,
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
  const { title, description, price, stock, category, thumbnail } = req.body;

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

    if (thumbnail) {
      productData.thumbnail = thumbnail;
    }

    const newProduct = await ProductService.createProduct(productData);
    res.status(201).json({ result: "success", payload: newProduct });
  } catch (error) {
    logger.error("Error al crear producto:", error);
    res.status(500).json({ result: "error", error: "Error al crear producto" });
  }
};

export const updateProduct = async (req, res, next) => {
  const { pid } = req.params;
  const { title, description, price, code, stock, category, thumbnail } =
    req.body;
  try {
    const updatedProduct = await ProductService.updateProduct(pid, {
      title,
      description,
      price,
      code,
      stock,
      category,
      thumbnail,
    });
    if (!updatedProduct) {
      CustomError.createError({
        name: "ProductNotFoundError",
        cause: `Producto con ID ${pid} no encontrado`,
        message: "Producto no encontrado",
        code: EErrors.ROUTING_ERROR,
      });
    }
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
    const deletedProduct = await ProductService.deleteProduct(pid);
    if (!deletedProduct) {
      CustomError.createError({
        name: "ProductNotFoundError",
        cause: `Producto con ID ${pid} no encontrado`,
        message: "Producto no encontrado",
        code: EErrors.ROUTING_ERROR,
      });
    }
    res.status(200).json({ result: "success", payload: deletedProduct });
  } catch (error) {
    logger.error("Error al eliminar producto:", error);
    res
      .status(500)
      .json({ result: "error", error: "Error al eliminar producto" });
  }
};
