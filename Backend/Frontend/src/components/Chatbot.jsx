import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';

// ─── System prompt — كل معلومات المشروع ─────────────────────────────────────
const SYSTEM_PROMPT = `You are SniperAI Analyst, an intelligent assistant embedded in the Hotel Intelligence Dashboard built by the Sniper Mohamed wael at Military Technical College (MTC), supervised by Dr. Mohamed El Shafey.

You have deep knowledge of every aspect of this project. Answer any question the user asks — whether about the data, models, database, EDA, team, recommendations, or general data science concepts related to the project.

## Project Overview
- Dataset: Hotel Booking Demand — 119,390 bookings (2015–2017), 32 features
- Goal: Predict hotel booking cancellations and provide actionable intelligence
- Overall cancellation rate: 37% (44,224 cancellations)

## Database
- 11 normalized relational tables (3NF)
- 10 analytical SQL views
- Tables: Bookings, Hotels, Guests, Agents, Companies, Countries, RoomTypes, MealPlans, MarketSegments, DepositTypes, ReservationStatus
- Tools: PostgreSQL / SQL Server

## EDA — 20 Key Questions
1. Missing values: children (4), country (488), agent (16,340), company (112,593)
2. Inconsistencies: ADR=0 with positive stays, agent/company NULL patterns
3. Outliers: ADR > €500, lead times > 700 days
4. Lead time: mean=104d, median=69d, max=737d
5. ADR distribution: mean=€101.8, median=€94.6, right-skewed
6. Stay duration: average 3.4 nights total
7. Market segment: Online TA (47%), Direct (21%), Corporate (15%), Groups (8%)
8. Meal plans: BB (Bed & Breakfast) dominates at 77%
9. City Hotel: 66% of bookings, Resort Hotel: 34%
10. Repeat guest rate: only 3.2% — cancels at 15% vs 40% for new guests
11. Previous cancellations: strong predictor — each adds ~12% cancel risk
12. Seasonal patterns: summer peaks (Jul-Aug), winter lows
13. Deposit type: No Deposit = 88%, Non-Refund = 10%, Refundable = 2%
14. Non-Refund bookings cancel at 99% — counterintuitive but confirmed
15. Special requests: each reduces cancel probability by ~8%
16. Booking changes: 1-2 changes reduce cancel risk; 3+ increases it
17. Waiting list: longer wait → higher cancel rate
18. Country: PRT (Portugal) top origin, high cancel rate from certain countries
19. Assigned vs reserved room: mismatches increase cancel rate
20. ADR by season: Resort peaks Q3 at €138, City stable €85-115

## ML Models
| Model | Accuracy | AUC-ROC | Notes |
|-------|----------|---------|-------|
| Random Forest (300 trees) | 93.2% | 0.962 | Production model — best overall |
| XGBoost | 91.8% | 0.948 | Strong but overfits slightly |
| Logistic Regression | 80.1% | 0.867 | Transparent baseline |
| Decision Tree | 84.3% | 0.891 | Interpretable, faster |

Top features (Random Forest importance):
1. lead_time (18.6%)
2. deposit_type (14.2%)
3. adr (9.8%)
4. total_of_special_requests (8.8%)
5. country (7.5%)
6. market_segment (7.2%)

## K-Means Clustering (k=3, Silhouette=0.61)
- Cluster A (32%): Loyal Guests — ~15% cancel, short lead, high special requests
- Cluster B (47%): OTA Planners — ~68% cancel, long lead, Non-Refund deposits
- Cluster C (21%): Corporate — ~18% cancel, stable ADR, repeat bookings

## Risk Segmentation
- LOW risk: < 40% cancel probability
- MEDIUM risk: 40–70%
- HIGH risk: > 70% — mainly Non-Refund + OTA + lead > 120d

## Key Recommendations
1. (HIGH) Overbooking buffer: +8% for Non-Refund OTA bookings with lead > 120d
2. (HIGH) Dynamic pricing: +15% ADR for high-risk segments to offset revenue loss
3. (MEDIUM) Loyalty program: target repeat conversion — each conversion saves ~€230 in lost revenue
4. (MEDIUM) Smart deposit policy: require refundable deposit for lead > 90d bookings
5. (STRATEGY) Real-time ML scoring: flag bookings at booking time, not day-of
6. (STRATEGY) Special request incentives: offer upgrade for guests adding requests — reduces cancel by 8% each

## Founder
- Supervised by: Dr. Mohamed El Shafey
- Institution: Military Technical College (MTC) & Ministry of Communications and Information Technology (MCIT)
- Founder name: Sniper Mohamed Wael
- Members worked on: SQL/DB design, EDA, Python ML pipeline, Orange ML, Dashboard

## Tech Stack
- Frontend: React + Vite, Chart.js, Framer Motion, Lucide icons
- Backend: FastAPI (Python), scikit-learn, pandas, joblib
- Database: PostgreSQL / SQL Server
- Deployment: Google App Engine
- ML: scikit-learn (LogisticRegression, RandomForest, DecisionTree), XGBoost

## Instructions
- Answer in the same language the user writes in (Arabic or English)
- Be concise but complete — use numbers and percentages when relevant
- If asked about something outside the project, you can answer general data science / ML questions
- Format your answers clearly — use bullet points or bold when it helps readability
- Keep responses under 200 words unless the question requires more detail
- Never make up statistics not listed above`;

