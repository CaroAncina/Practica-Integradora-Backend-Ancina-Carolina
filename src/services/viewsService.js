import productsModel from "../dao/models/productsModel.js";
import messagesModel from "../dao/models/messagesModel.js";
import cartsModel from "../dao/models/cartsModel.js";

class ViewsService {
  async getProducts(page = 1, limit = 5, sort, category, user) {
    page = parseInt(page);
    limit = parseInt(limit);

    let query = {};
    if (category) {
      query.category = category;
    }

    let sortOption = {};
    if (sort === "asc") {
      sortOption.price = 1;
    } else if (sort === "desc") {
      sortOption.price = -1;
    }

    let options = {
      page,
      limit,
      sort: sortOption,
      lean: true,
    };

    let result = await productsModel.paginate(query, options);
    result.prevLink = result.hasPrevPage
      ? `/products?page=${result.prevPage}&limit=${limit}&sort=${
          sort || ""
        }&category=${category || ""}`
      : "";
    result.nextLink = result.hasNextPage
      ? `/products?page=${result.nextPage}&limit=${limit}&sort=${
          sort || ""
        }&category=${category || ""}`
      : "";
    result.isValid = !(page <= 0 || page > result.totalPages);
    result.user = user;

    return result;
  }

  async getProductDetails(productId) {
    return await productsModel.findById(productId).lean();
  }

  async getCartDetails(cartId) {
    return await cartsModel
      .findById(cartId)
      .populate("products.product")
      .lean();
  }

  async getMessages() {
    return await messagesModel.find().populate("user", "email").lean();
  }
}

export default new ViewsService();
