from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pandas as pd          # ← moved to top level (was inside function — caused issues)
import joblib
import json
import traceback             # ← for full error logging
from pathlib import Path

app = FastAPI(
    title="Hotel Intelligence API",
    description="Hotel Booking Cancellation Prediction — Mohamed Wael | MTC",
    version="2.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Paths ────────────────────────────────────────────────────────────────────
MODEL_PATH         = Path("model/hotel_model.pkl")
SCALER_PATH        = Path("model/scaler.pkl")
ENCODING_MAPS_PATH = Path("model/encoding_maps.pkl")

model         = None
scaler        = None
encoding_maps = None

# ─── Feature order — MUST match train.py FEATURES list exactly ───────────────
FEATURE_COLUMNS = [
    "lead_time",
    "arrival_date_week_number",
    "arrival_date_day_of_month",
    "stays_in_weekend_nights",
    "stays_in_week_nights",
    "adults",
    "children",
    "babies",
    "is_repeated_guest",
    "previous_cancellations",
    "previous_bookings_not_canceled",
    "booking_changes",
    "days_in_waiting_list",
    "adr",
    "required_car_parking_spaces",
    "total_of_special_requests",
    "hotel_enc",
    "arrival_date_month_enc",
    "meal_enc",
    "market_segment_enc",
    "distribution_channel_enc",
    "reserved_room_type_enc",
    "deposit_type_enc",
    "customer_type_enc",
]

@app.on_event("startup")
def load_model():
    global model, scaler, encoding_maps
    try:
        if MODEL_PATH.exists() and SCALER_PATH.exists():
            model         = joblib.load(MODEL_PATH)
            scaler        = joblib.load(SCALER_PATH)
            encoding_maps = joblib.load(ENCODING_MAPS_PATH) if ENCODING_MAPS_PATH.exists() else {}
            print("✅ Model loaded successfully")
            print(f"   Scaler feature names: {getattr(scaler, 'feature_names_in_', 'N/A')}")
        else:
            print("⚠️  Model files not found — run: python model/train.py")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        traceback.print_exc()

# ─── Schema ───────────────────────────────────────────────────────────────────
class BookingInput(BaseModel):
    hotel: str
    lead_time: int
    arrival_date_month: str
    arrival_date_week_number: int
    arrival_date_day_of_month: int
    stays_in_weekend_nights: int
    stays_in_week_nights: int
    adults: int
    children: int
    babies: int
    meal: str
    market_segment: str
    distribution_channel: str
    is_repeated_guest: int
    previous_cancellations: int
    previous_bookings_not_canceled: int
    reserved_room_type: str
    booking_changes: int
    deposit_type: str
    days_in_waiting_list: int
    customer_type: str
    adr: float
    required_car_parking_spaces: int
    total_of_special_requests: int

class PredictionResponse(BaseModel):
    will_cancel: bool
    cancellation_probability: float
    risk_level: str
    confidence: float

# ─── Helpers ──────────────────────────────────────────────────────────────────
def get_risk_level(prob: float) -> str:
    if prob >= 0.7:   return "HIGH"
    elif prob >= 0.4: return "MEDIUM"
    else:             return "LOW"

def encode_booking(data: BookingInput) -> pd.DataFrame:
    em = encoding_maps or {}

    def enc(col, val, default=0):
        return int(em.get(col, {}).get(val, default))

    row = {
        "lead_time":                          int(data.lead_time),
        "arrival_date_week_number":           int(data.arrival_date_week_number),
        "arrival_date_day_of_month":          int(data.arrival_date_day_of_month),
        "stays_in_weekend_nights":            int(data.stays_in_weekend_nights),
        "stays_in_week_nights":               int(data.stays_in_week_nights),
        "adults":                             int(data.adults),
        "children":                           int(data.children),
        "babies":                             int(data.babies),
        "is_repeated_guest":                  int(data.is_repeated_guest),
        "previous_cancellations":             int(data.previous_cancellations),
        "previous_bookings_not_canceled":     int(data.previous_bookings_not_canceled),
        "booking_changes":                    int(data.booking_changes),
        "days_in_waiting_list":               int(data.days_in_waiting_list),
        "adr":                                float(data.adr),
        "required_car_parking_spaces":        int(data.required_car_parking_spaces),
        "total_of_special_requests":          int(data.total_of_special_requests),
        "hotel_enc":                          enc("hotel",                data.hotel),
        "arrival_date_month_enc":             enc("arrival_date_month",   data.arrival_date_month),
        "meal_enc":                           enc("meal",                 data.meal),
        "market_segment_enc":                 enc("market_segment",       data.market_segment),
        "distribution_channel_enc":           enc("distribution_channel", data.distribution_channel),
        "reserved_room_type_enc":             enc("reserved_room_type",   data.reserved_room_type),
        "deposit_type_enc":                   enc("deposit_type",         data.deposit_type),
        "customer_type_enc":                  enc("customer_type",        data.customer_type),
    }

    # enforce exact column order matching the scaler
    df = pd.DataFrame([row])[FEATURE_COLUMNS]
    return df

# ─── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "Hotel Intelligence API 🏨",
        "team": "Mohamed Wael | MTC",
        "docs": "/docs",
        "model_loaded": model is not None,
        "version": "2.1.0"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(booking: BookingInput):
    if model is None:
        raise HTTPException(503, "Model not loaded. Run: python model/train.py")
    try:
        print(f"DEBUG: Processing prediction for hotel={booking.hotel}, lead_time={booking.lead_time}")
        X  = encode_booking(booking)
        Xs = scaler.transform(X)
        pred  = model.predict(Xs)[0]
        proba = model.predict_proba(Xs)[0]
        prob  = float(proba[1])
        conf  = float(max(proba))
        return PredictionResponse(
            will_cancel=bool(pred),
            cancellation_probability=round(prob, 4),
            risk_level=get_risk_level(prob),
            confidence=round(conf, 4),
        )
    except Exception as e:
        traceback.print_exc()          # ← يطبع الـ full error في terminal
        raise HTTPException(500, f"Prediction error: {str(e)}")

@app.post("/predict/batch")
def predict_batch(bookings: list[BookingInput]):
    if model is None:
        raise HTTPException(503, "Model not loaded.")
    results = []
    for b in bookings:
        try:
            X    = encode_booking(b)
            Xs   = scaler.transform(X)
            pred = model.predict(Xs)[0]
            prob = float(model.predict_proba(Xs)[0][1])
            results.append({
                "will_cancel": bool(pred),
                "cancellation_probability": round(prob, 4),
                "risk_level": get_risk_level(prob),
            })
        except Exception as e:
            traceback.print_exc()
            results.append({"error": str(e)})
    return {"predictions": results, "total": len(results)}

@app.get("/stats")
def stats():
    p = Path("model/stats.json")
    if p.exists():
        return json.loads(p.read_text())
    return {"total_predictions": 0, "cancellation_rate": 0.37,
            "high_risk_count": 0, "model_accuracy": 0.0}

@app.get("/model/info")
def model_info():
    p = Path("model/model_info.json")
    if p.exists():
        return json.loads(p.read_text())
    return {"status": "No model info — run train.py first"}
