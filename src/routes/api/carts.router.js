import { Router } from "express";
import cartsModel from '../../dao/models/carts.model.js';

const router = Router();

// Obtiene todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cartsModel.find().populate('products.product').lean();
        res.status(200).json({ result: "success", payload: carts });
    } catch (error) {
        console.error("Error al obtener carritos:", error);
        res.status(500).json({ result: "error", error: "Error al obtener carritos" });
    }
});

// Obtener un carrito específico por su ID
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartsModel.findById(cartId).lean();

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crea un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartsModel.create({});
        res.status(201).json({ result: "success", payload: newCart });
    } catch (error) {
        console.error("Error al crear carrito:", error);
        res.status(500).json({ result: "error", error: "Error al crear carrito" });
    }
});

// Agrega un producto existente a un carrito del usuario logueado
router.post('/add-to-cart/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const user = req.user;

        if (!user || !user.cart) {
            return res.status(400).json({ error: 'Usuario no logueado o carrito no encontrado' });
        }

        const cart = await cartsModel.findById(user.cart._id);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();

        return res.status(200).json({ message: 'Producto agregado al carrito con éxito', cart });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        return res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

// Actualiza un carrito especifico con un array de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const updatedCart = await cartsModel.findByIdAndUpdate(cid, { products }, { new: true }).populate('products.product').lean();
        res.status(200).json({ result: "success", payload: updatedCart });
    } catch (error) {
        console.error("Error al actualizar carrito:", error);
        res.status(500).json({ result: "error", error: "Error al actualizar carrito" });
    }
});

// Actualiza la cantidad de un producto especifico de un carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await cartsModel.findById(cid).lean();
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid).lean();
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
        } else {
            cart.products.push({ product: pid, quantity });
            await cart.save();
        }
        const updatedCart = await cart.populate('products.product').lean();
        res.status(200).json({ result: "success", payload: updatedCart });
    } catch (error) {
        console.error("Error al actualizar cantidad del producto:", error);
        res.status(500).json({ result: "error", error: "Error al actualizar cantidad del producto" });
    }
});

// Elimina los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartsModel.findById(cid);
        cart.products = [];
        await cart.save();
        res.status(200).json({ result: "success", payload: cart });
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito:", error);
        res.status(500).json({ result: "error", error: "Error al eliminar todos los productos del carrito" });
    }
});

// Elimina un producto especifico de un carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartsModel.findById(cid);
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        const updatedCart = await cart.populate('products.product');
        res.status(200).json({ result: "success", payload: updatedCart });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ result: "error", error: "Error al eliminar producto del carrito" });
    }
});


export default router;
