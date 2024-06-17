import { Router } from "express";
import productsModel from '../dao/models/products.model.js';
import messagesModel from "../dao/models/messages.model.js";
import cartsModel from "../dao/models/carts.model.js";
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const router = Router();

//Muestra pag. login
router.get("/", (req, res) => {
    res.redirect('/login');
});

//Muestra pag.Productos
router.get("/products", isAuthenticated, async (req, res) => {
    let { page = 1, limit = 5, sort, category } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let query = {};
    if (category) {
        query.category = category;
    }

    let sortOption = {};
    if (sort === 'asc') {
        sortOption.price = 1;
    } else if (sort === 'desc') {
        sortOption.price = -1;
    }

    let options = {
        page,
        limit,
        sort: sortOption,
        lean: true
    };

    let result = await productsModel.paginate(query, options);
    result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}&category=${category || ''}` : '';
    result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}&category=${category || ''}` : '';
    result.isValid = !(page <= 0 || page > result.totalPages);
    result.user = req.session.user;

    res.render('products', result);
});

// Muestra un producto por su id
router.get('/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productsModel.findById(productId).lean();

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.render('productDetails', { product });
    } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Muestra pag. realTimeProducts
router.get('/realTimeProducts', (req, res) => {
    res.render('realtimeProducts', {});
});

//Muestra detalle del carrito
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartsModel.findById(req.params.cid).populate('products.product').lean();
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.render('cartDetails', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

//Muestra chat
router.get('/chat', async (req, res) => {
    try {
        const messages = await messagesModel.find().lean();
        res.render('chat', { messages });
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.status(500).send('Error al obtener los mensajes');
    }
});

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});

export default router;
