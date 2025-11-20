from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os
from typing import List, Optional

app = FastAPI(title="Student Performance ML Service", version="1.0.0")

# Load model artifacts (placeholder for now)
MODEL_PATH = os.getenv("MODEL_PATH", "../model")
model = None

class PredictionInput(BaseModel):
    study_hours: float
    attendance: float
    assignments_completed: int
    past_marks: List[float]
    engagement_score: float

class PredictionOutput(BaseModel):
    predicted_score: float
    pass_fail: str
    risk_level: str
    confidence: float
    model_version: str

@app.on_event("startup")
def load_model():
    global model
    # Logic to load model from MODEL_PATH
    # try:
    #     model = joblib.load(os.path.join(MODEL_PATH, "model.joblib"))
    # except:
    #     print("No model found, please train first.")
    pass

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ml-service"}

@app.post("/infer", response_model=PredictionOutput)
def infer(input_data: PredictionInput):
    # Placeholder inference logic
    # In reality, use the loaded model
    
    # Simple heuristic for placeholder
    avg_past = sum(input_data.past_marks) / len(input_data.past_marks) if input_data.past_marks else 0
    predicted_score = (avg_past * 0.6) + (input_data.study_hours * 2) + (input_data.attendance * 0.1)
    predicted_score = min(100, max(0, predicted_score))
    
    pass_fail = "Pass" if predicted_score >= 50 else "Fail"
    risk_category = "Low" if predicted_score > 75 else "Medium" if predicted_score > 50 else "High"
    
    return {
        "predicted_score": round(predicted_score, 2),
        "pass_fail": pass_fail,
        "risk_level": risk_category,
        "confidence": 0.85,
        "model_version": "v0.0.1-placeholder"
    }

@app.post("/train")
def train_model():
    # Trigger training pipeline
    return {"status": "Training started (placeholder)"}
