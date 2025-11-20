import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { Parser } from 'json2csv';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/csv', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        // In a real app, handle pagination or streaming for large datasets
        const records = await prisma.studentRecord.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        const fields = ['id', 'studyHours', 'attendance', 'assignmentsCompleted', 'engagementScore', 'predictedScore', 'passFail', 'riskCategory', 'createdAt'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(records);

        res.header('Content-Type', 'text/csv');
        res.attachment('predictions.csv');
        return res.send(csv);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
