# 🏨 Hotel Intelligence — Backend Setup
### Mohamed Wael | MTC

---

## 📁 هيكل المشروع

```
hotel-intelligence/
├── frontend/                  ← مشروعك الحالي (React + Vite)
│   └── src/
│       └── services/
│           └── api.js         ← انسخ الملف ده هنا
│
└── backend/
    ├── main.py                ← FastAPI application
    ├── requirements.txt       ← المكتبات المطلوبة
    ├── app.yaml               ← إعدادات Google App Engine
    └── model/
        ├── train.py           ← تدريب الموديل
        ├── hotel_bookings.csv ← Dataset من Kaggle (اتحمّله إنت)
        ├── hotel_model.pkl    ← (هيتولد بعد التدريب)
        ├── scaler.pkl         ← (هيتولد بعد التدريب)
        ├── model_info.json    ← (هيتولد بعد التدريب)
        └── stats.json         ← (هيتولد بعد التدريب)
```

---

## 🚀 خطوات التشغيل المحلي

### 1. تحميل الـ Dataset
1. افتح الرابط ده: https://www.kaggle.com/datasets/jessemostipak/hotel-booking-demand
2. حمّل الملف `hotel_bookings.csv`
3. حطّه في مجلد `backend/model/`

### 2. إعداد البيئة
```bash
cd backend

# إنشاء virtual environment
python -m venv venv

# تفعيله
# على Mac/Linux:
source venv/bin/activate
# على Windows:
venv\Scripts\activate

# تثبيت المكتبات
pip install -r requirements.txt
```

### 3. تدريب الموديل
```bash
python model/train.py
```
هيطبعلك:
- معلومات تنظيف البيانات
- دقة الموديل (Accuracy + AUC-ROC)
- مكان حفظ الموديل

### 4. تشغيل الـ API
```bash
uvicorn main:app --reload
```
افتح: http://localhost:8000/docs

---

## 🌐 ربط الفرونت اند

1. انسخ ملف `api.js` إلى `frontend/src/services/api.js`
2. أنشئ ملف `.env` في مجلد الفرونت اند:
```env
VITE_API_URL=http://localhost:8000
```
3. استخدم الـ functions في أي Component:
```jsx
import { predictCancellation, getStats } from './services/api';
```

---

## ☁️ النشر على Google App Engine

### المتطلبات
- حساب Google Cloud
- `gcloud` CLI مثبّت

### خطوات النشر
```bash
# تسجيل الدخول
gcloud auth login

# إنشاء مشروع جديد (لو مش عندك)
gcloud projects create hotel-intelligence-mtc

# تحديد المشروع
gcloud config set project hotel-intelligence-mtc

# رفع الملفات
cd backend
gcloud app deploy

# بعد النشر، غيّر الـ VITE_API_URL في الفرونت اند
# لـ URL بتاع App Engine مثلاً:
# VITE_API_URL=https://hotel-intelligence-mtc.appspot.com
```

---

## 📡 API Endpoints

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/` | معلومات الـ API |
| GET | `/health` | حالة السيرفر والموديل |
| POST | `/predict` | تنبؤ لحجز واحد |
| POST | `/predict/batch` | تنبؤ لأكثر من حجز |
| GET | `/stats` | إحصائيات للـ Dashboard |
| GET | `/model/info` | معلومات الموديل |

---

## 🧪 مثال على الـ /predict

**Request:**
```json
{
  "lead_time": 120,
  "arrival_month": 7,
  "arrival_week": 27,
  "stays_weekend_nights": 2,
  "stays_week_nights": 5,
  "adults": 2,
  "children": 0,
  "babies": 0,
  "meal": "BB",
  "market_segment": "Online TA",
  "is_repeated_guest": 0,
  "previous_cancellations": 1,
  "previous_bookings_not_canceled": 3,
  "reserved_room_type": "A",
  "booking_changes": 0,
  "deposit_type": "No Deposit",
  "days_in_waiting_list": 0,
  "adr": 150.50,
  "required_car_parking_spaces": 0,
  "total_of_special_requests": 2
}
```

**Response:**
```json
{
  "will_cancel": false,
  "cancellation_probability": 0.23,
  "risk_level": "LOW",
  "confidence": 0.77
}
```
