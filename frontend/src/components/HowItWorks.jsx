import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, cardHover, useScrollRevealProps } from '../lib/motion';

const flowContainer = staggerContainer(0.12, 0.1);
const cardVariant = fadeUp(24);

const ArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function HowItWorks() {
  const steps = [
    {
      label: 'STEP 1',
      title: 'Post & Escrow',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="10" y="8" width="20" height="28" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <line x1="15" y1="15" x2="25" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="25" x2="22" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="27" y="24" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <path d="M30 29 L33 32 L37 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      bg: '#DBEAFE',
      border: '#93C5FD',
    },
    {
      label: 'STEP 2',
      title: 'Claim & Build',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="20" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <path d="M8 40 C8 32 14 28 20 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M32 24 L36 28 L44 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28 36 L34 30 L40 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="37" y1="33" x2="37" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      bg: '#D1FAE5',
      border: '#6EE7B7',
    },
    {
      label: 'STEP 3',
      title: 'Verify Proof',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <path d="M24 8 C24 8 30 16 30 24 C30 32 24 40 24 40" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M24 8 C24 8 18 16 18 24 C18 32 24 40 24 40" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="10" y1="18" x2="38" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="10" y1="30" x2="38" y2="30" stroke="currentColor" strokeWidth="1.5" />
          <path d="M30 32 L34 36 L42 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      bg: '#EDE9FE',
      border: '#C4B5FD',
    },
    {
      label: 'STEP 4',
      title: 'Instant Pay',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="6" y="14" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <line x1="6" y1="22" x2="34" y2="22" stroke="currentColor" strokeWidth="2" />
          <rect x="10" y="28" width="10" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M36 20 L42 14 L42 22 Z" fill="currentColor" opacity="0.6" />
          <circle cx="40" cy="32" r="6" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <path d="M40 29 L40 35 M37 32 L43 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      bg: '#FEF3C7',
      border: '#FCD34D',
    },
  ];

  const scrollProps = useScrollRevealProps();

  return (
    <section className="how-it-works" id="how">
      <div className="container">
        <motion.h2 variants={fadeUp(16)} {...scrollProps}>
          From Task to Payment
        </motion.h2>
        <motion.p variants={fadeUp(16)} {...scrollProps}>
          Micro-task completion in four simple steps, powered by Algorand.
        </motion.p>

        <motion.div
          className="steps-flow"
          variants={flowContainer}
          {...scrollProps}
        >
          {steps.map((step, i) => (
            <div className="step-flow-group" key={step.label}>
              <motion.div
                className="step-card"
                style={{
                  backgroundColor: step.bg,
                  borderColor: step.border,
                }}
                variants={cardVariant}
                whileHover={cardHover}
              >
                <div className="step-icon">{step.icon}</div>
                <span className="step-label">{step.label}</span>
                <h3>{step.title}</h3>
              </motion.div>

              {i < steps.length - 1 && (
                <div className="step-arrow">
                  <ArrowIcon />
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
