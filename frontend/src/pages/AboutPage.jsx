import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer, cardHover, buttonHover, buttonTap, useScrollRevealProps } from '../lib/motion';

const sectionContainer = staggerContainer(0.1, 0.1);
const cardVariant = fadeUp(24);

export default function AboutPage() {
  const navigate = useNavigate();
  const scrollProps = useScrollRevealProps();
  const prefersReduced = useReducedMotion();

  return (
    <div className="page-about">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <motion.span className="about-hero-badge" variants={fadeUp(12)} {...scrollProps}>
            TWO MODELS, ONE MISSION
          </motion.span>
          <motion.h1 variants={fadeUp(20)} {...scrollProps}>
            Redefining <span className="text-highlight">Fair Pay</span> in Freelancing
          </motion.h1>
          <motion.p className="about-hero-subtitle" variants={fadeUp(20)} {...scrollProps}>
            GigBounty combines blockchain-secured escrow with AI-powered work verification 
            to eliminate payment disputes — for individuals and platforms alike.
          </motion.p>
        </div>
      </section>

      {/* Two Business Models */}
      <section className="about-models">
        <div className="container">
          <motion.h2 variants={fadeUp(16)} {...scrollProps}>Two Ways to Use GigBounty</motion.h2>
          <motion.div className="models-grid" variants={sectionContainer} {...scrollProps}>
            {/* B2C */}
            <motion.div className="model-card" variants={cardVariant} whileHover={prefersReduced ? {} : cardHover}>
              <div className="model-icon" style={{ background: '#D1FAE5' }}>🎯</div>
              <span className="model-label">FOR FREELANCERS</span>
              <h3>Bounty Board</h3>
              <p>
                Post tasks with ALGO bounties, claim work, submit proof, and get paid instantly — 
                no middlemen, no payment delays, no disputes.
              </p>
              <ul className="model-features">
                <li>✅ Escrow-locked payments</li>
                <li>✅ Instant payout on approval</li>
                <li>✅ AI-assisted work verification</li>
                <li>✅ Transaction-level transparency</li>
              </ul>
              <motion.button
                className="btn btn-primary"
                onClick={() => navigate('/tasks')}
                whileHover={prefersReduced ? {} : buttonHover}
                whileTap={prefersReduced ? {} : buttonTap}
              >
                Browse Bounties →
              </motion.button>
            </motion.div>

            {/* B2B */}
            <motion.div className="model-card" variants={cardVariant} whileHover={prefersReduced ? {} : cardHover}>
              <div className="model-icon" style={{ background: '#DBEAFE' }}>🔌</div>
              <span className="model-label">FOR PLATFORMS</span>
              <h3>Plugin Integration</h3>
              <p>
                Freelancing platforms integrate GigBounty as a plugin — we handle AI verification, 
                price suggestions, and blockchain payments so you don't have to.
              </p>
              <ul className="model-features">
                <li>✅ AI verifies work quality</li>
                <li>✅ AI suggests fair pricing</li>
                <li>✅ Reduce fraud & disputes by 90%</li>
                <li>✅ 3% platform fee — that's it</li>
              </ul>
              <motion.button
                className="btn btn-secondary"
                onClick={() => navigate('/business')}
                whileHover={prefersReduced ? {} : buttonHover}
                whileTap={prefersReduced ? {} : buttonTap}
              >
                Learn More →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Verification Flow */}
      <section className="about-ai">
        <div className="container">
          <motion.h2 variants={fadeUp(16)} {...scrollProps}>How AI Verification Works</motion.h2>
          <motion.p className="section-subtitle" variants={fadeUp(16)} {...scrollProps}>
            Three layers of protection before any payment is released.
          </motion.p>
          <motion.div className="ai-steps" variants={sectionContainer} {...scrollProps}>
            {[
              {
                step: '01',
                title: 'AI Reviews the Work',
                description: 'Our AI analyzes submitted code, designs, or documents for completeness, quality, and authenticity.',
                color: '#EDE9FE',
              },
              {
                step: '02',
                title: 'AI Suggests a Price',
                description: 'Based on complexity, scope, and quality, the AI recommends a fair payment amount to the project poster.',
                color: '#FEF3C7',
              },
              {
                step: '03',
                title: 'Poster Decides',
                description: 'Accept the AI-suggested price, or set your own amount. Either way, payment is released instantly from escrow.',
                color: '#D1FAE5',
              },
            ].map((item) => (
              <motion.div className="ai-step-card" key={item.step} variants={cardVariant} whileHover={prefersReduced ? {} : cardHover}>
                <div className="ai-step-number" style={{ background: item.color }}>{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security */}
      <section className="about-security">
        <div className="container">
          <motion.h2 variants={fadeUp(16)} {...scrollProps}>Secured by Algorand</motion.h2>
          <motion.div className="security-grid" variants={sectionContainer} {...scrollProps}>
            {[
              { icon: '🔒', title: 'Escrow Protection', desc: 'Funds are locked in a blockchain-controlled escrow wallet. Neither party can steal the funds.' },
              { icon: '⚡', title: '4-Second Finality', desc: 'Algorand confirms transactions in ~4 seconds with near-zero fees (0.001 ALGO).' },
              { icon: '🔍', title: 'Full Transparency', desc: 'Every transaction is publicly verifiable on the Algorand blockchain explorer.' },
              { icon: '🤖', title: 'AI + Human Verification', desc: 'AI provides the first check. The poster makes the final call. Both layers protect your money.' },
            ].map((item, i) => (
              <motion.div className="security-card" key={i} variants={cardVariant}>
                <div className="security-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="about-faq">
        <div className="container">
          <motion.h2 variants={fadeUp(16)} {...scrollProps}>Frequently Asked Questions</motion.h2>
          <motion.div className="faq-list" variants={sectionContainer} {...scrollProps}>
            {[
              { q: 'What is ALGO?', a: 'ALGO is the native cryptocurrency of the Algorand blockchain. On TestNet, it\'s free play money for development.' },
              { q: 'Do I need a crypto wallet?', a: 'Yes — you\'ll need Pera Wallet (free app) to connect and sign transactions. We provide a mock mode for demos.' },
              { q: 'What\'s the platform fee?', a: 'We charge 3% on every released payout. The task poster pays the bounty, and 3% is deducted as our fee.' },
              { q: 'Can freelancing platforms integrate GigBounty?', a: 'Absolutely! We offer a plugin API that handles verification and payments. Visit the For Business page to learn more.' },
              { q: 'Is this on the real blockchain?', a: 'During development we use TestNet (fake ALGO). For production, we switch to MainNet with real value.' },
            ].map((item, i) => (
              <motion.details className="faq-item" key={i} variants={cardVariant}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.h2 variants={fadeUp(16)} {...scrollProps}>Ready to Get Started?</motion.h2>
          <motion.div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }} variants={fadeUp(20)} {...scrollProps}>
            <motion.button
              className="btn btn-primary"
              onClick={() => navigate('/post')}
              whileHover={prefersReduced ? {} : buttonHover}
              whileTap={prefersReduced ? {} : buttonTap}
            >
              Post a Bounty
            </motion.button>
            <motion.button
              className="btn btn-secondary"
              onClick={() => navigate('/tasks')}
              whileHover={prefersReduced ? {} : buttonHover}
              whileTap={prefersReduced ? {} : buttonTap}
            >
              Browse Tasks
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
