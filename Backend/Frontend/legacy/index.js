// ── CHART.JS DEFAULTS ──
Chart.defaults.color = '#7A90A8';
Chart.defaults.font.family = "'DM Sans', sans-serif";
const TEAL = '#2EC4B6', GOLD = '#E0A050', RED = '#C0392B', NAVY = '#162B40';
const BLUE = '#2471A3', GREEN = '#1A7A4A';

// ── NAV SCROLL ──
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => topbar.classList.toggle('scrolled', scrollY > 50));

window.scrollTo = (sel) => {
  const el = document.querySelector(sel);
  if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
};

// Nav active state
document.querySelectorAll('.nb').forEach(btn => {
  btn.addEventListener('click', () => { document.querySelectorAll('.nb').forEach(b => b.classList.remove('active')); btn.classList.add('active'); });
});

// Filter chips
document.querySelectorAll('.chip[data-filter]').forEach(c => {
  c.addEventListener('click', () => { document.querySelectorAll('.chip[data-filter]').forEach(x => x.classList.remove('active')); c.classList.add('active'); });
});
document.querySelectorAll('.chip[data-year]').forEach(c => {
  c.addEventListener('click', () => { document.querySelectorAll('.chip[data-year]').forEach(x => x.classList.remove('active')); c.classList.add('active'); });
});

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal, .stagger').forEach(el => obs.observe(el));

// ── EDA TABS ──
window.showEdaTab = (id, btn) => {
  document.querySelectorAll('.eda-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.eda-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('eda-' + id)?.classList.add('active');
  btn.classList.add('active');
  if (id === 'categorical') { initEdaCharts(); }
};

// ── CHARTS ──
function makeChart(id, cfg) {
  const el = document.getElementById(id);
  if (!el) return;
  return new Chart(el, cfg);
}

const gridOpts = { color: 'rgba(255,255,255,0.04)' };
const tickOpts = { color: '#7A90A8', font: { size: 11 } };
const legendOpts = { labels: { color: '#7A90A8', boxWidth: 12, font: { size: 11 } } };
const baseOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: legendOpts }, scales: { x: { ticks: tickOpts, grid: { display: false } }, y: { ticks: tickOpts, grid: gridOpts } } };

// Monthly Trend
makeChart('monthlyChart', {
  type: 'line',
  data: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets: [
      { label: 'City Hotel', data: [2800,2500,4200,5800,6100,7200,9100,8400,6300,4200,3100,3800], borderColor: TEAL, backgroundColor: 'rgba(46,196,182,.1)', fill: true, tension: 0.4, pointRadius: 3 },
      { label: 'Resort Hotel', data: [1200,1100,2300,3500,4200,5100,7800,6900,4100,2300,1800,2100], borderColor: GOLD, backgroundColor: 'rgba(224,160,80,.1)', fill: true, tension: 0.4, pointRadius: 3 }
    ]
  },
  options: { ...baseOpts }
});

// Cancellation by Segment
makeChart('cancelSegChart', {
  type: 'bar',
  data: {
    labels: ['Online TA','Offline TA','Groups','Corporate','Direct'],
    datasets: [
      { label: 'Cancelled', data: [41,33,28,23,17], backgroundColor: 'rgba(192,57,43,.75)', borderRadius: 6 },
      { label: 'Kept', data: [59,67,72,77,83], backgroundColor: 'rgba(46,196,182,.4)', borderRadius: 6 }
    ]
  },
  options: { ...baseOpts, indexAxis: 'y', scales: { x: { stacked: true, ticks: tickOpts, grid: gridOpts, max: 100 }, y: { stacked: true, ticks: tickOpts, grid: { display: false } } }, plugins: { legend: legendOpts } }
});

// ADR by Season
makeChart('adrChart', {
  type: 'bar',
  data: {
    labels: ['Q1','Q2','Q3','Q4'],
    datasets: [
      { label: 'City Hotel', data: [85, 100, 115, 92], backgroundColor: 'rgba(46,196,182,.7)', borderRadius: 6 },
      { label: 'Resort Hotel', data: [76, 108, 138, 89], backgroundColor: 'rgba(224,160,80,.7)', borderRadius: 6 }
    ]
  },
  options: { ...baseOpts }
});

