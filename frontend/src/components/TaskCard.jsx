import { useNavigate } from 'react-router-dom';

export default function TaskCard({ task, walletAddress, onClaim, onSubmitProof, onApprove }) {
  const { id, title, description, amount, status, creator_wallet, worker_wallet, deadline } = task;
  const navigate = useNavigate();

  const isCreator = walletAddress && creator_wallet === walletAddress;
  const isWorker = walletAddress && worker_wallet === walletAddress;

  const formatDeadline = (dl) => {
    if (!dl) return 'No deadline';
    const date = new Date(dl);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = () => {
    const classes = {
      OPEN: 'badge-open',
      CLAIMED: 'badge-claimed',
      SUBMITTED: 'badge-submitted',
      COMPLETED: 'badge-completed',
    };
    return <span className={`badge ${classes[status] || 'badge-open'}`}>{status}</span>;
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking a button
    if (e.target.closest('button')) return;
    navigate(`/tasks/${id}`);
  };

  return (
    <div className="task-card" data-status={status} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="task-card-header">
        <h3 className="task-card-title">{title}</h3>
        {getStatusBadge()}
      </div>

      <p className="task-card-description">{description}</p>

      <div className="task-card-meta">
        <div className="task-card-bounty">
          {amount} <span className="algo-symbol">ALGO</span>
        </div>
        <span className="task-card-deadline">
          📅 {formatDeadline(deadline)}
        </span>
      </div>

      {status === 'COMPLETED' && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span className="badge-blockchain">🛡️ Blockchain Verified</span>
        </div>
      )}

      <div className="task-card-footer">
        {status === 'OPEN' && !isCreator && walletAddress && (
          <button className="btn btn-primary" onClick={() => onClaim?.(id)}>
            Claim Task
          </button>
        )}

        {status === 'CLAIMED' && isWorker && (
          <button className="btn btn-primary" onClick={() => onSubmitProof?.(id)}>
            Submit Proof
          </button>
        )}

        {status === 'SUBMITTED' && isCreator && (
          <button className="btn btn-primary" onClick={() => onApprove?.(id)}>
            Approve & Pay
          </button>
        )}

        {status === 'OPEN' && isCreator && (
          <span className="text-small" style={{ padding: '10px', textAlign: 'center', width: '100%' }}>
            Your task — awaiting claims
          </span>
        )}

        {!walletAddress && status === 'OPEN' && (
          <span className="text-small" style={{ padding: '10px', textAlign: 'center', width: '100%' }}>
            Connect wallet to claim
          </span>
        )}
      </div>
    </div>
  );
}
