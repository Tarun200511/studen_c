import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    // Create Teacher
    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@example.com' },
        update: {},
        create: {
            email: 'teacher@example.com',
            name: 'Teacher User',
            password: hashedPassword,
            role: 'TEACHER',
        },
    });

    // Create Student
    const student = await prisma.user.upsert({
        where: { email: 'student@example.com' },
        update: {},
        create: {
            email: 'student@example.com',
            name: 'Student User',
            password: hashedPassword,
            role: 'STUDENT',
        },
    });

    console.log({ admin, teacher, student });

    // Create Dummy Student Records
    await prisma.studentRecord.create({
        data: {
            userId: student.id,
            studyHours: 5.5,
            attendance: 85,
            assignmentsCompleted: 10,
            pastMarks: JSON.stringify([70, 75, 80]),
            engagementScore: 78,
            predictedScore: 82,
            riskLevel: 'Low',
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
