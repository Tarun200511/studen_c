import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                photoUrl: true,
                studentId: true,
                department: true,
                cgpa: true,
                bio: true,
                phone: true,
                createdAt: true
            }
        });
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { name, photoUrl, studentId, department, bio, phone } = req.body;

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                photoUrl,
                studentId,
                department,
                bio,
                phone
            }
        });

        res.json({ message: 'Profile updated successfully', user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get user courses
router.get('/courses', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const courses = await prisma.course.findMany({
            where: { userId },
            orderBy: { semester: 'desc' }
        });
        res.json(courses);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Add course
router.post('/courses', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { courseName, courseCode, credits, grade, semester } = req.body;

        const course = await prisma.course.create({
            data: {
                userId,
                courseName,
                courseCode,
                credits,
                grade,
                semester
            }
        });

        // Recalculate CGPA
        const courses = await prisma.course.findMany({ where: { userId } });
        const cgpa = calculateCGPA(courses);

        await prisma.user.update({
            where: { id: userId },
            data: { cgpa }
        });

        res.json({ course, cgpa });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Delete course
router.delete('/courses/:id', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.id;
        const courseId = req.params.id;

        await prisma.course.delete({
            where: { id: courseId, userId }
        });

        // Recalculate CGPA
        const courses = await prisma.course.findMany({ where: { userId } });
        const cgpa = calculateCGPA(courses);

        await prisma.user.update({
            where: { id: userId },
            data: { cgpa }
        });

        res.json({ message: 'Course deleted', cgpa });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Helper function to calculate CGPA
function calculateCGPA(courses: any[]) {
    if (courses.length === 0) return 0;

    const gradePoints: any = {
        'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
    };

    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        const points = gradePoints[course.grade] || 0;
        totalPoints += points * course.credits;
        totalCredits += course.credits;
    });

    return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
}

export default router;
