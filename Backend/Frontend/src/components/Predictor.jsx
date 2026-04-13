import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { predictCancellation } from '../services/api';

const DEFAULTS = {
  hotel: 'City Hotel',
  lead_time: 60,
  arrival_date_month: 'July',
  arrival_date_week_number: 27,
  arrival_date_day_of_month: 15,
  stays_in_weekend_nights: 1,
  stays_in_week_nights: 3,
  adults: 2,
  children: 0,
  babies: 0,
  meal: 'BB',
  market_segment: 'Online TA',
  distribution_channel: 'TA/TO',
  is_repeated_guest: 0,
  previous_cancellations: 0,
  previous_bookings_not_canceled: 0,
  reserved_room_type: 'A',
  booking_changes: 0,
  deposit_type: 'No Deposit',
  days_in_waiting_list: 0,
  customer_type: 'Transient',
  adr: 100,
  required_car_parking_spaces: 0,
  total_of_special_requests: 1,
};

const FIELDS = [
  { key: 'hotel',                          label: 'Hotel Type',          type: 'select', opts: ['City Hotel','Resort Hotel'] },
  { key: 'lead_time',                      label: 'Lead Time (days)',    type: 'number', min: 0, max: 737 },
  { key: 'arrival_date_month',             label: 'Arrival Month',       type: 'select', opts: ['January','February','March','April','May','June','July','August','September','October','November','December'] },
  { key: 'arrival_date_week_number',       label: 'Week Number',         type: 'number', min: 1, max: 52 },
  { key: 'arrival_date_day_of_month',      label: 'Day of Month',        type: 'number', min: 1, max: 31 },
  { key: 'stays_in_weekend_nights',        label: 'Weekend Nights',      type: 'number', min: 0, max: 20 },
  { key: 'stays_in_week_nights',           label: 'Weekday Nights',      type: 'number', min: 0, max: 50 },
  { key: 'adults',                         label: 'Adults',              type: 'number', min: 0, max: 10 },
  { key: 'children',                       label: 'Children',            type: 'number', min: 0, max: 10 },
  { 
    key: 'meal', 
    label: 'Meal Plan', 
    type: 'select', 
    opts: [
      { v: 'BB', l: 'BB (Bed & Breakfast)' },
      { v: 'HB', l: 'HB (Half Board)' },
      { v: 'FB', l: 'FB (Full Board)' },
      { v: 'SC', l: 'SC (Self Catering)' },
      { v: 'Undefined', l: 'Undefined' }
    ] 
  },
  { key: 'market_segment',                 label: 'Market Segment',      type: 'select', opts: ['Online TA','Offline TA/TO','Direct','Corporate','Groups','Aviation','Complementary'] },
  { key: 'distribution_channel',           label: 'Distribution',        type: 'select', opts: ['TA/TO','Direct','Corporate','GDS','Undefined'] },
  { 
    key: 'reserved_room_type', 
    label: 'Room Type', 
    type: 'select', 
    opts: [
      { v: 'A', l: 'Room Type A (Single)' },
      { v: 'B', l: 'Room Type B (Double)' },
      { v: 'C', l: 'Room Type C (Triple)' },
      { v: 'D', l: 'Room Type D (Family)' },
      { v: 'E', l: 'Room Type E (Suite)' },
      { v: 'F', l: 'Room Type F (Exec.)' },
      { v: 'G', l: 'Room Type G (Pres.)' },
      { v: 'H', l: 'Room Type H (Apart.)' }
    ] 
  },
  { key: 'deposit_type',                   label: 'Deposit Type',        type: 'select', opts: ['No Deposit','Refundable','Non Refund'] },
  { key: 'customer_type',                  label: 'Customer Type',       type: 'select', opts: ['Transient','Contract','Transient-Party','Group'] },
  { key: 'adr',                            label: 'Daily Rate (€)',      type: 'number', min: 0, max: 5000, step: 0.5 },
  { key: 'is_repeated_guest',              label: 'Repeated Guest',      type: 'select', opts: ['0','1'] },
  { key: 'previous_cancellations',         label: 'Prev. Cancellations', type: 'number', min: 0, max: 50 },
  { key: 'previous_bookings_not_canceled', label: 'Prev. Completed',     type: 'number', min: 0, max: 50 },
  { key: 'booking_changes',                label: 'Booking Changes',     type: 'number', min: 0, max: 20 },
  { key: 'days_in_waiting_list',           label: 'Waiting List Days',   type: 'number', min: 0, max: 400 },
  { key: 'required_car_parking_spaces',    label: 'Parking Spaces',      type: 'number', min: 0, max: 5 },
  { key: 'total_of_special_requests',      label: 'Special Requests',    type: 'number', min: 0, max: 10 },
];

function getRiskColor(level) {
  if (level === 'HIGH')   return '#F0506E';
  if (level === 'MEDIUM') return '#E8A030';
  return '#22D3A0';
}