// Deposit Revenue
makeChart('depositChart', {
  type: 'doughnut',
  data: {
    labels: ['No Deposit', 'Non Refund', 'Refundable'],
    datasets: [{ data: [75.4, 22.3, 2.3], backgroundColor: [TEAL, RED, GOLD], borderWidth: 0, hoverOffset: 8 }]
  },
  options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { ...legendOpts, position: 'right' } } }
});

let edaChartsInit = false;
function initEdaCharts() {
  if (edaChartsInit) return;
  edaChartsInit = true;
  makeChart('edaSegChart', {
    type: 'doughnut',
    data: {
      labels: ['Online TA','Groups','Offline TA/TO','Direct','Corporate','Other'],
      datasets: [{ data: [47.4, 19.8, 11.4, 10.6, 6.5, 4.3], backgroundColor: [TEAL, RED, GOLD, BLUE, GREEN, '#9B59B6'], borderWidth: 0, hoverOffset: 8 }]
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '55%', plugins: { legend: { ...legendOpts, position: 'right' } } }
  });
  makeChart('edaMealChart', {
    type: 'bar',
    data: {
      labels: ['BB','HB','SC','Undefined','FB'],
      datasets: [{ label: 'Bookings', data: [77058, 14463, 10650, 1169, 798], backgroundColor: [TEAL, GOLD, BLUE, '#9B59B6', RED], borderRadius: 6 }]
    },
    options: { ...baseOpts, plugins: { legend: { display: false } } }
  });
  makeChart('stayDurChart', {
    type: 'bar',
    data: {
      labels: ['1','2','3','4','5','6','7','8+'],
      datasets: [{ label: 'Stays', data: [12400, 21000, 19800, 14200, 9100, 6300, 8900, 4200], backgroundColor: 'rgba(46,196,182,.65)', borderRadius: 4 }]
    },
    options: { ...baseOpts, plugins: { legend: { display: false } }, scales: { x: { title: { display: true, text: 'Nights', color: '#7A90A8' }, ticks: tickOpts, grid: { display: false } }, y: { ticks: tickOpts, grid: gridOpts } } }
  });
}

// ROC Curve
makeChart('rocChart', {
  type: 'line',
  data: {
    labels: [0,0.05,0.1,0.15,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1],
    datasets: [
      { label: 'RF (AUC=0.962)', data: [0,0.65,0.79,0.85,0.89,0.93,0.96,0.97,0.975,0.982,0.989,0.995,1], borderColor: TEAL, pointRadius: 0, tension: 0.4, borderWidth: 2.5 },
      { label: 'XGB (AUC=0.955)', data: [0,0.60,0.75,0.82,0.87,0.91,0.94,0.96,0.97,0.978,0.985,0.993,1], borderColor: '#E63946', pointRadius: 0, tension: 0.4, borderWidth: 2.5 },
      { label: 'DT (AUC=0.891)', data: [0,0.45,0.62,0.70,0.76,0.82,0.86,0.89,0.91,0.93,0.95,0.97,1], borderColor: BLUE, pointRadius: 0, tension: 0.4, borderWidth: 2 },
      { label: 'LR (AUC=0.871)', data: [0,0.38,0.55,0.64,0.70,0.76,0.80,0.84,0.87,0.90,0.93,0.96,1], borderColor: GOLD, pointRadius: 0, tension: 0.4, borderWidth: 2, borderDash: [5,3] },
      { label: 'Random', data: [0,0.05,0.1,0.15,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1], borderColor: 'rgba(255,255,255,.15)', pointRadius: 0, borderWidth: 1, borderDash: [4,4] }
    ]
  },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: legendOpts }, scales: { x: { title: { display: true, text: 'False Positive Rate', color: '#7A90A8' }, ticks: tickOpts, grid: gridOpts }, y: { title: { display: true, text: 'True Positive Rate', color: '#7A90A8' }, ticks: tickOpts, grid: gridOpts, min: 0, max: 1 } } }
});

