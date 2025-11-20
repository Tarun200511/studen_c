import express from 'express';
import authRoutes from './routes/auth';
import predictRoutes from './routes/predict';
import adminRoutes from './routes/admin';
import profileRoutes from './routes/profile';
import resumeRoutes from './routes/resume';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import exportRoutes from './routes/export';
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume', resumeRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
