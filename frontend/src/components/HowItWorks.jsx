import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, cardHover, useScrollRevealProps } from '../lib/motion';

const sectionContainer = staggerContainer(0.12, 0.1);
const cardVariant = fadeUp(24);

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Post a Task',
      description: 'Describe your micro-task and lock ALGO in escrow as the bounty reward.',
    },
    {
      number: 2,
      title: 'Claim & Work',
      description: 'Workers browse open tasks, claim one, and start working on it.',
    },
    {
      number: 3,
      title: 'Submit Proof',
      description: 'Worker submits a proof URL. Optional AI auto-verification available.',
    },
    {
      number: 4,
      title: 'Get Paid',
      description: 'Creator approves the work and ALGO is released instantly from escrow.',
    },
  ];

  const scrollProps = useScrollRevealProps();

  return (
    <section className="how-it-works" id="how">
      <div className="container">
        <motion.h2 variants={fadeUp(16)} {...scrollProps}>
          How It Works
        </motion.h2>
        <motion.p variants={fadeUp(16)} {...scrollProps}>
          Trustless micro-task completion in four simple steps, powered by Algorand.
        </motion.p>

        <motion.div
          className="steps-grid"
          variants={sectionContainer}
          {...scrollProps}
        >
          {steps.map(step => (
            <motion.div
              className="step-card"
              key={step.number}
              variants={cardVariant}
              whileHover={cardHover}
            >
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