// ── RF FEATURE IMPORTANCE ──
const rfFeatures = [
  { name: 'lead_time', val: 0.186 },
  { name: 'deposit_type', val: 0.142 },
  { name: 'adr', val: 0.098 },
  { name: 'total_of_special_requests', val: 0.088 },
  { name: 'country', val: 0.075 },
  { name: 'market_segment', val: 0.072 },
  { name: 'agent', val: 0.065 },
  { name: 'previous_cancellations', val: 0.058 },
  { name: 'is_repeated_guest', val: 0.052 },
  { name: 'booking_changes', val: 0.044 }
];
const rfDiv = document.getElementById('rfImportance');
rfFeatures.forEach(f => {
  rfDiv.innerHTML += `
    <div class="imp-bar">
      <div class="imp-lbl">${f.name}</div>
      <div class="imp-track"><div class="imp-fill" style="width:${f.val / 0.186 * 100}%"></div></div>
      <div class="imp-val">${(f.val * 100).toFixed(1)}%</div>
    </div>`;
});

// ── LIVE PREDICTOR ──
window.doPrediction = () => {
  const lead = +document.getElementById('f_lead').value;
  const deposit = +document.getElementById('f_deposit').value;
  const segment = +document.getElementById('f_segment').value;
  const prev = +document.getElementById('f_prev').value;
  const req = +document.getElementById('f_req').value;
  const repeat = +document.getElementById('f_repeat').value;

  // Simulate RF scoring heuristic
  let risk = 0.18; // base cancel rate
  risk += lead > 120 ? 0.28 : lead > 60 ? 0.12 : 0;
  risk += deposit === 1 ? 0.45 : deposit === 2 ? -0.05 : 0;
  risk += segment === 2 ? 0.12 : segment === 4 ? 0.08 : segment === 0 ? -0.08 : 0;
  risk += prev > 0 ? 0.15 : 0;
  risk -= req * 0.04;
  risk -= repeat ? 0.18 : 0;
  risk = Math.max(0.01, Math.min(0.99, risk));

  const pct = Math.round(risk * 100);
  const color = risk > 0.6 ? RED : risk > 0.35 ? GOLD : TEAL;
  const label = risk > 0.6 ? 'HIGH RISK' : risk > 0.35 ? 'MEDIUM RISK' : 'LOW RISK';
  const badgeClass = risk > 0.6 ? 'rb-high' : risk > 0.35 ? 'rb-med' : 'rb-low';

  // Animate gauge
  const offset = 452 - (452 * risk);
  document.getElementById('predResult').innerHTML = `
    <div class="gauge-wrap">
      <svg class="gauge-svg" viewBox="0 0 160 160">
        <circle class="gauge-bg" cx="80" cy="80" r="72"/>
        <circle class="gauge-fill" id="gFill" cx="80" cy="80" r="72" stroke="${color}" style="stroke-dashoffset:452"/>
      </svg>
      <div class="gauge-center">
        <div class="gauge-pct" style="color:${color}" id="gPct">0%</div>
        <div class="gauge-sub">cancel risk</div>
      </div>
    </div>
    <div class="risk-badge ${badgeClass}">${label}</div>
    <div style="font-size:12px;color:var(--muted);max-width:240px">
      ${risk > 0.6 ? 'Intervention recommended: request confirmation 14 days before arrival.' : risk > 0.35 ? 'Monitor this booking. Consider a courtesy check-in call.' : 'Stable profile. Standard processing recommended.'}
    </div>`;

  setTimeout(() => {
    const fill = document.getElementById('gFill');
    const pctEl = document.getElementById('gPct');
    if (fill) fill.style.strokeDashoffset = offset;
    let c = 0;
    const t = setInterval(() => { c++; if (pctEl) pctEl.textContent = c + '%'; if (c >= pct) clearInterval(t); }, 12);
  }, 50);
};

