import { useState } from 'react';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import SkeletonLoader from './SkeletonLoader';
import { fadeUp, staggerContainer, useScrollRevealProps, buttonHover, buttonTap } from '../lib/motion';
import { useReducedMotion } from 'framer-motion';

const FILTERS = ['All', 'Open', 'Claimed', 'Submitted', 'Completed'];
const gridContainer = staggerContainer(0.08);
const cardVariant = fadeUp(20);

export default function TaskBoard({ tasks, loading, walletAddress, onClaim, onSubmitProof, onApprove }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const scrollProps = useScrollRevealProps();
  const prefersReduced = useReducedMotion();

  const filteredTasks = activeFilter === 'All'
    ? tasks
    : tasks.filter(t => t.status === activeFilter.toUpperCase());

  return (
    <section className="task-board" id="tasks">
      <div className="container">
        <motion.div
          className="task-board-header"
          variants={fadeUp(16)}
          initial="hidden"
          animate="visible"
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

        <motion.div
          className="task-grid"
          variants={gridContainer}
          initial="hidden"
          animate="visible"
        >
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
            filteredTasks.map(task => (
              <motion.div key={task.id} variants={cardVariant} style={{ height: '100%' }}>
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
        </motion.div>
      </div>
    </section>
  );
}
