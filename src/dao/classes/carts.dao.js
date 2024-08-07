import cartsModel from '../models/cartsModel.js';

class CartsMongoDAO {
    async findAll() {
        return await cartsModel.find();
    }

    async findById(id) {
        return await cartsModel.findById(id);
    }

    async create(data) {
        const newCart = new cartsModel(data);
        return await newCart.save();
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await cartsModel.findById(cartId);
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        }
        await cart.save();
        return cart;
    }

    async clearCart(cartId) {
        const cart = await cartsModel.findById(cartId);
        cart.products = [];
        await cart.save();
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await cartsModel.findById(cartId);
        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        await cart.save();
        return cart;
    }
}

export default new CartsMongoDAO();
