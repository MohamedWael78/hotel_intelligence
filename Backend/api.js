// src/services/api.js
// ─────────────────────────────────────────────────────────────────────────────
// Hotel Intelligence API Service — Mohamed Wael | MTC
// غيّر VITE_API_URL في ملف .env لما تنشر على App Engine
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Health ───────────────────────────────────────────────────────────────────
export async function checkHealth() {
  return request("/health");
}

// ─── Predict single booking ───────────────────────────────────────────────────
/**
 * @param {Object} bookingData
 * @returns {{ will_cancel, cancellation_probability, risk_level, confidence }}
 *
 * bookingData fields:
 *   hotel                          "Resort Hotel" | "City Hotel"
 *   lead_time                      number
 *   arrival_date_month             "January" .. "December"
 *   arrival_date_week_number       number (1-52)
 *   arrival_date_day_of_month      number (1-31)
 *   stays_in_weekend_nights        number
 *   stays_in_week_nights           number
 *   adults                         number
 *   children                       number
 *   babies                         number
 *   meal                           "BB" | "HB" | "FB" | "SC" | "Undefined"
 *   market_segment                 "Online TA" | "Direct" | "Corporate" | "Offline TA/TO" | "Groups" | "Aviation"
 *   distribution_channel           "TA/TO" | "Direct" | "Corporate" | "GDS"
 *   is_repeated_guest              0 | 1
 *   previous_cancellations         number
 *   previous_bookings_not_canceled number
 *   reserved_room_type             "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H"
 *   booking_changes                number
 *   deposit_type                   "No Deposit" | "Refundable" | "Non Refund"
 *   days_in_waiting_list           number
 *   customer_type                  "Transient" | "Contract" | "Transient-Party" | "Group"
 *   adr                            number (متوسط السعر اليومي)
 *   required_car_parking_spaces    number
 *   total_of_special_requests      number
 */
export async function predictCancellation(bookingData) {
  return request("/predict", {
    method: "POST",
    body: JSON.stringify(bookingData),
  });
}

// ─── Predict batch ────────────────────────────────────────────────────────────
export async function predictBatch(bookings) {
  return request("/predict/batch", {
    method: "POST",
    body: JSON.stringify(bookings),
  });
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────
export async function getStats() {
  return request("/stats");
}

// ─── Model info ───────────────────────────────────────────────────────────────
export async function getModelInfo() {
  return request("/model/info");
}

// ─── مثال استخدام في أي Component ────────────────────────────────────────────
/*
import { predictCancellation } from '@/services/api';

const result = await predictCancellation({
  hotel: "City Hotel",
  lead_time: 120,
  arrival_date_month: "July",
  arrival_date_week_number: 27,
  arrival_date_day_of_month: 5,
  stays_in_weekend_nights: 2,
  stays_in_week_nights: 5,
  adults: 2,
  children: 0,
  babies: 0,
  meal: "BB",
  market_segment: "Online TA",
  distribution_channel: "TA/TO",
  is_repeated_guest: 0,
  previous_cancellations: 1,
  previous_bookings_not_canceled: 3,
  reserved_room_type: "A",
  booking_changes: 0,
  deposit_type: "No Deposit",
  days_in_waiting_list: 0,
  customer_type: "Transient",
  adr: 150.50,
  required_car_parking_spaces: 0,
  total_of_special_requests: 2,
});

// result:
// { will_cancel: false, cancellation_probability: 0.23, risk_level: "LOW", confidence: 0.77 }
*/
