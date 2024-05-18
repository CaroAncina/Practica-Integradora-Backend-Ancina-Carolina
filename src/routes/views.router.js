import { Router } from "express";
import productsModel from '../dao/models/products.model.js';

const router = Router();

router.get("/", async (req, res) => {
    try {
        const products = await productsModel.find().lean();
        res.render("home", {products});
    } catch (error) {
        console.log(error);
    }
})
router.get('/realTimeProducts', (req, res) => {
    res.render('realtimeProducts', {});
})

router.get('/chat', (req, res) => {
    res.render('chat');
});

export default router;