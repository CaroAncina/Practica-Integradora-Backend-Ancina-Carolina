const fs = require('fs').promises;

class ProductManager {
    static lastId = 0;

    constructor(path) {
        this.path = path;
    }

    async addProduct(newObject) {
        try {
            console.log('Datos recibidos en addProduct:', newObject);

            const { title, description, price, thumbnail, code, stock, category } = newObject;

            if (!title || !description || !price || !code || !stock || !category) {
                throw new Error('Todos los campos son obligatorios');
            }

            const products = await this.getProducts();
            const lastId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

            const newProduct = {
                id: lastId,
                title,
                description,
                price,
                thumbnail: thumbnail || '',
                code,
                stock,
                status: true,
                category
            };

            products.push(newProduct);
            await this.saveProducts(products);

            return newProduct;
        } catch (error) {
            console.error('Error al agregar un nuevo producto:', error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const res = await fs.readFile(this.path, 'utf-8');
            const arrayDeProductos = JSON.parse(res);
            return arrayDeProductos;
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            throw error;
        }
    }

    async getProductsbyId(id) {
        try {
            const arrayProducts = await this.getProducts();
            const idProduct = arrayProducts.find(item => item.id === id);

            if (!idProduct) {
                throw new Error('No se encuentra el producto');
            }

            return idProduct;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const arrayProducts = await this.getProducts();

            const index = arrayProducts.findIndex(item => item.id === id);
            if (index !== -1) {
                arrayProducts[index] = { ...arrayProducts[index], ...updatedFields };
                await this.saveProducts(arrayProducts);
            } else {
                throw new Error('No se encuentra el producto a actualizar');
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProducts = await this.getProducts();
            const updatedProducts = arrayProducts.filter(item => item.id !== id);

            // Reasigna los IDs para mantener la secuencia
            updatedProducts.forEach((product, index) => {
                product.id = index + 1;
            });

            await this.saveProducts(updatedProducts);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }

    async saveProducts(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
        } catch (error) {
            console.error('Error al guardar el archivo:', error);
            throw error;
        }
    }
}

module.exports = ProductManager;