// src/services/api.js
// ─────────────────────────────────────────────────────────────────────────────
// Hotel Intelligence API Service — Mohamed Wael | MTC
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
 * @param {Object} bookingData  — all fields the FastAPI /predict endpoint needs
 * @returns {{ will_cancel, cancellation_probability, risk_level, confidence }}
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
