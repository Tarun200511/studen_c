import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

interface PredictionInput {
    study_hours: number;
    attendance: number;
    assignments_completed: number;
    past_marks: number[];
    engagement_score: number;
}

interface PredictionOutput {
    predicted_score: number;
    pass_fail: string;
    risk_category: string;
    confidence: number;
    model_version: string;
}

export const getPrediction = async (input: PredictionInput): Promise<PredictionOutput> => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/infer`, input);
        return response.data;
    } catch (error) {
        console.error('Error calling ML service:', error);
        throw new Error('Failed to get prediction from ML service');
    }
};

export const triggerTraining = async () => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/train`);
        return response.data;
    } catch (error) {
        console.error('Error triggering training:', error);
        throw new Error('Failed to trigger training');
    }
};
