import { useState } from 'react';
import TaskCard from './TaskCard';
import SkeletonLoader from './SkeletonLoader';

const FILTERS = ['All', 'Open', 'Claimed', 'Submitted', 'Completed'];

export default function TaskBoard({ tasks, loading, walletAddress, onClaim, onSubmitProof, onApprove }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTasks = activeFilter === 'All'
    ? tasks
    : tasks.filter(t => t.status === activeFilter.toUpperCase());

  return (
    <section className="task-board" id="tasks">
      <div className="container">
        <div className="task-board-header">
          <div>
            <h2>Bounty Board</h2>
            <p className="text-small" style={{ marginTop: '4px' }}>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="task-board-filters">
            {FILTERS.map(filter => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

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
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                walletAddress={walletAddress}
                onClaim={onClaim}
                onSubmitProof={onSubmitProof}
                onApprove={onApprove}
              />
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
