import { Router } from 'express';
import { generateMockProducts } from '../../utils/utils.js';

const router = Router();

router.post('/', (req, res) => {
    const products = generateMockProducts();
    res.json({ status: 'success', payload: products });
});

router.get('/', (req, res) => {
    const products = generateMockProducts();
    res.json({ status: 'success', payload: products });
});


export default router;

