import express from 'express';
import { registerUser, loginUser } from '../services/authService';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { email, name, password, role } = req.body;
        const user = await registerUser(email, name, password, role);
        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
});

export default router;
