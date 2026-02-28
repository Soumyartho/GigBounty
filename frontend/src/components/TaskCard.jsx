import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cardHover, buttonHover, buttonTap } from '../lib/motion';

export default function TaskCard({ task, walletAddress, onClaim, onSubmitProof, onApprove }) {
  const { id, title, description, amount, status, creator_wallet, worker_wallet, deadline } = task;
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

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
    if (e.target.closest('button')) return;
    navigate(`/tasks/${id}`);
  };

  return (
    <motion.div
      className="task-card"
      data-status={status}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
      whileHover={prefersReduced ? {} : cardHover}
    >
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
          <motion.button
            className="btn btn-primary"
            onClick={() => onClaim?.(id)}
            whileHover={prefersReduced ? {} : buttonHover}
            whileTap={prefersReduced ? {} : buttonTap}
          >
            Claim Task
          </motion.button>
        )}

        {status === 'CLAIMED' && isWorker && (
          <motion.button
            className="btn btn-primary"
            onClick={() => onSubmitProof?.(id)}
            whileHover={prefersReduced ? {} : buttonHover}
            whileTap={prefersReduced ? {} : buttonTap}
          >
            Submit Proof
          </motion.button>
        )}

        {status === 'SUBMITTED' && isCreator && (
          <motion.button
            className="btn btn-primary"
            onClick={() => onApprove?.(id)}
            whileHover={prefersReduced ? {} : buttonHover}
            whileTap={prefersReduced ? {} : buttonTap}
          >
            Approve & Pay
          </motion.button>
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
    </motion.div>
  );
}
