import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyTasksPage({ tasks, walletAddress }) {
  const [activeTab, setActiveTab] = useState('created');
  const navigate = useNavigate();

  if (!walletAddress) {
    return (
      <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
        <div className="empty-state-icon">🔐</div>
        <h3>Wallet Not Connected</h3>
        <p>Connect your Pera Wallet to view your tasks.</p>
      </div>
    );
  }

  const createdTasks = tasks.filter(t => t.creator_wallet === walletAddress);
  const workingTasks = tasks.filter(t => t.worker_wallet === walletAddress);
  const activeTasks = activeTab === 'created' ? createdTasks : workingTasks;

  const statusClasses = {
    OPEN: 'badge-open',
    CLAIMED: 'badge-claimed',
    SUBMITTED: 'badge-submitted',
    COMPLETED: 'badge-completed',
    CANCELLED: 'badge-cancelled',
    EXPIRED: 'badge-expired',
    DISPUTED: 'badge-disputed',
  };

  const formatDate = (d) => {
    if (!d) return 'No deadline';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '96px' }}>
      <h1 style={{ marginBottom: '8px' }}>My Tasks</h1>
      <p style={{ marginBottom: '32px' }}>Manage your bounties and work assignments.</p>

      {/* Tab switcher */}
      <div className="my-tasks-tabs">
        <button
          className={`my-tasks-tab ${activeTab === 'created' ? 'active' : ''}`}
          onClick={() => setActiveTab('created')}
        >
          📋 Created by Me <span className="my-tasks-tab-count">{createdTasks.length}</span>
        </button>
        <button
          className={`my-tasks-tab ${activeTab === 'working' ? 'active' : ''}`}
          onClick={() => setActiveTab('working')}
        >
          🔨 Working On <span className="my-tasks-tab-count">{workingTasks.length}</span>
        </button>
      </div>

      {/* Task list */}
      {activeTasks.length === 0 ? (
        <div className="empty-state" style={{ padding: '64px 0' }}>
          <div className="empty-state-icon">{activeTab === 'created' ? '📝' : '🔍'}</div>
          <h3>{activeTab === 'created' ? 'No Bounties Posted' : 'No Active Work'}</h3>
          <p>
            {activeTab === 'created'
              ? 'Post a bounty to get started.'
              : 'Browse open bounties and claim one to start earning.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(activeTab === 'created' ? '/post' : '/tasks')}
            style={{ marginTop: '16px' }}
          >
            {activeTab === 'created' ? 'Post a Bounty' : 'Browse Bounties'}
          </button>
        </div>
      ) : (
        <div className="my-tasks-list">
          {activeTasks.map(task => (
            <div
              key={task.id}
              className="my-task-row"
              onClick={() => navigate(`/tasks/${task.id}`)}
            >
              <div className="my-task-row-main">
                <h3 className="my-task-row-title">{task.title}</h3>
                <p className="my-task-row-desc">{task.description}</p>
              </div>
              <div className="my-task-row-meta">
                <span className={`badge ${statusClasses[task.status]}`}>{task.status}</span>
                <span className="task-card-bounty" style={{ fontSize: '20px' }}>
                  {task.amount} <span className="algo-symbol">ALGO</span>
                </span>
                <span className="text-small">📅 {formatDate(task.deadline)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