const SUGGESTIONS = [
  'Cancellation rate?',
  'Best ML model?',
  'Top risk factors?',
  'Cluster analysis?',
  'ADR insights?',
  'Recommendations?',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm SniperAI Analyst 🎯 I have full knowledge of this project — dataset, models, EDA, database, and recommendations. Ask me anything!", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  // keep full conversation history for context
  const historyRef = useRef([]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const callClaude = async (userText) => {
    // add to history
    historyRef.current.push({ role: 'user', content: userText });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: historyRef.current,
      }),
    });

    if (!response.ok) throw new Error(`API error ${response.status}`);

    const data = await response.json();
    const reply = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    // save assistant reply to history
    historyRef.current.push({ role: 'assistant', content: reply });

    return reply;
  };

  const handleSend = async (text = input) => {
    const val = text.trim();
    if (!val || isTyping) return;

    setMessages(prev => [...prev, { text: val, isBot: false }]);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await callClaude(val);
      setMessages(prev => [...prev, { text: reply, isBot: true, isMarkdown: true }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        text: `⚠️ Connection error: ${err.message}. Make sure the API is reachable.`,
        isBot: true,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // simple markdown → html for bold, bullet points
  const renderText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* FAB */}
      <div
        className="chat-fab"
        onClick={() => setIsOpen(o => !o)}
        title="SniperAI Analyst"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </div>

      {/* Window */}
      <div className={`chat-win ${isOpen ? 'open' : ''}`}>

        {/* Header */}
        <div className="chat-hdr">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg,var(--teal),var(--teal2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Bot size={18} color="#04080F" />
            </div>
            <div>
              <div className="chat-hdr-name">SniperAI Analyst</div>
            </div>
          </div>
          <button className="chat-close" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-msgs" ref={scrollRef}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`cmsg ${m.isBot ? 'bot' : 'usr'}`}
              {...(m.isMarkdown || m.isHtml
                ? { dangerouslySetInnerHTML: { __html: m.isMarkdown ? renderText(m.text) : m.text } }
                : { children: m.text }
              )}
            />
          ))}
          {isTyping && (
            <div className="chat-dots">
              <div className="chat-dot" />
              <div className="chat-dot" />
              <div className="chat-dot" />
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="chat-suggs">
          {SUGGESTIONS.map(s => (
            <div key={s} className="sugg" onClick={() => handleSend(s)}>{s}</div>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <input
            className="chat-input"
            type="text"
            placeholder="Ask anything about this project..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isTyping}
          />
          <button
            className="chat-send"
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            style={{ opacity: (isTyping || !input.trim()) ? .5 : 1 }}
          >
            <Send size={18} />
          </button>
        </div>

      </div>
    </>
  );
}
