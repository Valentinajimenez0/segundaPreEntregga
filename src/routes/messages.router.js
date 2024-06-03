import { Router } from "express";
import messageModel from "../models/messages.model.js";
import userModel from "../models/user.model.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const messages = await messageModel.find().lean();
        res.render('messages', {messages: messages});
    } catch (error) {
        console.error('Error al cargar los mensajes:', error);
        res.status(500).render('error', { message: 'Error al cargar' });
    }
});

router.post('/', async (req, res) => {
    const { user_name, email, message } = req.body;

    if (!user_name || !email || !message) {
        return res.status(400).send('Faltan parámetros');
    }

    try {
        let user = await userModel.findOne({ email });
        if (!user) {
            user = new userModel({ user_name, email });
            await user.save();
        }

        const newMessage = new messageModel({ user: email, message });
        await newMessage.save();

        res.redirect('/api/messages');
    } catch (error) {
        console.error('Error al crear el mensaje:', error);
        res.status(500).send('Error al crear el mensaje');
    }
});

router.get('/:chid', async (req, res) => {
    try {
        const { chid } = req.params;
        await messageModel.findByIdAndDelete(chid);

        res.redirect('/api/messages');
    } catch (error) {
        console.error('Error al eliminar el mensaje:', error);
        res.status(500).render('error', { message: 'Error al eliminar el mensaje.' });
    }
});

export default router;
