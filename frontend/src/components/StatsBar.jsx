import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, cardHover, useScrollRevealProps } from '../lib/motion';

const gridContainer = staggerContainer(0.08);
const statVariant = fadeUp(20);

export default function StatsBar({ tasks }) {
  const openCount = tasks.filter(t => t.status === 'OPEN').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const totalBounty = tasks.reduce((sum, t) => sum + (t.amount || 0), 0);

  const stats = [
    { number: tasks.length, label: 'Total Tasks' },
    { number: openCount, label: 'Open Bounties' },
    { number: `${totalBounty.toFixed(1)}`, label: 'ALGO Locked' },
    { number: completedCount, label: 'Completed' },
  ];

  const scrollProps = useScrollRevealProps();

  return (
    <div className="container">
      <motion.div
        className="stats-bar"
        variants={gridContainer}
        {...scrollProps}
      >
        {stats.map((stat, i) => (
          <motion.div
            className="stat-item"
            key={i}
            variants={statVariant}
            whileHover={cardHover}
          >
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
