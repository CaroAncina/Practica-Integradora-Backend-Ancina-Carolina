let products = [];

export default class ProductMemoryDAO {
  static findAll() {
    return products;
  }

  static findById(id) {
    return products.find((product) => product.id === id);
  }

  static create(product) {
    products.push(product);
    return product;
  }

  static update(id, updatedProduct) {
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      return products[index];
    }
    return null;
  }

  static delete(id) {
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      return products.splice(index, 1)[0];
    }
    return null;
  }
}
