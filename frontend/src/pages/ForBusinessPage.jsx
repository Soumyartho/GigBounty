import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer, cardHover, buttonHover, buttonTap, useScrollRevealProps } from '../lib/motion';

const sectionContainer = staggerContainer(0.1, 0.1);
const cardVariant = fadeUp(24);

export default function ForBusinessPage() {
  const navigate = useNavigate();
  const scrollProps = useScrollRevealProps();
  const prefersReduced = useReducedMotion();

  return (
    <div className="page-business">
      {/* Hero */}
      <section className="biz-hero">
        <div className="container">
          <motion.span className="about-hero-badge" variants={fadeUp(12)} {...scrollProps}>
            B2B INTEGRATION
          </motion.span>
          <motion.h1 variants={fadeUp(20)} {...scrollProps}>
            Integrate <span className="text-highlight">GigBounty</span> Into Your Platform
          </motion.h1>
          <motion.p className="about-hero-subtitle" variants={fadeUp(20)} {...scrollProps}>
            Reduce fraud, automate verification, and handle payments through blockchain —
            all via a simple plugin your developers can integrate in hours.
          </motion.p>
          <motion.div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'center' }} variants={fadeUp(24)} {...scrollProps}>
            <motion.button className="btn btn-primary" whileHover={prefersReduced ? {} : buttonHover} whileTap={prefersReduced ? {} : buttonTap}>
              Request Demo
            </motion.button>
            <motion.button className="btn btn-secondary" whileHover={prefersReduced ? {} : buttonHover} whileTap={prefersReduced ? {} : buttonTap}>
              View API Docs
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="biz-pain">
        <div className="container">
          <motion.h2 variants={fadeUp(16)} {...scrollProps}>The Problems We Solve</motion.h2>
          <motion.div className="pain-grid" variants={sectionContainer} {...scrollProps}>
            {[
              { title: 'Payment Disputes', stat: '$2.8B', desc: 'Lost annually in freelancing payment disputes. Our escrow eliminates this entirely.', bg: '#DBEAFE', border: '#93C5FD' },
              { title: 'Fraudulent Submissions', stat: '23%', desc: 'Of freelancing deliverables fail quality checks. Our AI catches these automatically.', bg: '#EDE9FE', border: '#C4B5FD' },
              { title: 'Slow Payouts', stat: '14 days', desc: 'Average payout delay on major platforms. We release payments in 4 seconds.', bg: '#FEF3C7', border: '#FCD34D' },
              { title: 'Platform Losses', stat: '8-15%', desc: 'Revenue lost to chargebacks and disputes. GigBounty reduces this to near-zero.', bg: '#D1FAE5', border: '#6EE7B7' },
            ].map((item, i) => (
              <motion.div className="pain-card" key={i} variants={cardVariant} whileHover={prefersReduced ? {} : cardHover} style={{ backgroundColor: item.bg, borderColor: item.border }}>
                <div className="pain-stat">{item.stat}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How Plugin Works */}
      <section className="biz-flow">
        <div className="container">
          <motion.h2 variants={fadeUp(16)} {...scrollProps}>How the Plugin Works</motion.h2>
          <motion.p className="section-subtitle" variants={fadeUp(16)} {...scrollProps}>
            Four steps. One API. Zero payment headaches.
          </motion.p>
          <motion.div className="flow-steps" variants={sectionContainer} {...scrollProps}>
            {[
              {
                step: '1', title: 'Worker Submits',
                desc: 'Worker submits their deliverable through your platform. GigBounty receives the submission via API.',
                bg: '#DBEAFE', border: '#93C5FD',
                icon: (
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                    <path d="M14 36V12C14 10.3 15.3 9 17 9H31C32.7 9 34 10.3 34 12V36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <polyline points="14 36 24 42 34 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <line x1="20" y1="18" x2="28" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="20" y1="24" x2="28" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="20" y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                step: '2', title: 'AI Verifies',
                desc: 'Our AI analyzes the submission — checks code, evaluates design, reads documentation. Pass/fail verdict issued.',
                bg: '#EDE9FE', border: '#C4B5FD',
                icon: (
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
                    <path d="M18 24L22 28L30 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                step: '3', title: 'AI Prices It',
                desc: 'Based on quality, complexity, and scope, the AI suggests a fair price. The poster reviews and decides.',
                bg: '#FEF3C7', border: '#FCD34D',
                icon: (
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
                    <path d="M20 20C20 18 22 16 24 16C26 16 28 18 28 20C28 22 26 22 24 23V26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <circle cx="24" cy="31" r="1.5" fill="currentColor" />
                  </svg>
                ),
              },
              {
                step: '4', title: 'Instant Payout',
                desc: 'Payment is released from the Algorand escrow to the worker\'s wallet in 4 seconds. Verifiable on-chain.',
                bg: '#D1FAE5', border: '#6EE7B7',
                icon: (
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                    <rect x="8" y="14" width="32" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
                    <line x1="8" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth="2" />
                    <path d="M24 28V32M20 30H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
              },
            ].map((item) => (
              <motion.div className="flow-step" key={item.step} variants={cardVariant} whileHover={prefersReduced ? {} : cardHover} style={{ backgroundColor: item.bg, borderColor: item.border }}>
                <div className="flow-step-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="biz-pricing">
        <div className="container">
          <motion.h2 variants={fadeUp(16)} {...scrollProps}>Simple Pricing</motion.h2>
          <motion.div className="pricing-card" variants={fadeUp(24)} {...scrollProps}>
            <div className="pricing-header">
              <span className="pricing-percent">3%</span>
              <span className="pricing-label">per transaction</span>
            </div>
            <ul className="pricing-features">
              <li>✅ AI work verification included</li>
              <li>✅ AI price suggestion engine</li>
              <li>✅ Blockchain escrow & instant payouts</li>
              <li>✅ Transaction-level audit trail</li>
              <li>✅ REST API with full documentation</li>
              <li>✅ Dashboard for monitoring</li>
              <li>❌ No monthly fees</li>
              <li>❌ No setup costs</li>
            </ul>
            <motion.button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '24px' }}
              whileHover={prefersReduced ? {} : buttonHover}
              whileTap={prefersReduced ? {} : buttonTap}
            >
              Request Integration →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Code Example */}
      <section className="biz-code">
        <div className="container">
          <motion.h2 variants={fadeUp(16)} {...scrollProps}>Quick Integration</motion.h2>
          <motion.p className="section-subtitle" variants={fadeUp(16)} {...scrollProps}>
            Just a few API calls to get started.
          </motion.p>
          <motion.div className="code-block" variants={fadeUp(24)} {...scrollProps}>
            <div className="code-header">
              <span className="code-dot" style={{ background: '#F97316' }} />
              <span className="code-dot" style={{ background: '#FACC15' }} />
              <span className="code-dot" style={{ background: '#A3E635' }} />
              <span className="code-title">integration.js</span>
            </div>
            <pre><code>{`// 1. Submit work for AI verification
const result = await fetch('https://api.gigbounty.io/verify', {
  method: 'POST',
  body: JSON.stringify({
    task_id: 'TASK_001',
    proof_url: 'https://github.com/user/repo',
    deliverable_type: 'code'
  })
});

// 2. AI returns verdict + suggested price
// { verdict: "PASS", score: 0.92, suggested_price: 15.5 }

// 3. Release payment from escrow
await fetch('https://api.gigbounty.io/release', {
  method: 'POST',
  body: JSON.stringify({
    task_id: 'TASK_001',
    amount: 15.5  // or poster's custom amount
  })
});
// Payment arrives in worker's wallet in ~4 seconds`}</code></pre>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.h2 variants={fadeUp(16)} {...scrollProps}>Ready to Eliminate Payment Fraud?</motion.h2>
          <motion.p className="section-subtitle" variants={fadeUp(16)} {...scrollProps}>
            Join the freelancing platforms that trust GigBounty.
          </motion.p>
          <motion.div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }} variants={fadeUp(20)} {...scrollProps}>
            <motion.button className="btn btn-primary" whileHover={prefersReduced ? {} : buttonHover} whileTap={prefersReduced ? {} : buttonTap}>
              Schedule a Call
            </motion.button>
            <motion.button className="btn btn-secondary" onClick={() => navigate('/about')} whileHover={prefersReduced ? {} : buttonHover} whileTap={prefersReduced ? {} : buttonTap}>
              Learn More →
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