// ── CHATBOT ──
const chatFab = document.getElementById('chatFab');
const chatWin = document.getElementById('chatWin');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMsgs = document.getElementById('chatMsgs');

chatFab.onclick = () => { chatWin.classList.toggle('open'); chatFab.textContent = chatWin.classList.contains('open') ? '✕' : '💬'; };
chatClose.onclick = () => { chatWin.classList.remove('open'); chatFab.textContent = '💬'; };

const KB = [
  { keys: ['cancel','cancellation','rate'], ans: 'The overall cancellation rate is <strong>37%</strong> (44,224 of 119,390 bookings). City Hotel cancels at 41.7% vs Resort at 27.8%. Non-Refund OTA bookings with lead >120 days hit ~99%.' },
  { keys: ['model','accuracy','ml','random forest','rf'], ans: 'The <strong>Random Forest</strong> (300 trees) is the production model: 93.2% accuracy, AUC 0.962. XGBoost follows at 91.8%. Logistic Regression provides a transparent 80.1% baseline.' },
  { keys: ['lead time','lead'], ans: '<strong>Lead time</strong> is the #1 feature. Mean=104 days, median=69 days. Bookings made >120 days ahead cancel at 2.3× the rate of same-week bookings.' },
  { keys: ['adr','rate','revenue','price'], ans: 'Mean ADR is <strong>€101.8</strong> (median €94.6). Resort hotels peak in summer (€138/night in Q3). City hotels are more stable at €85–115 year-round.' },
  { keys: ['repeat','loyal','loyalty'], ans: '<strong>Repeat guests</strong> cancel at only 15% vs 40% for new guests — a 25pp gap. Each new-to-repeat conversion reduces cancellation risk by 2.7×. Only 3.2% of bookings are repeat guests.' },
  { keys: ['cluster','segment','ota','group'], ans: 'k-Means (k=3) identified: <strong>Cluster A</strong> (32%, Loyal, ~15% cancel), <strong>Cluster B</strong> (47%, OTA Planners, ~68% cancel), <strong>Cluster C</strong> (21%, Corporate, ~18% cancel). Silhouette Score: 0.61.' },
  { keys: ['team','snipers','members'], ans: 'The <strong>Mohamed Wael</strong>: Gharieb (Lead/DB), Saad (SQL), El Kholy (Python/EDA), Wael (Orange/ML), Hesham (Dashboard). Supervised by Dr. Mohamed El Shafey at Military Technical College.' },
  { keys: ['special request','requests'], ans: 'Special requests are a powerful loyalty signal. Each additional request reduces cancel probability by ~8%. Guests with 3+ requests cancel at &lt;12% vs 40% for those with none.' }
];

function getBotResponse(msg) {
  const lower = msg.toLowerCase();
  for (const item of KB) {
    if (item.keys.some(k => lower.includes(k))) return item.ans;
  }
  return "I can answer questions about cancellation rates, ML model performance, feature importance, guest clusters, ADR trends, or Mohamed Wael. Try asking about 'cancellations' or 'the best model'.";
}

function addMsg(html, isUser) {
  const div = document.createElement('div');
  div.className = 'cmsg ' + (isUser ? 'usr' : 'bot');
  div.innerHTML = html;
  chatMsgs.appendChild(div);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function showTyping() {
  const d = document.createElement('div');
  d.className = 'chat-dots';
  d.id = 'typing';
  d.innerHTML = '<div class="chat-dot"></div><div class="chat-dot"></div><div class="chat-dot"></div>';
  chatMsgs.appendChild(d);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function sendMsg() {
  const val = chatInput.value.trim();
  if (!val) return;
  addMsg(val, true);
  chatInput.value = '';
  showTyping();
  setTimeout(() => {
    document.getElementById('typing')?.remove();
    addMsg(getBotResponse(val), false);
  }, 700 + Math.random() * 600);
}

chatSend.onclick = sendMsg;
chatInput.onkeypress = e => { if (e.key === 'Enter') sendMsg(); };
window.askSugg = (btn) => { chatInput.value = btn.textContent; sendMsg(); };
