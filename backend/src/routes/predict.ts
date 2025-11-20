import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getPrediction } from '../services/mlService';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authenticateToken, async (req: any, res) => {
    try {
        const { studyHours, attendance, assignmentsCompleted, pastMarks, engagementScore } = req.body;
        const userId = req.user.id;

        // Call ML Service
        const prediction = await getPrediction({
            study_hours: studyHours,
            attendance,
            assignments_completed: assignmentsCompleted,
            past_marks: pastMarks,
            engagement_score: engagementScore,
        });

        // Save to database
        const record = await prisma.studentRecord.create({
            data: {
                userId,
                studyHours,
                attendance,
                assignmentsCompleted,
                pastMarks: JSON.stringify(pastMarks),
                engagementScore,
                predictedScore: prediction.predicted_score,
                riskLevel: prediction.risk_level,
            },
        });

        res.json({ ...prediction, id: record.id });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const predictions = await prisma.studentRecord.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(predictions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
