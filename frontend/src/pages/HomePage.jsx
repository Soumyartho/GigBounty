import { motion, useReducedMotion } from 'framer-motion';
import StatsBar from '../components/StatsBar';
import StepperHorizontal from '../components/StepperHorizontal';
import HeroBlock from '../components/HeroBlock';
import HowItWorks from '../components/HowItWorks';
import ScrollReveal from '../components/ScrollReveal';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer, cardHover, buttonHover, buttonTap, useScrollRevealProps } from '../lib/motion';

const gridContainer = staggerContainer(0.08);
const cardVariant = fadeUp(20);

export default function HomePage({ tasks }) {
  const navigate = useNavigate();
  const scrollProps = useScrollRevealProps();
  const prefersReduced = useReducedMotion();

  return (
    <>
      <HeroBlock
        onGetStarted={() => navigate('/post')}
        onLearnMore={() => {
          document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <StatsBar tasks={tasks} />

      <div className="container" style={{ paddingBottom: '32px' }}>
        <StepperHorizontal status="OPEN" />
      </div>

      {/* Featured tasks preview */}
      <section className="container" style={{ paddingBottom: '48px' }}>
        <motion.div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}
          variants={fadeUp(16)}
          {...scrollProps}
        >
          <h2>Latest Bounties</h2>
          <motion.button
            className="btn btn-secondary"
            onClick={() => navigate('/tasks')}
            whileHover={prefersReduced ? {} : buttonHover}
            whileTap={prefersReduced ? {} : buttonTap}
          >
            View All →
          </motion.button>
        </motion.div>

        <motion.div
          className="task-grid"
          variants={gridContainer}
          {...scrollProps}
        >
          {tasks.slice(0, 3).map(task => (
            <motion.div
              key={task.id}
              className="task-card"
              data-status={task.status}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/tasks/${task.id}`)}
              variants={cardVariant}
              whileHover={prefersReduced ? {} : cardHover}
            >
              <div className="task-card-header">
                <h3 className="task-card-title">{task.title}</h3>
                <span className={`badge badge-${task.status?.toLowerCase()}`}>{task.status}</span>
              </div>
              <p className="task-card-description">{task.description}</p>
              <div className="task-card-meta">
                <div className="task-card-bounty">
                  {task.amount} <span className="algo-symbol">ALGO</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <HowItWorks />
    </>
  );
}
