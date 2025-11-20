import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import joblib
import os

def train():
    print("Starting training pipeline...")
    # Placeholder for data loading
    # df = pd.read_csv("../dataset/students.csv")
    
    # Synthetic data for demonstration
    data = {
        'study_hours': np.random.rand(100) * 10,
        'attendance': np.random.rand(100) * 100,
        'assignments_completed': np.random.randint(0, 20, 100),
        'engagement_score': np.random.rand(100) * 100,
        'final_score': np.random.rand(100) * 100
    }
    df = pd.DataFrame(data)
    
    X = df[['study_hours', 'attendance', 'assignments_completed', 'engagement_score']]
    y = df['final_score']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    pipeline.fit(X_train, y_train)
    
    score = pipeline.score(X_test, y_test)
    print(f"Model R2 Score: {score}")
    
    # Save model
    os.makedirs("../model", exist_ok=True)
    joblib.dump(pipeline, "../model/model_v1.joblib")
    print("Model saved to ../model/model_v1.joblib")

if __name__ == "__main__":
    train()