export default function Predictor() {
  const [form, setForm]       = useState(DEFAULTS);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleChange = (key, val) => {
    setForm(prev => ({
      ...prev,
      [key]: ['lead_time','arrival_date_week_number','arrival_date_day_of_month',
               'stays_in_weekend_nights','stays_in_week_nights','adults','children',
               'babies','is_repeated_guest','previous_cancellations',
               'previous_bookings_not_canceled','booking_changes',
               'days_in_waiting_list','required_car_parking_spaces',
               'total_of_special_requests'].includes(key)
        ? Number(val)
        : key === 'adr' ? parseFloat(val) || 0
        : val
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = { ...form, babies: 0 }; // babies not in form but required by backend
      const res = await predictCancellation(payload);
      setResult(res);
    } catch (e) {
      setError(e.message || 'Server error — make sure the backend is running');
    } finally {
      setLoading(false);
    }
  };

  const prob    = result ? Math.round(result.cancellation_probability * 100) : 0;
  const offset  = result ? 452 - (452 * result.cancellation_probability) : 452;
  const color   = result ? getRiskColor(result.risk_level) : 'var(--teal2)';

  return (
    <div className="predictor-wrap">
      {/* Header */}
      <div className="pred-hdr">
        <div style={{ width: 42, height: 42, borderRadius: 12,
          background: 'rgba(10,191,188,.12)', border: '1px solid rgba(10,191,188,.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BrainCircuit size={22} color="var(--teal2)" />
        </div>
        <div>
          <h3>Live Cancellation Risk Calculator</h3>
          <p>Fill in booking details — the ML model predicts cancellation probability in real-time</p>
        </div>
      </div>

      {/* Body */}
      <div className="pred-body">
        {/* Form */}
        <div className="pred-form">
          <div className="form-grid">
            {FIELDS.map(f => (
              <div key={f.key}>
                <label className="fg-lbl" htmlFor={`p-${f.key}`}>{f.label}</label>
                {f.type === 'select' ? (
                  <select
                    id={`p-${f.key}`}
                    className="fg-input"
                    value={form[f.key]}
                    onChange={e => handleChange(f.key, e.target.value)}
                  >
                    {f.opts.map(o => {
                      const val = typeof o === 'object' ? o.v : o;
                      const lab = typeof o === 'object' ? o.l : o;
                      return <option key={val} value={val}>{lab}</option>;
                    })}
                  </select>
                ) : (
                  <input
                    id={`p-${f.key}`}
                    className="fg-input"
                    type="number"
                    min={f.min} max={f.max} step={f.step || 1}
                    value={form[f.key]}
                    onChange={e => handleChange(f.key, e.target.value)}
                    onFocus={e => e.target.select()}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            className="btn-predict"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading
              ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <Loader2 size={17} style={{ animation:'spin 1s linear infinite' }} />
                  Analyzing...
                </span>
              : '🎯 Predict Cancellation Risk'}
          </button>

          {error && (
            <div style={{ marginTop: 14, padding: '12px 16px',
              background: 'rgba(240,80,110,.08)', border: '1px solid rgba(240,80,110,.2)',
              borderRadius: 10, color: 'var(--rose)', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Result */}
        <div className="pred-result">
          {!result && !loading && (
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: 44, marginBottom: 16, opacity: .4 }}>🎯</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Fill the form and click Predict</div>
              <div style={{ fontSize: 12, marginTop: 6, opacity: .6 }}>
                The model will assess cancellation risk based on booking features
              </div>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', color: 'var(--teal2)' }}>
              <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
              <div style={{ fontSize: 14, fontWeight: 600 }}>Running ML Model...</div>
            </div>
          )}

          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: .85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .5, ease: [.4,0,.2,1] }}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:18, width:'100%' }}
              >
                {/* Gauge */}
                <div className="gauge-wrap">
                  <svg className="gauge-svg" viewBox="0 0 160 160">
                    <circle className="gauge-bg" cx="80" cy="80" r="72" />
                    <circle
                      className="gauge-fill"
                      cx="80" cy="80" r="72"
                      style={{ stroke: color, strokeDashoffset: offset }}
                    />
                  </svg>
                  <div className="gauge-center">
                    <div className="gauge-pct" style={{ color }}>{prob}%</div>
                    <div className="gauge-sub">Cancel Risk</div>
                  </div>
                </div>

                {/* Risk badge */}
                <div className={`risk-badge rb-${result.risk_level.toLowerCase()}`}>
                  {result.risk_level === 'HIGH'   && '🔴 High Risk'}
                  {result.risk_level === 'MEDIUM' && '🟡 Medium Risk'}
                  {result.risk_level === 'LOW'    && '🟢 Low Risk'}
                </div>

                {/* Stats */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, width:'100%' }}>
                  {[
                    { l: 'Probability',  v: `${prob}%`,                       c: color },
                    { l: 'Confidence',   v: `${Math.round(result.confidence * 100)}%`, c: 'var(--teal2)' },
                    { l: 'Will Cancel',  v: result.will_cancel ? 'YES' : 'NO',
                      c: result.will_cancel ? 'var(--rose)' : 'var(--green)' },
                    { l: 'Risk Level',   v: result.risk_level,                 c: color },
                  ].map((s,i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,.03)',
                      border: '1px solid var(--border)',
                      borderRadius: 12, padding: '12px 14px', textAlign:'center'
                    }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: s.c, fontFamily:'var(--font-m)' }}>{s.v}</div>
                      <div style={{ fontSize: 10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.8px', marginTop:4, fontWeight:600 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
