import { Router } from "express";
import productsModel from '../../dao/models/products.model.js';

const router = Router();

//Muestra los productos 
router.get("/", async (req, res) => {
    try {
        let query = {};

        // Filtro por categoría
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Ordenar por precio
        let sort = {};
        if (req.query.sort === 'asc') {
            sort.price = 1;
        } else if (req.query.sort === 'desc') {
            sort.price = -1;
        }

        //limite 
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;

        const options = {
            limit,
            page,
            sort,
            lean: true
        };

        const products = await productsModel.paginate(query, options);

        const result = {
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.prevPage : null,
            nextPage: products.hasNextPage ? products.nextPage : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}&sort=${req.query.sort || ''}&category=${req.query.category || ''}` : null,
            nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}&sort=${req.query.sort || ''}&category=${req.query.category || ''}` : null,
            isValid: !(page <= 0 || page > products.totalPages)
        };

        res.status(200).json({ result: "success", products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error interno" });
    }
});

// Muestra un producto por su id
router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productsModel.findById(productId).lean();

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ result: "success", product });
    } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Agrega un producto a la lista de productos
router.post('/', async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).json({ result: "error", error: "Faltan parámetros obligatorios" });
    }
    try {
        const newProduct = await productsModel.create({ title, description, price, code, stock, category });
        res.status(201).json({ result: "success", payload: newProduct });
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ result: "error", error: "Error al crear producto" });
    }
});

//Actualiza un producto
router.put('/:uid', async (req, res) => {
    const { uid } = req.params;
    const updatedProduct = req.body;
    try {
        const result = await productsModel.updateOne({ _id: uid }, updatedProduct);
        res.status(200).json({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ result: "error", error: "Error al actualizar producto" });
    }
});

//Elimina un producto
router.delete('/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const result = await productsModel.deleteOne({ _id: uid });
        res.status(200).json({ result: "success", payload: result });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ result: "error", error: "Error al eliminar producto" });
    }
});

export default router;
