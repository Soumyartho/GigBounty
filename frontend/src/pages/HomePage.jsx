/**
 * HomePage — role-aware home page.
 * Shows RoleSelector if no role set, else shows role-specific hero + tasks.
 */

import { motion, useReducedMotion } from 'framer-motion';
import StatsBar from '../components/StatsBar';
import HeroBlock from '../components/HeroBlock';
import HowItWorks from '../components/HowItWorks';
import RoleSelector from '../components/RoleSelector';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { fadeUp, staggerContainer, cardHover, buttonHover, buttonTap, useScrollRevealProps } from '../lib/motion';

const gridContainer = staggerContainer(0.08);
const cardVariant = fadeUp(20);

export default function HomePage({ tasks, walletAddress }) {
  const navigate = useNavigate();
  const scrollProps = useScrollRevealProps();
  const prefersReduced = useReducedMotion();
  const { role, clearRole, loading } = useRole();

  // Show role selector if no role is set (or loading)
  if (!role && !loading) {
    return <RoleSelector walletAddress={walletAddress} />;
  }

  // Loading state — minimal flicker
  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton skeleton-title" style={{ width: 240, height: 32 }} />
      </div>
    );
  }

  const isPoster = role === 'poster';

  const heroConfig = isPoster
    ? {
        heading: 'Post Bounties,\nPay Instantly',
        sub: 'Lock ALGO in escrow, get AI-verified work, release payment in one click. No middlemen, no delays.',
        cta: 'Post a Bounty',
        ctaAction: () => navigate('/post'),
        secondary: 'Browse Bounties',
        secondaryAction: () => navigate('/tasks'),
      }
    : {
        heading: 'Claim Tasks,\nEarn ALGO',
        sub: 'Browse open bounties, claim what you want, submit your proof, and get paid directly to your wallet.',
        cta: 'Browse Open Bounties',
        ctaAction: () => navigate('/tasks'),
        secondary: 'How it Works',
        secondaryAction: () => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }),
      };

  return (
    <>
      {/* Role banner */}
      <div className={`role-banner role-banner--${role}`}>
        <span className="role-banner-pill">{isPoster ? '📋 POSTER MODE' : '⚡ ACCEPTOR MODE'}</span>
        <span className="role-banner-text">
          {isPoster ? 'You\'re set up to post bounties and pay workers.' : 'You\'re set up to find work and earn ALGO.'}
        </span>
        <button className="role-banner-switch" onClick={clearRole}>Switch Role</button>
      </div>

      {/* Role-adapted hero */}
      <HeroBlock
        heading={heroConfig.heading}
        sub={heroConfig.sub}
        ctaLabel={heroConfig.cta}
        onGetStarted={heroConfig.ctaAction}
        secondaryLabel={heroConfig.secondary}
        onLearnMore={heroConfig.secondaryAction}
      />

      <StatsBar tasks={tasks} />

      {/* Featured tasks/bounties */}
      <section className="container" style={{ paddingBottom: '48px' }}>
        <motion.div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}
          variants={fadeUp(16)}
          {...scrollProps}
        >
          <h2>{isPoster ? 'Your Posted Bounties' : 'Open Bounties for You'}</h2>
          <motion.button
            className="btn btn-secondary"
            onClick={() => navigate('/tasks')}
            whileHover={prefersReduced ? {} : buttonHover}
            whileTap={prefersReduced ? {} : buttonTap}
          >
            View All →
          </motion.button>
        </motion.div>

        <motion.div className="task-grid" variants={gridContainer} {...scrollProps}>
          {(isPoster
            ? tasks.filter(t => t.creator_wallet === walletAddress).slice(0, 3)
            : tasks.filter(t => t.status === 'OPEN' && t.creator_wallet !== walletAddress).slice(0, 3)
          ).map(task => (
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
          {/* Fallback if no matching tasks */}
          {(isPoster
            ? tasks.filter(t => t.creator_wallet === walletAddress)
            : tasks.filter(t => t.status === 'OPEN' && t.creator_wallet !== walletAddress)
          ).length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              {isPoster ? (
                <>No bounties posted yet. <button className="btn btn-primary" style={{ marginLeft: 12 }} onClick={() => navigate('/post')}>Post Your First Bounty</button></>
              ) : (
                <>No open bounties right now. Check again soon!</>
              )}
            </div>
          )}
        </motion.div>
      </section>

      <HowItWorks />
    </>
  );
}
