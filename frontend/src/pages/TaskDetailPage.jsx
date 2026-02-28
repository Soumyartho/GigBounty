import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StepperHorizontal from '../components/StepperHorizontal';

export default function TaskDetailPage({ tasks, walletAddress, onClaim, onSubmitProof, onApprove, useDemo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="container" style={{ padding: '96px 0', textAlign: 'center' }}>
        <div className="empty-state-icon">🔍</div>
        <h3>Task Not Found</h3>
        <p>This task may have been removed or the link is invalid.</p>
        <button className="btn btn-primary" onClick={() => navigate('/tasks')} style={{ marginTop: '24px' }}>
          Browse Bounties
        </button>
      </div>
    );
  }

  const isCreator = walletAddress && task.creator_wallet === walletAddress;
  const isWorker = walletAddress && task.worker_wallet === walletAddress;

  const truncateAddr = (addr) => {
    if (!addr) return '—';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (d) => {
    if (!d) return 'No deadline';
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const statusClasses = {
    OPEN: 'badge-open',
    CLAIMED: 'badge-claimed',
    SUBMITTED: 'badge-submitted',
    COMPLETED: 'badge-completed',
  };

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '96px' }}>
      {/* Back link */}
      <button
        className="btn btn-tertiary"
        onClick={() => navigate('/tasks')}
        style={{ marginBottom: '24px', padding: '8px 0' }}
      >
        ← Back to Bounty Board
      </button>

      <div className="task-detail-layout">
        {/* Main content */}
        <div className="task-detail-main">
          <div className="task-detail-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '32px', lineHeight: 1.3 }}>{task.title}</h1>
              <span className={`badge ${statusClasses[task.status] || 'badge-open'}`} style={{ flexShrink: 0 }}>
                {task.status}
              </span>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <StepperHorizontal status={task.status} />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                Description
              </h3>
              <p style={{ fontSize: '17px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{task.description}</p>
            </div>

            {task.proof_url && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  Proof of Completion
                </h3>
                <a
                  href={task.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 20px', background: 'var(--bg-primary)',
                    border: '2px solid var(--border-light)', borderRadius: 'var(--radius-default)',
                    color: 'var(--accent-blue)', fontWeight: 600, fontSize: '14px',
                    textDecoration: 'none', wordBreak: 'break-all'
                  }}
                >
                  🔗 {task.proof_url}
                </a>
              </div>
            )}

            {task.status === 'COMPLETED' && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                <span className="badge-blockchain">🛡️ Blockchain Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="task-detail-sidebar">
          {/* Bounty card */}
          <div className="task-detail-card">
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Bounty Reward
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 700, color: 'var(--accent-green)' }}>
                {task.amount} <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>ALGO</span>
              </div>
            </div>

            <div className="task-detail-info-grid">
              <div className="task-detail-info-item">
                <span className="task-detail-info-label">📅 Deadline</span>
                <span className="task-detail-info-value">{formatDate(task.deadline)}</span>
              </div>
              <div className="task-detail-info-item">
                <span className="task-detail-info-label">👤 Creator</span>
                <span className="task-detail-info-value" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                  {truncateAddr(task.creator_wallet)}
                  {isCreator && <span className="badge badge-open" style={{ marginLeft: '8px', fontSize: '10px' }}>You</span>}
                </span>
              </div>
              {task.worker_wallet && (
                <div className="task-detail-info-item">
                  <span className="task-detail-info-label">🔨 Worker</span>
                  <span className="task-detail-info-value" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                    {truncateAddr(task.worker_wallet)}
                    {isWorker && <span className="badge badge-open" style={{ marginLeft: '8px', fontSize: '10px' }}>You</span>}
                  </span>
                </div>
              )}
              <div className="task-detail-info-item">
                <span className="task-detail-info-label">📊 Status</span>
                <span className={`badge ${statusClasses[task.status]}`}>{task.status}</span>
              </div>
            </div>
          </div>

          {/* Actions card */}
          <div className="task-detail-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {task.status === 'OPEN' && !isCreator && walletAddress && (
                <button className="btn btn-primary btn-full" onClick={() => onClaim?.(task.id)}>
                  ⚡ Claim This Bounty
                </button>
              )}

              {task.status === 'OPEN' && !walletAddress && (
                <p className="text-small" style={{ textAlign: 'center' }}>
                  Connect your wallet to claim this bounty
                </p>
              )}

              {task.status === 'OPEN' && isCreator && (
                <p className="text-small" style={{ textAlign: 'center' }}>
                  Your task — awaiting claims
                </p>
              )}

              {task.status === 'CLAIMED' && isWorker && (
                <button className="btn btn-primary btn-full" onClick={() => onSubmitProof?.(task.id)}>
                  📎 Submit Proof
                </button>
              )}

              {task.status === 'CLAIMED' && !isWorker && (
                <p className="text-small" style={{ textAlign: 'center' }}>
                  Task claimed by {truncateAddr(task.worker_wallet)}
                </p>
              )}

              {task.status === 'SUBMITTED' && isCreator && (
                <button className="btn btn-primary btn-full" onClick={() => onApprove?.(task.id)}>
                  ✅ Approve & Release Payment
                </button>
              )}

              {task.status === 'SUBMITTED' && !isCreator && (
                <p className="text-small" style={{ textAlign: 'center' }}>
                  Proof submitted — awaiting creator approval
                </p>
              )}

              {task.status === 'COMPLETED' && (
                <p className="text-small" style={{ textAlign: 'center', color: 'var(--accent-green)' }}>
                  ✅ Task completed & payment released
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
