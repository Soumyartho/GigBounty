import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cardHover, buttonHover, buttonTap } from '../lib/motion';
import { useRole } from '../context/RoleContext';

const STATUS_META = {
  OPEN:      { label: 'Open',      color: '#3a7d00', bg: 'rgba(163,230,53,0.13)', border: 'rgba(163,230,53,0.4)' },
  CLAIMED:   { label: 'Claimed',   color: '#1d4ed8', bg: 'rgba(96,165,250,0.13)', border: 'rgba(96,165,250,0.4)' },
  SUBMITTED: { label: 'Submitted', color: '#92400e', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.45)' },
  COMPLETED: { label: 'Completed', color: '#065f46', bg: 'rgba(52,211,153,0.13)', border: 'rgba(52,211,153,0.4)' },
  DISPUTED:  { label: 'Disputed',  color: '#991b1b', bg: 'rgba(248,113,113,0.13)', border: 'rgba(248,113,113,0.4)' },
  CANCELLED: { label: 'Cancelled', color: '#6b7280', bg: 'rgba(209,213,219,0.3)',  border: 'rgba(156,163,175,0.4)' },
};

export default function TaskCard({ task, walletAddress, onClaim, onSubmitProof, onApprove }) {
  const { id, title, description, amount, status, creator_wallet, worker_wallet, deadline } = task;
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const isCreator = walletAddress && creator_wallet === walletAddress;
  const isWorker  = walletAddress && worker_wallet  === walletAddress;
  const meta = STATUS_META[status] || STATUS_META.OPEN;
  const { role: userRole } = useRole();

  const formatDeadline = (dl) => {
    if (!dl) return null;
    return new Date(dl).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    navigate(`/tasks/${id}`);
  };

  // What CTA to show — role-based access control
  const renderCTA = () => {
    // Acceptors (workers) can claim open tasks (but not their own)
    if (status === 'OPEN' && userRole === 'acceptor' && !isCreator && walletAddress)
      return <motion.button className="tc-btn tc-btn--primary" onClick={() => onClaim?.(id)} whileHover={prefersReduced ? {} : buttonHover} whileTap={prefersReduced ? {} : buttonTap}>Claim Task →</motion.button>;

    // Workers can submit proof
    if (status === 'CLAIMED' && isWorker)
      return <motion.button className="tc-btn tc-btn--primary" onClick={() => onSubmitProof?.(id)} whileHover={prefersReduced ? {} : buttonHover} whileTap={prefersReduced ? {} : buttonTap}>Submit Proof →</motion.button>;

    // Posters can approve submitted work
    if (status === 'SUBMITTED' && userRole === 'poster' && isCreator)
      return <motion.button className="tc-btn tc-btn--primary" onClick={() => onApprove?.(id)} whileHover={prefersReduced ? {} : buttonHover} whileTap={prefersReduced ? {} : buttonTap}>Approve & Pay →</motion.button>;

    if (status === 'OPEN' && isCreator)
      return <span className="tc-awaiting">Awaiting claims…</span>;

    if (!walletAddress && status === 'OPEN')
      return <span className="tc-awaiting">Connect wallet to claim</span>;

    return null;
  };

  return (
    <motion.div
      className="tc"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
      whileHover={prefersReduced ? {} : cardHover}
    >
      {/* ── Top: bounty amount + status pill ── */}
      <div className="tc-top">
        <div className="tc-amount-wrap">
          <span className="tc-amount-label">BOUNTY</span>
          <div className="tc-amount">
            <span className="tc-amount-num">{amount}</span>
            <span className="tc-amount-sym">ALGO</span>
          </div>
        </div>

        <span className="tc-badge" style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}>
          {meta.label}
        </span>
      </div>

      {/* ── Title ── */}
      <h3 className="tc-title">{title}</h3>

      {/* ── Description ── */}
      <p className="tc-desc">{description}</p>

      {/* ── Divider ── */}
      <div className="tc-divider" />

      {/* ── Footer: deadline + CTA ── */}
      <div className="tc-footer">
        {deadline ? (
          <span className="tc-deadline">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {formatDeadline(deadline)}
          </span>
        ) : <span />}
        {renderCTA()}
      </div>

      {status === 'COMPLETED' && (
        <div className="tc-verified">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Blockchain Verified
        </div>
      )}
    </motion.div>
  );
}
