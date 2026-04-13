"""
Hotel Booking Cancellation Prediction — Train Script
=====================================================
Dataset: hotel_bookings.csv (119,390 rows × 32 columns)
Target:  is_canceled (37% cancellation rate)
Model:   Logistic Regression

Run this command: python model/train.py
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score, classification_report, roc_auc_score
)
import joblib
import json
from pathlib import Path

# ─── Files paths ──────────────────────────────────────────────────────────
DATA_PATH   = Path("model/hotel_bookings.csv")
MODEL_PATH  = Path("model/hotel_model.pkl")
SCALER_PATH = Path("model/scaler.pkl")
INFO_PATH   = Path("model/model_info.json")
STATS_PATH  = Path("model/stats.json")

# ─── The columns used (from the analysis of the actual dataset) ───────────────────────
FEATURES = [
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
    # Encoded categoricals
    "hotel_enc",
    "arrival_date_month_enc",
    "meal_enc",
    "market_segment_enc",
    "distribution_channel_enc",
    "reserved_room_type_enc",
    "deposit_type_enc",
    "customer_type_enc",
]

TARGET = "is_canceled"

# ─── Cryptogram maps (Label Encoding) ──────────────────────────────────────────
HOTEL_MAP = {"Resort Hotel": 0, "City Hotel": 1}

MONTH_MAP = {
    "January": 1, "February": 2, "March": 3, "April": 4,
    "May": 5, "June": 6, "July": 7, "August": 8,
    "September": 9, "October": 10, "November": 11, "December": 12
}

MEAL_MAP = {"BB": 0, "HB": 1, "FB": 2, "SC": 3, "Undefined": 4}

MARKET_MAP = {
    "Direct": 0, "Corporate": 1, "Online TA": 2,
    "Offline TA/TO": 3, "Complementary": 4, "Groups": 5,
    "Undefined": 6, "Aviation": 7
}

DIST_MAP = {
    "Direct": 0, "Corporate": 1, "TA/TO": 2,
    "Undefined": 3, "GDS": 4
}

ROOM_MAP = {r: i for i, r in enumerate("ABCDEFGHILP")}

DEPOSIT_MAP = {"No Deposit": 0, "Refundable": 1, "Non Refund": 2}

CUSTOMER_MAP = {
    "Transient": 0, "Contract": 1,
    "Transient-Party": 2, "Group": 3
}

# Save these maps so we can use them in main.py
ENCODING_MAPS = {
    "hotel": HOTEL_MAP,
    "arrival_date_month": MONTH_MAP,
    "meal": MEAL_MAP,
    "market_segment": MARKET_MAP,
    "distribution_channel": DIST_MAP,
    "reserved_room_type": ROOM_MAP,
    "deposit_type": DEPOSIT_MAP,
    "customer_type": CUSTOMER_MAP,
}


def load_and_prepare(path: Path) -> pd.DataFrame:
    print("📂 Loading dataset...")
    df = pd.read_csv(path)
    print(f"   ✅ {len(df):,} rows × {len(df.columns)} columns")

    print("\n🧹 Cleaning & encoding...")

    # ── Addressing missing values ────────────────────────────────────────────────
    df["children"].fillna(0, inplace=True)
    df["country"].fillna("Unknown", inplace=True)
    df["agent"].fillna(0, inplace=True)
    df["company"].fillna(0, inplace=True)

    # ── Remove outliers ──────────────────────────────────────────────────
    df = df[df["adr"] >= 0]
    df = df[df["adr"] < 5500]
    df = df[(df["adults"] + df["children"] + df["babies"]) > 0]

    # ── Encode Text columns ───────────────────────────────────────────────
    df["hotel_enc"]                  = df["hotel"].map(HOTEL_MAP).fillna(0).astype(int)
    df["arrival_date_month_enc"]     = df["arrival_date_month"].map(MONTH_MAP).fillna(0).astype(int)
    df["meal_enc"]                   = df["meal"].map(MEAL_MAP).fillna(0).astype(int)
    df["market_segment_enc"]         = df["market_segment"].map(MARKET_MAP).fillna(0).astype(int)
    df["distribution_channel_enc"]   = df["distribution_channel"].map(DIST_MAP).fillna(0).astype(int)
    df["reserved_room_type_enc"]     = df["reserved_room_type"].map(ROOM_MAP).fillna(0).astype(int)
    df["deposit_type_enc"]           = df["deposit_type"].map(DEPOSIT_MAP).fillna(0).astype(int)
    df["customer_type_enc"]          = df["customer_type"].map(CUSTOMER_MAP).fillna(0).astype(int)

    print(f"   ✅ After cleaning: {len(df):,} rows")
    return df


def train():
    df = load_and_prepare(DATA_PATH)

    X = df[FEATURES].copy()
    y = df[TARGET].copy()

    print(f"\n📊 Target:")
    print(f"   Not Canceled: {(y==0).sum():,} ({(y==0).mean()*100:.1f}%)")
    print(f"   Canceled:     {(y==1).sum():,} ({(y==1).mean()*100:.1f}%)")

    # ── Split ────────────────────────────────────────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\n✂️  {len(X_train):,} train | {len(X_test):,} test")

    # ── Scale ────────────────────────────────────────────────────────────────
    scaler = StandardScaler()
    X_train_sc = scaler.fit_transform(X_train)
    X_test_sc  = scaler.transform(X_test)

    # ── Train ────────────────────────────────────────────────────────────────
    print("\n🤖 Training Logistic Regression...")
    model = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        C=1.0,
        solver="lbfgs",
        n_jobs=-1,
        random_state=42
    )
    model.fit(X_train_sc, y_train)
    print("   ✅ Done!")

    # ── Evaluate ─────────────────────────────────────────────────────────────
    y_pred = model.predict(X_test_sc)
    y_prob = model.predict_proba(X_test_sc)[:, 1]
    accuracy = accuracy_score(y_test, y_pred)
    auc      = roc_auc_score(y_test, y_prob)

    print(f"\n{'='*50}")
    print(f"  Accuracy : {accuracy*100:.2f}%")
    print(f"  AUC-ROC  : {auc:.4f}")
    print(f"{'='*50}")
    print(classification_report(y_test, y_pred, target_names=["Not Canceled","Canceled"]))

    # ── Save ─────────────────────────────────────────────────────────────────
    Path("model").mkdir(exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    # Save the encoding maps with the scaler so that main.py can use them.
    joblib.dump(ENCODING_MAPS, "model/encoding_maps.pkl")

    with open(INFO_PATH, "w") as f:
        json.dump({
            "model_type": "Logistic Regression",
            "accuracy": round(accuracy, 4),
            "auc_roc": round(auc, 4),
            "training_samples": len(X_train),
            "test_samples": len(X_test),
            "features": FEATURES,
            "cancellation_rate_in_data": round(float(y.mean()), 4),
            "dataset_rows": len(df),
        }, f, indent=2)

    with open(STATS_PATH, "w") as f:
        json.dump({
            "total_predictions": 0,
            "cancellation_rate": round(float(y.mean()), 4),
            "high_risk_count": 0,
            "model_accuracy": round(accuracy, 4),
        }, f, indent=2)

    print(f"\n💾 Saved: {MODEL_PATH} | {SCALER_PATH}")
    print("🎉 Model ready!")
    return model, scaler, accuracy


if __name__ == "__main__":
    if not DATA_PATH.exists():
        print(f"❌ File not found: {DATA_PATH}")
        print("   ضع hotel_bookings.csv في مجلد model/")
        exit(1)
    train()
