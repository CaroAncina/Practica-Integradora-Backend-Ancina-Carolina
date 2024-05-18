const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path'); 

const productsFilePath = path.resolve(__dirname, '../Productos.json');

class CartManager {
    constructor(path) {
        this.path = path;
        this.firstId = 1;
    }

    async newId() {
        const carts = await this.getCarts();
        const maxId = carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
        return maxId + 1;
    }

    async createNewCart() {
        const newCartId = await this.newId();
        const newCart = {
            id: newCartId,
            products: []
        };
        await this.saveCart(newCart);
        return newCart;
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === id);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw error;
        }
    }

    async saveCart(cart) {
        try {
            let carts = await this.getCarts();
            const index = carts.findIndex(c => c.id === cart.id);
            if (index !== -1) {
                carts[index] = cart;
            } else {
                carts.push(cart);
            }
            await this.saveCarts(carts);
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
            throw error;
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            console.error('Error al leer el archivo de carritos:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const data = await fs.readFile(productsFilePath, 'utf-8');
            const products = JSON.parse(data);
            const product = products.find(product => product.id === id);

            if (product) {
                return { ...product, title: product.title };
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error);
            throw error;
        }
    }

    async saveCarts(carts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.error('Error al guardar el archivo de carritos:', error);
            throw error;
        }
    }
}

module.exports = CartManager;