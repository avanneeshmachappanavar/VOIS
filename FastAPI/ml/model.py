import pandas as pd
import joblib
from pathlib import Path
from FastAPI.ml.features import engineer_features  # ✅ ADD THIS

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"

model = joblib.load(MODEL_PATH)

def predict_failure(raw_features: dict):
    # 1. Convert to DataFrame
    df = pd.DataFrame([raw_features])

    # 2. APPLY FEATURE ENGINEERING (CRITICAL)
    df = engineer_features(df)

    # 3. Predict
    probability = model.predict_proba(df)[0][1]
    prediction = int(probability >= 0.5)

    return prediction, probability

