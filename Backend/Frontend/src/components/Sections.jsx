import React from 'react';
import { motion } from 'framer-motion';

export const Team = () => (
  <section className="sec" id="team">
    <div className="sec-hdr">
      <div>
        <span className="sec-tag">THE TEAM</span>
        <h2 className="sec-title">Mohamed Wael — MTC 2026</h2>
        <p className="sec-sub">Supervised by Dr. Mohamed El Shafey · Data Mining & Visualization · Military Technical College</p>
      </div>
    </div>
    <div className="team-grid stagger">
      {[ 
        { n: 'Wael', r: 'DB Architect & SQL Engineer & EDA Engineer', a: 'W' },
        { n: 'Saad', r: 'SQL Engineer', a: 'S' },
        { n: 'El Kholy', r: 'Python / EDA Engineer', a: 'E' },
        { n: 'Gharieb', r: 'Orange / ML Engineer', a: 'W' },
        { n: 'Hesham', r: 'Report & Dashboard', a: 'H' }
      ].map((m, i) => (
        <motion.div 
          key={i} 
          className="card team-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="team-av">{m.a}</div>
          <div className="team-name">{m.n}</div>
          <div className="team-role">{m.r}</div>
        </motion.div>
      ))}
      <motion.div 
        className="card team-card"
        style={{background: 'linear-gradient(135deg,rgba(13,148,136,.25),rgba(11,15,26,.5))', borderColor: 'rgba(45,212,191,.3)'}}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="team-av" style={{background:'linear-gradient(135deg,var(--teal),var(--teal2))'}}>Dr</div>
        <div className="team-name">Dr. Mohamed El Shafey</div>
        <div className="team-role">Course Supervisor</div>
      </motion.div>
    </div>
  </section>
);

export const Database = () => (
  <motion.section 
    className="sec" 
    id="database"
    initial="hidden"
    whileInView="visible"
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }
    }}
    viewport={{ once: true }}
  >
    <span className="sec-tag">DATABASE ENGINEERING</span>
    <h2 className="sec-title">Relational Schema Design</h2>
    <p className="sec-sub">11 normalized tables across 4 functional domains — Reservations as the central hub, normalized to 3NF throughout.</p>

    <div className="callout">
      <div className="callout-lbl">Design Principle</div>
      <div className="callout-txt">The Reservations entity acts as a hub with 4 FKs linking Hotels, Guests, Rooms, and Staff. A 1:1 Reservation→Invoice relationship and ServiceUsage junction table deliberately separate operational and billing analytics. All 119,390 rows ingested via a 4-stage ETL pipeline in under 30 seconds.</div>
    </div>

    <div className="g3" style={{marginTop:24}}>
      <div className="card">
        <div className="card-hdr"><span className="card-ttl">Master Data</span><span className="cbadge">6 Tables</span></div>
        <ul className="feat-list">
          <li>Hotels — HotelID, Name, City, StarRating</li>
          <li>RoomTypes — TypeID, Name, Capacity, BasePrice</li>
          <li>Rooms — UNIQUE(HotelID, RoomNum)</li>
          <li>Guests — GuestID, Email, IsRepeatedGuest</li>
          <li>Staff — Role, Department, HotelID FK</li>
          <li>Services — Name, Category, Price</li>
        </ul>
      </div>
      <div className="card">
        <div className="card-hdr"><span className="card-ttl">Transactional</span><span className="cbadge">4 Tables</span></div>
        <ul className="feat-list">
          <li>Reservations — 4×FK hub, Status, Channel, Nights</li>
          <li>ServiceUsage — M:N junction (Reservation×Service)</li>
          <li>Invoices — 1:1 with Reservation, OutstandingAmount</li>
          <li>Payments — 1:N under Invoice, partial payments OK</li>
        </ul>
      </div>
      <div className="card">
        <div className="card-hdr"><span className="card-ttl">Ops + Staging</span><span className="cbadge">1+1 Tables</span></div>
        <ul className="feat-list">
          <li>HousekeepingLogs — StartTime, EndTime, CleaningType</li>
          <li>HotelBooking_Staging — flat NVARCHAR buffer for CSV</li>
          <li>4-stage ETL: Load → Validate → Normalize → Error-log</li>
          <li>119,390 rows ingested in under 30 seconds</li>
        </ul>
      </div>
    </div>
  </motion.section>
);

