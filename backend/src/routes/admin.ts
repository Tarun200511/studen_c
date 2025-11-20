import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { triggerTraining } from '../services/mlService';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to ensure only admins can access these routes
router.use(authenticateToken, authorizeRole(['ADMIN']));

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Trigger Model Training
router.post('/model/train', async (req, res) => {
    try {
        const result = await triggerTraining();
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get Model Artifacts
router.get('/model/artifacts', async (req, res) => {
    try {
        const artifacts = await prisma.modelArtifact.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(artifacts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
