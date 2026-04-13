import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Search, 
  LayoutDashboard, 
  BrainCircuit, 
  Lightbulb,
  CheckCircle2,
  XCircle,
  Euro,
  Hotel,
  Repeat,
  AlertTriangle
} from 'lucide-react';

import Predictor from './components/Predictor';
import Chatbot from './components/Chatbot';
import { 
  MonthlyTrend, 
  CancelBySegment, 
  ADRBySeason, 
  DepositRevenue,
  ROCChart,
  EDAMeal,
  EDASegment,
  StayDur
} from './components/Charts';
import { Database, MLModels, RecommendationsList } from './components/Sections';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [edaTab, setEdaTab] = useState('quality');
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [filterHotel, setFilterHotel] = useState('All Hotels');
  const [filterYear, setFilterYear] = useState('2015-2017');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
    setActiveTab(id);
  };

  // --- Filtering Logic (Simulated for Demo) ---
  const getFilteredMonthlyTrend = () => {
    const isCity = filterHotel === 'City Hotel';
    const isResort = filterHotel === 'Resort Hotel';
    const isAll = filterHotel === 'All Hotels';

    let cityData = [2800,2500,4200,5800,6100,7200,9100,8400,6300,4200,3100,3800];
    let resortData = [1200,1100,2300,3500,4200,5100,7800,6900,4100,2300,1800,2100];

    // Simulate year filtering (rough scaling)
    const yearScale = filterYear === '2015' ? 0.3 : filterYear === '2016' ? 0.45 : filterYear === '2017' ? 0.25 : 1;
    cityData = cityData.map(v => Math.round(v * yearScale));
    resortData = resortData.map(v => Math.round(v * yearScale));

    return {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        { label: 'City Hotel', data: isResort ? [] : cityData, borderColor: '#2DD4BF', backgroundColor: 'rgba(45,212,191,.1)', fill: true, tension: 0.4, pointRadius: 3 },
        { label: 'Resort Hotel', data: isCity ? [] : resortData, borderColor: '#F59E0B', backgroundColor: 'rgba(245,158,11,.1)', fill: true, tension: 0.4, pointRadius: 3 }
      ]
    };
  };

  const getFilteredCancelBySegment = () => {
    // Online TA, Offline TA, Groups, Corporate, Direct
    let cancels = [41, 33, 28, 23, 17];
    let kept = [59, 67, 72, 77, 83];
    
    if (filterHotel === 'Resort Hotel') {
      cancels = [25, 20, 15, 12, 10]; kept = [75, 80, 85, 88, 90];
    } else if (filterHotel === 'City Hotel') {
      cancels = [55, 45, 40, 35, 25]; kept = [45, 55, 60, 65, 75];
    }

    return {
      labels: ['Online TA','Offline TA','Groups','Corporate','Direct'],
      datasets: [
        { label: 'Cancelled', data: cancels, backgroundColor: 'rgba(239,68,68,.75)', borderRadius: 6 },
        { label: 'Kept', data: kept, backgroundColor: 'rgba(45,212,191,.4)', borderRadius: 6 }
      ]
    };
  };

  // --- Dynamic KPI values ---
  const getKPIValue = (label) => {
    const yearScale = filterYear === '2015' ? 0.3 : filterYear === '2016' ? 0.45 : filterYear === '2017' ? 0.25 : 1;
    const hotelScale = filterHotel === 'City Hotel' ? 0.66 : filterHotel === 'Resort Hotel' ? 0.34 : 1;
    const combinedScale = yearScale * hotelScale;

    switch(label) {
      case 'Total Bookings': return Math.round(119390 * combinedScale).toLocaleString();
      case 'Cancellation Rate': 
        if (filterHotel === 'City Hotel') return '41.7%';
        if (filterHotel === 'Resort Hotel') return '27.8%';
        return '37.0%';
      case 'Mean ADR': 
        if (filterHotel === 'City Hotel') return '€105.3';
        if (filterHotel === 'Resort Hotel') return '€94.9';
        return '€101.8';
      case 'High-Risk Bookings': return Math.round(3290 * combinedScale).toLocaleString();
      default: return '0';
    }
  };

  const getADRBySeasonData = () => {
    let cityData = [85, 100, 115, 92];
    let resortData = [76, 108, 138, 89];
    const isCity = filterHotel === 'City Hotel';
    const isResort = filterHotel === 'Resort Hotel';

    return {
      labels: ['Q1','Q2','Q3','Q4'],
      datasets: [
        { label: 'City Hotel', data: isResort ? [] : cityData, backgroundColor: 'rgba(45,212,191,.7)', borderRadius: 6 },
        { label: 'Resort Hotel', data: isCity ? [] : resortData, backgroundColor: 'rgba(245,158,11,.7)', borderRadius: 6 }
      ]
    };
  };

  const getDepositRevenueData = () => {
    let data = [75.4, 22.3, 2.3]; // No Deposit, Non Refund, Refundable
    if (filterHotel === 'City Hotel') data = [68.2, 30.1, 1.7];
    if (filterHotel === 'Resort Hotel') data = [88.5, 8.2, 3.3];

    return {
      labels: ['No Deposit', 'Non Refund', 'Refundable'],
      datasets: [{ data: data, backgroundColor: ['#2DD4BF', '#EF4444', '#F59E0B'], borderWidth: 0, hoverOffset: 8 }]
    };
  };

  return (
    <div className="app-root">
      {/* TOPBAR */}
      <nav className={`topbar ${scrolled ? 'scrolled' : ''}`}>
        <a className="tb-brand" href="#overview" onClick={(e) => { e.preventDefault(); scrollTo('overview'); }}>
          <svg className="snipers-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="36" height="36">
            <circle cx="22" cy="22" r="19" fill="none" stroke="#2EC4B6" strokeWidth="1.8" />
            <circle cx="22" cy="22" r="10" fill="none" stroke="#2EC4B6" strokeWidth="1.2" />
            <circle cx="22" cy="22" r="3" fill="#E0A050" />
            <line x1="22" y1="2" x2="22" y2="11.5" stroke="#2EC4B6" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="22" y1="32.5" x2="22" y2="42" stroke="#2EC4B6" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="2" y1="22" x2="11.5" y2="22" stroke="#2EC4B6" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="32.5" y1="22" x2="42" y2="22" stroke="#2EC4B6" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <span className="tb-title">Hotel <em>Intelligence</em></span>
        </a>
        <div className="tb-nav">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'workflow', label: 'Workflow' },
            { id: 'database', label: 'Database' },
            { id: 'eda', label: 'EDA' },
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'ml', label: 'ML Models' },
            { id: 'recommendations', label: 'Recommendations' }
          ].map(nav => (
            <button 
              key={nav.id} 
              className={`nb ${activeTab === nav.id ? 'active' : ''}`}
              onClick={() => scrollTo(nav.id)}
            >
              {nav.label}
            </button>
          ))}
        </div>
        <div className="tb-right">
          <div className="time-display" style={{fontFamily:'var(--font-m)', fontSize:11, color: 'var(--teal2)', marginRight: 20}}>
            {time} <span style={{opacity:0.5, marginLeft:4}}>SYS_OK</span>
          </div>
          <span className="pill">Mohamed Wael</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="overview">
        <div className="hero-bg"></div>
        <div className="hero-blob1"></div>
        <div className="hero-blob2"></div>
        <div className="hero-inner">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="hero-tag"><span className="dot"></span>DATA MINING & VISUALIZATION — MTC</div>
            <h1>Hotel Reservation &<br /><span>Billing Intelligence</span></h1>
            <p className="hero-sub">
              A comprehensive end-to-end data mining project by Mohamed Wael. 
              We engineered a production-grade relational database, performed a 20-question EDA on 119,390 bookings, 
              and built predictive ML models — supervised by Dr. Mohamed El Shafey.
            </p>
            <div className="hero-stats">
              <div className="hs-item">
                <div className="hs-val">119,390</div>
                <div className="hs-lbl">Booking Records</div>
              </div>
              <div className="hs-item">
                <div className="hs-val">0.962</div>
                <div className="hs-lbl">Best AUC</div>
              </div>
              <div className="hs-item">
                <div className="hs-val">0.962</div>
                <div className="hs-lbl">Best AUC</div>
              </div>
              <div className="hs-item">
                <div className="hs-val">37%</div>
                <div className="hs-lbl">Cancel Rate</div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="hero-side"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-stat-card">
              <div className="val">93.2%</div>
              <div className="lbl">Random Forest Accuracy</div>
            </div>
            <div className="hero-stat-card">
              <div className="val">10</div>
              <div className="lbl">Analytical Views</div>
            </div>
            <div className="hero-stat-card">
              <div className="val">k=3</div>
              <div className="lbl">Guest Behavioral Clusters</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FILTERS */}
      <div className="filters">
        <span className="fl">Filter Dashboard:</span>
        <div className="fg">
          {['All Hotels', 'City Hotel', 'Resort Hotel'].map(h => (
            <button 
              key={h} 
              className={`chip ${filterHotel === h ? 'active' : ''}`}
              onClick={() => setFilterHotel(h)}
            >
              {h}
            </button>
          ))}
        </div>
        <div className="fsep"></div>
        <div className="fg">
          {['2015-2017', '2015', '2016', '2017'].map(y => (
            <button 
              key={y} 
              className={`chip ${filterYear === y ? 'active' : ''}`}
              onClick={() => setFilterYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <main className="main">


        {/* PROJECT WORKFLOW */}
        <motion.section
          className="sec"
          id="workflow"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <span className="sec-tag">PROJECT METHODOLOGY</span>
          <h2 className="sec-title">End-to-End Workflow</h2>
          <p className="sec-sub">A structured 5-phase data mining pipeline from raw data to deployed intelligence.</p>

          <div className="workflow-grid">
            {[
              {
                phase: '01',
                title: 'Data Collection & Storage',
                icon: '🗄️',
                color: 'var(--teal)',
                tools: ['PostgreSQL', 'SQL Server', 'ERD Design'],
                steps: ['Ingested 119,390 booking records', '11 normalized relational tables', '10 analytical SQL views', 'Referential integrity enforced'],
              },
              {
                phase: '02',
                title: 'Data Preprocessing',
                icon: '🧹',
                color: 'var(--blue)',
                tools: ['pandas', 'NumPy', 'scikit-learn'],
                steps: ['Handled missing values (children, country, agent)', 'Removed ADR outliers > €5,500', 'Dropped zero-guest records', 'Label encoded 8 categorical features'],
              },
              {
                phase: '03',
                title: 'Exploratory Data Analysis',
                icon: '🔍',
                color: 'var(--gold)',
                tools: ['matplotlib', 'seaborn', 'Plotly'],
                steps: ['20 analytical questions answered', 'Univariate & bivariate analysis', 'Correlation heatmaps', 'Seasonal & segment patterns'],
              },
              {
                phase: '04',
                title: 'ML Model Development',
                icon: '🤖',
                color: 'var(--violet)',
                tools: ['scikit-learn', 'XGBoost', 'joblib'],
                steps: ['4 supervised models trained', 'Logistic Regression baseline', 'Random Forest — 93.2% accuracy', 'K-Means clustering (k=3)'],
              },
              {
                phase: '05',
                title: 'API & Deployment',
                icon: '🚀',
                color: 'var(--green)',
                tools: ['FastAPI', 'React', 'Google App Engine'],
                steps: ['RESTful prediction API built', 'Vite + React frontend', 'Live cancellation risk calculator', 'Deployed on Google Cloud'],
              },
            ].map((w, i) => (
              <motion.div
                key={i}
                className="wf-card"
                variants={fadeInUp}
                custom={i}
              >
                <div className="wf-phase-line" style={{ background: w.color }} />
                <div className="wf-top">
                  <span className="wf-phase-num" style={{ color: w.color }}>{w.phase}</span>
                  <span className="wf-icon">{w.icon}</span>
                </div>
                <h3 className="wf-title">{w.title}</h3>
                <ul className="wf-steps">
                  {w.steps.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ul>
                <div className="wf-tools">
                  {w.tools.map((t, j) => (
                    <span key={j} className="wf-tool" style={{ borderColor: w.color + '55', color: w.color }}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <Database />

        {/* EDA SECTION */}
        <motion.section 
          className="sec" 
          id="eda"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <span className="sec-tag">EXPLORATORY DATA ANALYSIS</span>
          <h2 className="sec-title">EDA Gallery — 20 Questions</h2>
          <p className="sec-sub">Full Appendix B analysis: data quality, univariate, bivariate, and multivariate.</p>

          <div className="eda-tabs">
            <button className={`eda-tab ${edaTab === 'quality' ? 'active' : ''}`} onClick={() => setEdaTab('quality')}>Data Quality</button>
            <button className={`eda-tab ${edaTab === 'distributions' ? 'active' : ''}`} onClick={() => setEdaTab('distributions')}>Distributions</button>
            <button className={`eda-tab ${edaTab === 'categorical' ? 'active' : ''}`} onClick={() => setEdaTab('categorical')}>Categorical</button>
          </div>

          <div className="eda-content">
            {edaTab === 'quality' && (
              <motion.div className="g3" initial={{opacity:0}} animate={{opacity:1}}>
                <div className="card plot-card">
                  <div className="plot-hdr"><span className="plot-ttl">Missing Values & Violations</span><span className="cbadge teal">Q1</span></div>
                  <img className="plot-img" src="/assets/eda/q1.png" alt="Missing Values" />
                  <p className="plot-cap">Analysis of missing values across all dataset features. Children and Country columns had the most nulls.</p>
                </div>
                <div className="card plot-card">
                  <div className="plot-hdr"><span className="plot-ttl">Data Inconsistencies</span><span className="cbadge teal">Q2</span></div>
                  <img className="plot-img" src="/assets/eda/q2.png" alt="Inconsistencies" />
                  <p className="plot-cap">Structural errors: e.g., ADR = 0 with positive nights, and agent/company NULL patterns.</p>
                </div>
                <div className="card plot-card">
                  <div className="plot-hdr"><span className="plot-ttl">Outlier Detection</span><span className="cbadge teal">Q3</span></div>
                  <img className="plot-img" src="/assets/eda/q3.png" alt="Outliers" />
                  <p className="plot-cap">Boxplots highlighting extreme ADR values (&gt;€500) and lead times (&gt;700 days).</p>
                </div>
              </motion.div>
            )}
            {edaTab === 'distributions' && (
              <motion.div className="g3" initial={{opacity:0}} animate={{opacity:1}}>
                <div className="card plot-card">
                  <div className="plot-hdr"><span className="plot-ttl">ADR Distribution</span><span className="cbadge teal">Q5</span></div>
                  <img className="plot-img" src="/assets/eda/q5.png" alt="ADR" />
                </div>
                <div className="card">
                  <div className="card-hdr"><span className="card-ttl">Lead Time Stats</span><span className="cbadge teal">Q4</span></div>
                  <ul className="feat-list" style={{marginTop:8}}>
                    <li>Mean lead time: <strong>104 days</strong></li>
                    <li>Median: <strong>69 days</strong></li>
                    <li>75th percentile: <strong>160 days</strong></li>
                    <li>Max: <strong>737 days</strong></li>
                  </ul>
                </div>
                <div className="card">
                  <div className="card-hdr"><span className="card-ttl">Stay Duration</span><span className="cbadge teal">Q6</span></div>
                  <div style={{height:180}}><StayDur /></div>
                </div>
              </motion.div>
            )}
            {edaTab === 'categorical' && (
              <motion.div className="g2" initial={{opacity:0}} animate={{opacity:1}}>
                <div className="card">
                  <div className="card-hdr"><span className="card-ttl">Market Segment Breakdown</span><span className="cbadge teal">Q7</span></div>
                  <div style={{height:220}}><EDASegment /></div>
                </div>
                <div className="card">
                  <div className="card-hdr"><span className="card-ttl">Meal Plan Popularity</span><span className="cbadge teal">Q8</span></div>
                  <div style={{height:220}}><EDAMeal /></div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* DASHBOARD SECTION */}
        <section className="sec" id="dashboard">
          <span className="sec-tag">EXECUTIVE INTELLIGENCE</span>
          <h2 className="sec-title">Live KPI Dashboard</h2>
          <p className="sec-sub">Verified metrics from the hotel booking dataset (2015–2017).</p>

          <motion.div 
            className="kpi-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { l: 'Total Bookings', v: getKPIValue('Total Bookings'), d: '2015–2017', i: <BarChart3 />, c: 'k-navy' },
              { l: 'Cancellation Rate', v: getKPIValue('Cancellation Rate'), d: '44,224 lost', i: <XCircle />, c: 'k-red' },
              { l: 'Mean ADR', v: getKPIValue('Mean ADR'), d: 'Median: €94.6', i: <Euro />, c: 'k-amber' },
              { l: 'City Hotel Share', v: filterHotel === 'Resort Hotel' ? '0%' : '66%', d: 'vs 34% Resort', i: <Hotel />, c: 'k-teal' },
              { l: 'Repeat Guest Rate', v: '3.2%', d: 'Cancel: 15% vs 40%', i: <Repeat />, c: 'k-green' },
              { l: 'High-Risk Bookings', v: `~${getKPIValue('High-Risk Bookings')}`, d: 'Lead&gt;120d + Non-Refund', i: <AlertTriangle />, c: 'k-red' }
            ].map((k, i) => (
              <motion.div key={i} className={`card kpi ${k.c}`} variants={fadeInUp}>
                <div className="kpi-icon" style={{color: 'rgba(255,255,255,0.7)'}}>{k.i}</div>
                <div className="kpi-val">{k.v}</div>
                <div className="kpi-lbl">{k.l}</div>
                <div className="kpi-delta">{k.d}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="g2" style={{marginTop:24}}>
            <div className="card plot-card">
              <div className="chart-title">Monthly Booking Trend by Hotel Type</div>
              <div className="chart-wrap"><MonthlyTrend data={getFilteredMonthlyTrend()} /></div>
            </div>
            <div className="card plot-card">
              <div className="chart-title">Cancellation Rate by Market Segment</div>
              <div className="chart-wrap"><CancelBySegment data={getFilteredCancelBySegment()} /></div>
            </div>
          </div>

          <div className="g2" style={{marginTop:24}}>
            <div className="card plot-card">
              <div className="chart-title">ADR by Hotel Type & Season</div>
              <div className="chart-wrap"><ADRBySeason data={getADRBySeasonData()} /></div>
            </div>
            <div className="card plot-card">
              <div className="chart-title">Revenue by Deposit Type</div>
              <div className="chart-wrap"><DepositRevenue data={getDepositRevenueData()} /></div>
            </div>
          </div>
        </section>

        <MLModels />

        <section className="sec" id="predictor">
           <h3 style={{fontFamily:'var(--font-d)', fontSize:'1.4rem', color:'var(--white)', marginBottom:16}}>🎯 Live Cancellation Risk Calculator</h3>
           <Predictor />
        </section>

        <section className="sec" id="analytics">
          <div className="g2">
            <div className="card">
              <div className="card-hdr"><span className="card-ttl">🌲 Random Forest — Feature Importance</span></div>
              <div style={{marginTop:8}}>
                {[
                  { n: 'lead_time', v: '18.6%' },
                  { n: 'deposit_type', v: '14.2%' },
                  { n: 'adr', v: '9.8%' },
                  { n: 'special_requests', v: '8.8%' },
                  { n: 'country', v: '7.5%' },
                  { n: 'market_segment', v: '7.2%' }
                ].map((f, i) => (
                  <div key={i} className="imp-bar">
                    <div className="imp-lbl">{f.n}</div>
                    <div className="imp-track"><motion.div className="imp-fill" initial={{width:0}} whileInView={{width: f.v}} viewport={{once:true}} transition={{duration:1, delay:i*0.1}}></motion.div></div>
                    <div className="imp-val">{f.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-hdr"><span className="card-ttl">📊 ROC Curve Comparison</span></div>
              <div style={{height:260}}><ROCChart /></div>
            </div>
          </div>
        </section>

        <RecommendationsList />

      </main>

      <footer>
        <p>&copy; 2026 Hotel Intelligence — <strong>Mohamed Wael</strong> | Military Technical College</p>
        <p style={{fontSize:11, marginTop:8, opacity:0.6}}>Supervised by Dr. Mohamed El Shafey</p>
      </footer>

      <Chatbot />
    </div>
  );
}
