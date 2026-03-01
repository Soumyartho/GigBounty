import { useState } from 'react';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import SkeletonLoader from './SkeletonLoader';
import { fadeUp, buttonHover, buttonTap } from '../lib/motion';
import { useReducedMotion } from 'framer-motion';

const FILTERS = ['All', 'Open', 'Claimed', 'Submitted', 'Completed'];

// Each card animates independently — no parent orchestration needed
const cardAnim = (i) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 },
});

export default function TaskBoard({ tasks, loading, walletAddress, onClaim, onSubmitProof, onApprove }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const prefersReduced = useReducedMotion();

  const filteredTasks = activeFilter === 'All'
    ? tasks
    : tasks.filter(t => t.status === activeFilter.toUpperCase());

  return (
    <section className="task-board" id="tasks">
      <div className="container">
        {/* Header */}
        <motion.div
          className="task-board-header"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h2>Bounty Board</h2>
            <p className="text-small" style={{ marginTop: '4px' }}>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="task-board-filters">
            {FILTERS.map(filter => (
              <motion.button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
                whileHover={prefersReduced ? {} : buttonHover}
                whileTap={prefersReduced ? {} : buttonTap}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid — plain div, each card self-animates */}
        <div className="task-grid">
          {loading ? (
            <>
              <SkeletonLoader type="card" />
              <SkeletonLoader type="card" />
              <SkeletonLoader type="card" />
              <SkeletonLoader type="card" />
              <SkeletonLoader type="card" />
              <SkeletonLoader type="card" />
            </>
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task, i) => (
              <motion.div
                key={task.id}
                style={{ height: '100%' }}
                {...(prefersReduced ? {} : cardAnim(i))}
              >
                <TaskCard
                  task={task}
                  walletAddress={walletAddress}
                  onClaim={onClaim}
                  onSubmitProof={onSubmitProof}
                  onApprove={onApprove}
                />
              </motion.div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No tasks found</h3>
              <p>
                {activeFilter !== 'All'
                  ? `No ${activeFilter.toLowerCase()} tasks at the moment.`
                  : 'Be the first to post a bounty!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
