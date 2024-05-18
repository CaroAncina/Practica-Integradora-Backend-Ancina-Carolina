import { Router } from "express";
import productsModel from '../dao/models/products.model.js';
import messagesModel from "../dao/models/messages.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const products = await productsModel.find().lean();
        res.render("home", { products });
    } catch (error) {
        console.log(error);
    }
})
router.get('/realTimeProducts', (req, res) => {
    res.render('realtimeProducts', {});
})

router.get('/chat', async (req, res) => {
    try {
        const messages = await messagesModel.find().lean();
        res.render('chat', { messages });
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.status(500).send('Error al obtener los mensajes');
    }
});

export default router;