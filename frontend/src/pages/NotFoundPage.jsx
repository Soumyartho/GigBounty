import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, buttonHover, buttonTap, useScrollRevealProps } from '../lib/motion';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const scrollProps = useScrollRevealProps();
  const prefersReduced = useReducedMotion();

  return (
    <div className="page-notfound">
      <div className="container" style={{ textAlign: 'center', padding: '120px 0' }}>
        <motion.div className="notfound-code" variants={fadeUp(20)} {...scrollProps}>
          404
        </motion.div>
        <motion.h1 variants={fadeUp(20)} {...scrollProps}>
          Page Not Found
        </motion.h1>
        <motion.p className="section-subtitle" variants={fadeUp(20)} {...scrollProps}>
          Looks like this bounty doesn't exist. Maybe it was already claimed?
        </motion.p>
        <motion.div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }} variants={fadeUp(24)} {...scrollProps}>
          <motion.button
            className="btn btn-primary"
            onClick={() => navigate('/')}
            whileHover={prefersReduced ? {} : buttonHover}
            whileTap={prefersReduced ? {} : buttonTap}
          >
            ← Back to Home
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
    </div>
  );
}
