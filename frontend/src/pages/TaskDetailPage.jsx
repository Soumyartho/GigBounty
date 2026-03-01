import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import StepperHorizontal from '../components/StepperHorizontal';
import { useRole } from '../context/RoleContext';
import { api } from '../services/api';

export default function TaskDetailPage({ tasks, walletAddress, onClaim, onSubmitProof, onApprove, onCancel, onDispute, useDemo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === id);
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const { role: userRole } = useRole();
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

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
    CANCELLED: 'badge-cancelled',
    EXPIRED: 'badge-expired',
    DISPUTED: 'badge-disputed',
  };

  const handleDisputeSubmit = () => {
    if (!disputeReason.trim() || disputeReason.trim().length < 5) return;
    onDispute?.(task.id, disputeReason.trim());
    setShowDisputeForm(false);
    setDisputeReason('');
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

            {/* Dispute info banner */}
            {task.status === 'DISPUTED' && (
              <div style={{
                marginBottom: '32px', padding: '20px', borderRadius: 'var(--radius-default)',
                background: '#FFF5F5', border: '2px solid #FFCDD2'
              }}>
                <h3 style={{ fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C62828' }}>
                  ⚠️ Dispute Active
                </h3>
                {task.dispute_reason && (
                  <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#B71C1C', marginBottom: '8px' }}>
                    <strong>Reason:</strong> {task.dispute_reason}
                  </p>
                )}
                {task.disputed_by && (
                  <p style={{ fontSize: '13px', color: '#C62828' }}>
                    Raised by: <span style={{ fontFamily: 'monospace' }}>{truncateAddr(task.disputed_by)}</span>
                  </p>
                )}
              </div>
            )}

            {/* Cancelled info banner */}
            {task.status === 'CANCELLED' && (
              <div style={{
                marginBottom: '32px', padding: '20px', borderRadius: 'var(--radius-default)',
                background: 'var(--bg-secondary)', border: '2px solid var(--border-light)'
              }}>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  🚫 This task was cancelled and the ALGO has been refunded to the creator.
                </p>
              </div>
            )}

            {/* Expired info banner */}
            {task.status === 'EXPIRED' && (
              <div style={{
                marginBottom: '32px', padding: '20px', borderRadius: 'var(--radius-default)',
                background: '#FFF8E1', border: '2px solid #FFE082'
              }}>
                <p style={{ fontSize: '15px', color: '#E65100', textAlign: 'center' }}>
                  ⏰ This task has expired. The ALGO will be refunded to the creator.
                </p>
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
              {/* OPEN — Claim (acceptor role only) */}
              {task.status === 'OPEN' && userRole === 'acceptor' && !isCreator && walletAddress && (
                <button className="btn btn-primary btn-full" onClick={() => onClaim?.(task.id)}>
                  ⚡ Claim This Bounty
                </button>
              )}

              {task.status === 'OPEN' && !walletAddress && (
                <p className="text-small" style={{ textAlign: 'center' }}>
                  Connect your wallet to claim this bounty
                </p>
              )}

              {/* OPEN — Poster view */}
              {task.status === 'OPEN' && userRole === 'poster' && (
                <>
                  <p className="text-small" style={{ textAlign: 'center' }}>
                    Your task — awaiting claims
                  </p>
                  {isCreator && (
                    <button className="btn btn-danger btn-full" onClick={() => onCancel?.(task.id)}>
                      🚫 Cancel & Refund
                    </button>
                  )}
                </>
              )}

              {/* CLAIMED — Submit proof (worker/acceptor) */}
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

              {/* SUBMITTED — AI Verify + Approve (poster role) */}
              {task.status === 'SUBMITTED' && (userRole === 'poster' || isCreator) && (
                <>
                  {/* AI Verify button */}
                  <button
                    className="btn btn-secondary btn-full"
                    disabled={aiLoading}
                    onClick={async () => {
                      setAiLoading(true);
                      try {
                        const res = await api.aiVerify(task.id);
                        setAiResult(res);
                      } catch (err) {
                        setAiResult({ ai_result: { score: 0, verdict: 'ERROR', reasoning: err.message }, audit_report: '' });
                      } finally {
                        setAiLoading(false);
                      }
                    }}
                  >
                    {aiLoading ? '🔄 Running AI Audit...' : '🤖 Run AI Verification'}
                  </button>

                  {/* Approve button */}
                  <button className="btn btn-primary btn-full" onClick={() => onApprove?.(task.id)}>
                    ✅ Approve & Release Payment
                  </button>
                </>
              )}

              {task.status === 'SUBMITTED' && userRole === 'acceptor' && !isCreator && (
                <p className="text-small" style={{ textAlign: 'center' }}>
                  Proof submitted — awaiting poster approval
                </p>
              )}

              {/* CLAIMED / SUBMITTED — Dispute (creator or worker) */}
              {(task.status === 'CLAIMED' || task.status === 'SUBMITTED') && (isCreator || isWorker) && (
                <>
                  {!showDisputeForm ? (
                    <button
                      className="btn btn-warning btn-full"
                      onClick={() => setShowDisputeForm(true)}
                    >
                      ⚠️ Raise Dispute
                    </button>
                  ) : (
                    <div style={{
                      padding: '16px', borderRadius: 'var(--radius-default)',
                      background: '#FFF8E1', border: '1px solid #FFE082'
                    }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                        Reason for dispute
                      </label>
                      <textarea
                        className="form-textarea"
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        placeholder="Describe why you're disputing this task..."
                        rows={3}
                        style={{ marginBottom: '12px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ flex: 1 }}
                          onClick={() => { setShowDisputeForm(false); setDisputeReason(''); }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-warning"
                          style={{ flex: 2 }}
                          disabled={!disputeReason.trim() || disputeReason.trim().length < 5}
                          onClick={handleDisputeSubmit}
                        >
                          Submit Dispute
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* COMPLETED */}
              {task.status === 'COMPLETED' && (
                <p className="text-small" style={{ textAlign: 'center', color: 'var(--accent-green)' }}>
                  ✅ Task completed & payment released
                </p>
              )}

              {/* DISPUTED */}
              {task.status === 'DISPUTED' && (
                <p className="text-small" style={{ textAlign: 'center', color: '#C62828' }}>
                  ⚠️ This task is under dispute — funds are frozen
                </p>
              )}

              {/* CANCELLED */}
              {task.status === 'CANCELLED' && (
                <p className="text-small" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  🚫 Task cancelled — ALGO refunded
                </p>
              )}

              {/* EXPIRED */}
              {task.status === 'EXPIRED' && (
                <p className="text-small" style={{ textAlign: 'center', color: '#E65100' }}>
                  ⏰ Task expired — refund available
                </p>
              )}
            </div>
          </div>

          {/* AI Audit Report */}
          {aiResult && (
            <div className="task-detail-card" style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '16px' }}>
                🤖 AI Audit Report
              </h3>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  padding: '12px 20px', borderRadius: '12px',
                  background: aiResult.ai_result?.verdict === 'PASS' ? '#D1FAE5' : '#FEE2E2',
                  fontWeight: 700, fontSize: '14px',
                  color: aiResult.ai_result?.verdict === 'PASS' ? '#065F46' : '#991B1B'
                }}>
                  {aiResult.ai_result?.verdict === 'PASS' ? '✅ PASS' : '❌ FAIL'}
                </div>
                <div style={{
                  padding: '12px 20px', borderRadius: '12px',
                  background: '#F3F4F6', fontWeight: 700, fontSize: '14px'
                }}>
                  Score: {((aiResult.ai_result?.score || 0) * 100).toFixed(0)}%
                </div>
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.6, marginBottom: '16px' }}>
                {aiResult.ai_result?.reasoning}
              </p>
              {aiResult.audit_report && (
                <div style={{
                  padding: '16px', borderRadius: '12px', background: '#F9FAFB',
                  border: '1px solid #E5E7EB', fontSize: '13px', lineHeight: 1.7,
                  whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)',
                  maxHeight: '400px', overflow: 'auto'
                }}>
                  {aiResult.audit_report}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
