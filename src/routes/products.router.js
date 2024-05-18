import { Router } from "express";
import productsModel from '../dao/models/products.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productsModel.find().lean();
        res.status(200).json({ result: "success", payload: products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ result: "error", error: "Error al obtener productos" });
    }
});

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