export const MLModels = () => (
  <section className="sec" id="ml">
    <span className="sec-tag">MACHINE LEARNING</span>
    <h2 className="sec-title">Predictive Models & Guest Clustering</h2>
    <p className="sec-sub">Four classifiers trained on 119,390 bookings for cancellation prediction, plus k-Means guest segmentation.</p>

    <div className="g4 stagger">
      {[
        { n: 'Random Forest', d: '300 trees, balanced class weights. Highest feature importance interpretability.', a: '93.2%', auc: '0.962', i: '🌲', c: 'mc-rf', t: '🥇 Production' },
        { n: 'XGBoost', d: 'Gradient boosting with sequential error correction. Near-RF accuracy, faster inference.', a: '91.8%', auc: '0.955', i: '⚡', c: 'mc-xgb', t: 'Boosted' },
        { n: 'Logistic Regression', d: 'Interpretable linear baseline. Coefficients reveal each feature\'s direct contribution.', a: '80.1%', auc: '0.871', i: '📈', c: 'mc-lr', t: 'Baseline' },
        { n: 'Decision Tree', d: 'Max depth 7. Human-readable business rules directly from the model.', a: '87.4%', auc: '0.891', i: '🌿', c: 'mc-dt', t: 'Rules' }
      ].map((m, i) => (
        <motion.div 
          key={i} 
          className={`card model-card ${m.c}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mc-icon">{m.i}</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
            <div className="mc-name">{m.n}</div>
            <span className="cbadge" style={m.n === 'XGBoost' ? {background:'rgba(239,68,68,.15)',color:'#EF4444'} : undefined}>{m.t}</span>
          </div>
          <p className="mc-desc">{m.d}</p>
          <div className="mc-metrics">
            <div className="mc-metric"><span className="mc-mval">{m.a}</span><div className="mc-mlbl">Accuracy</div></div>
            <div className="mc-metric"><span className="mc-mval">{m.auc}</span><div className="mc-mlbl">AUC</div></div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export const RecommendationsList = () => (
  <section className="sec" id="recommendations">
    <span className="sec-tag">BUSINESS RECOMMENDATIONS</span>
    <h2 className="sec-title">6 Actionable Strategies</h2>
    <p className="sec-sub">Derived from EDA findings and validated by ML. Structured by implementation priority.</p>
    <div className="rec-grid stagger">
      {[
        { p: 'Immediate Priority', t: 'Deploy Real-Time Cancellation Risk Score', b: 'Integrate into PMS: lead_time>120d (+2pts) + Non-Refund deposit (+3pts) + prior_cancellations≥1 (+2pts). Score≥5 triggers re-confirmation workflow 14 days pre-arrival.', i: 'Manage ~15% of high-risk inventory proactively', c: 'rc-high' },
        { p: 'Immediate Priority', t: 'Revise Non-Refundable OTA Deposit Policy', b: 'The ~99% cancellation rate for Non-Refund OTA bookings is a systemic policy failure. Negotiate true pre-auth captures with OTA partners or discontinue Non-Refund rate plans.', i: 'Eliminate the deposit-cancellation paradox', c: 'rc-high' },
        { p: 'Medium-Term', t: 'Launch Direct Booking Incentive Programme', b: 'Direct bookings deliver higher ADR and lower cancellation than any OTA channel. Offer guaranteed upgrade + flexible cancellation.', i: '−2.3pp cancel rate · higher ADR', c: 'rc-med' },
        { p: 'Medium-Term', t: 'Special Request Solicitation at Booking', b: 'Each additional special request reduces cancellation probability by ~8%. Automated post-booking email asking for preferences deepens guest commitment.', i: 'Reduce cancellation via psychological investment', c: 'rc-med' }
      ].map((m, i) => (
        <motion.div 
          key={i} 
          className={`card rec-card ${m.c}`}
          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="rec-prio">{m.p}</div>
          <div className="rec-ttl">{m.t}</div>
          <div className="rec-body">{m.b}</div>
          <span className="rec-impact">Impact: {m.i}</span>
        </motion.div>
      ))}
    </div>
  </section>
);
