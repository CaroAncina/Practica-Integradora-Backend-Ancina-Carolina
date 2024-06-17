import { Router } from 'express';
import Message from '../../dao/models/messages.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().populate('user', 'first_name last_name').lean();
        res.send({ result: "success", payload: messages });
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.status(500).send('Error al obtener los mensajes');
    }
});

router.post('/', async (req, res) => {
    const { user, message } = req.body;
    if (!user || !message) {
        return res.status(400).send({ status: "error", error: "Faltan parámetros" });
    }
    try {
        const newMessage = new Message({ user, message });
        const savedMessage = await newMessage.save();
        res.send({ result: "success", payload: savedMessage });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).send('Error al guardar el mensaje');
    }
});

export default router;
