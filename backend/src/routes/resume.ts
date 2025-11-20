import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get user resumes
router.get('/', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const resumes = await prisma.resume.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(resumes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Create resume
router.post('/', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { title, content, template } = req.body;

        const resume = await prisma.resume.create({
            data: {
                userId,
                title,
                content: JSON.stringify(content),
                template: template || 'modern'
            }
        });

        res.json(resume);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Update resume
router.put('/:id', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const resumeId = req.params.id;
        const { title, content, template } = req.body;

        const resume = await prisma.resume.update({
            where: { id: resumeId, userId },
            data: {
                title,
                content: JSON.stringify(content),
                template
            }
        });

        res.json(resume);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Delete resume
router.delete('/:id', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const resumeId = req.params.id;

        await prisma.resume.delete({
            where: { id: resumeId, userId }
        });

        res.json({ message: 'Resume deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
