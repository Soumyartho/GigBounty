import { motion } from 'framer-motion';
import {
  EASE, DURATION, STAGGER,
  staggerContainer, fadeUp,
  buttonHover, buttonTap,
  floatLoop, useMotionProps,
} from '../lib/motion';

// Hero-specific orchestrator — slightly slower stagger for cinematic feel
const heroContainer = staggerContainer(STAGGER.slow, 0.15);

// Visual entrance — scale + fade
const visualVariant = {
  hidden: { opacity: 0, scale: 0.97, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE, delay: 0.4 },
  },
};

// Button-level stagger
const buttonContainer = staggerContainer(STAGGER.fast, 0.05);

// Shared entrance for buttons
const btnVariant = fadeUp(14, DURATION.medium);

export default function HeroBlock({
  onGetStarted,
  onLearnMore,
  heading = 'Decentralized Micro-Task Bounty Board',
  sub = 'Post tasks, lock ALGO in escrow, and pay workers instantly on completion. Powered by Algorand blockchain with optional AI verification.',
  ctaLabel = 'Post a Bounty',
  secondaryLabel = 'Learn More',
}) {
  const motionProps = useMotionProps();

  return (
    <section className="hero">
      <motion.div
        className="hero-inner"
        variants={heroContainer}
        {...motionProps}
      >
        {/* Left — Text */}
        <div className="hero-content">
          <motion.h1 variants={fadeUp(22, DURATION.slow)} style={{ whiteSpace: 'pre-line' }}>
            {heading}
          </motion.h1>

          <motion.p variants={fadeUp(20, DURATION.medium)}>
            {sub}
          </motion.p>

          <motion.div className="hero-actions" variants={buttonContainer}>
            <motion.button
              className="btn btn-primary"
              onClick={onGetStarted}
              style={{ padding: '16px 40px', fontSize: '16px' }}
              variants={btnVariant}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              {ctaLabel}
            </motion.button>
            <motion.button
              className="btn btn-secondary"
              onClick={onLearnMore}
              variants={btnVariant}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              {secondaryLabel}
            </motion.button>
          </motion.div>
        </div>

        {/* Right — Floating illustration */}
        <motion.div className="hero-visual" variants={visualVariant}>
          <motion.img
            src="/ProjectMedia/Work From Home 2.png"
            alt="GigBounty - Decentralized Freelancing"
            animate={floatLoop(8, 6)}
            style={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
              borderRadius: 'var(--radius-lg)',
              objectFit: 'contain',
              willChange: 'transform',
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
