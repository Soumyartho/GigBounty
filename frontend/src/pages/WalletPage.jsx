import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer, buttonHover, buttonTap, useScrollRevealProps } from '../lib/motion';

const sectionContainer = staggerContainer(0.08);
const cardVariant = fadeUp(20);

export default function WalletPage({ walletAddress, tasks, onConnect }) {
  const navigate = useNavigate();
  const scrollProps = useScrollRevealProps();
  const prefersReduced = useReducedMotion();
  const [escrowInfo, setEscrowInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch escrow info
  useEffect(() => {
    fetch('http://localhost:8000/escrow/info')
      .then(res => res.json())
      .then(data => setEscrowInfo(data))
      .catch(() => setEscrowInfo(null));
  }, []);

  const truncate = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '—';

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Compute user stats
  const myCreatedTasks = tasks.filter(t => t.creator_wallet === walletAddress);
  const myWorkedTasks = tasks.filter(t => t.worker_wallet === walletAddress);
  const totalPosted = myCreatedTasks.reduce((sum, t) => sum + t.amount, 0);
  const totalEarned = myWorkedTasks.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0);

  if (!walletAddress) {
    return (
      <div className="page-wallet">
        <section className="wallet-connect-prompt">
          <div className="container" style={{ textAlign: 'center', padding: '120px 0' }}>
            <motion.div className="wallet-icon-large" variants={fadeUp(20)} {...scrollProps}>🔒</motion.div>
            <motion.h1 variants={fadeUp(20)} {...scrollProps}>Connect Your Wallet</motion.h1>
            <motion.p className="section-subtitle" variants={fadeUp(20)} {...scrollProps}>
              Connect your Pera Wallet to view your profile, balance, and transaction history.
            </motion.p>
            <motion.button
              className="btn btn-primary"
              onClick={onConnect}
              style={{ marginTop: '24px' }}
              variants={fadeUp(24)}
              {...scrollProps}
              whileHover={prefersReduced ? {} : buttonHover}
              whileTap={prefersReduced ? {} : buttonTap}
            >
              Connect Wallet
            </motion.button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-wallet">
      <section className="wallet-hero">
        <div className="container">
          <motion.h1 variants={fadeUp(20)} {...scrollProps}>My Wallet</motion.h1>
        </div>
      </section>

      <section className="container">
        {/* Wallet Address Card */}
        <motion.div className="wallet-address-card" variants={fadeUp(20)} {...scrollProps}>
          <div className="wallet-addr-row">
            <span className="wallet-addr-label">Connected Address</span>
            <div className="wallet-addr-full">
              <code>{walletAddress}</code>
              <button className="wallet-copy-btn" onClick={handleCopy}>
                {copied ? '✅ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>
          <div className="wallet-addr-row">
            <span className="wallet-addr-label">Network</span>
            <span className="wallet-network-badge">TestNet</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="wallet-stats-grid" variants={sectionContainer} {...scrollProps}>
          <motion.div className="wallet-stat-card" variants={cardVariant}>
            <span className="wallet-stat-icon">📋</span>
            <span className="wallet-stat-value">{myCreatedTasks.length}</span>
            <span className="wallet-stat-label">Tasks Posted</span>
          </motion.div>
          <motion.div className="wallet-stat-card" variants={cardVariant}>
            <span className="wallet-stat-icon">💰</span>
            <span className="wallet-stat-value">{totalPosted.toFixed(1)}</span>
            <span className="wallet-stat-label">ALGO Posted</span>
          </motion.div>
          <motion.div className="wallet-stat-card" variants={cardVariant}>
            <span className="wallet-stat-icon">✅</span>
            <span className="wallet-stat-value">{myWorkedTasks.filter(t => t.status === 'COMPLETED').length}</span>
            <span className="wallet-stat-label">Tasks Completed</span>
          </motion.div>
          <motion.div className="wallet-stat-card" variants={cardVariant}>
            <span className="wallet-stat-icon">🏆</span>
            <span className="wallet-stat-value">{totalEarned.toFixed(1)}</span>
            <span className="wallet-stat-label">ALGO Earned</span>
          </motion.div>
        </motion.div>

        {/* Escrow Info */}
        {escrowInfo && (
          <motion.div className="wallet-escrow-card" variants={fadeUp(20)} {...scrollProps}>
            <h3>Platform Escrow</h3>
            <div className="escrow-info-grid">
              <div className="escrow-info-item">
                <span className="escrow-info-label">Escrow Address</span>
                <code className="escrow-info-value">{truncate(escrowInfo.address)}</code>
              </div>
              <div className="escrow-info-item">
                <span className="escrow-info-label">Escrow Balance</span>
                <span className="escrow-info-value">{escrowInfo.balance?.toFixed(2) ?? '—'} ALGO</span>
              </div>
              <div className="escrow-info-item">
                <span className="escrow-info-label">Platform Fee</span>
                <span className="escrow-info-value">{escrowInfo.platform_fee_percent}%</span>
              </div>
              <div className="escrow-info-item">
                <span className="escrow-info-label">Status</span>
                <span className={`escrow-status ${escrowInfo.configured ? 'escrow-active' : ''}`}>
                  {escrowInfo.configured ? '● Active' : '○ Not Configured'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Transaction History */}
        <motion.div className="wallet-tx-section" variants={fadeUp(20)} {...scrollProps}>
          <h3>Your Task History</h3>
          {[...myCreatedTasks, ...myWorkedTasks].length === 0 ? (
            <div className="wallet-tx-empty">
              <p>No tasks yet. Start by posting or claiming a bounty!</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <motion.button
                  className="btn btn-primary"
                  onClick={() => navigate('/post')}
                  whileHover={prefersReduced ? {} : buttonHover}
                  whileTap={prefersReduced ? {} : buttonTap}
                >
                  Post a Task
                </motion.button>
                <motion.button
                  className="btn btn-secondary"
                  onClick={() => navigate('/tasks')}
                  whileHover={prefersReduced ? {} : buttonHover}
                  whileTap={prefersReduced ? {} : buttonTap}
                >
                  Browse Tasks
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="wallet-tx-list">
              {[...myCreatedTasks, ...myWorkedTasks]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((task) => (
                  <div
                    className="wallet-tx-row"
                    key={task.id}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="wallet-tx-info">
                      <span className="wallet-tx-type">
                        {task.creator_wallet === walletAddress ? '📤 Posted' : '📥 Worked'}
                      </span>
                      <span className="wallet-tx-title">{task.title}</span>
                    </div>
                    <div className="wallet-tx-meta">
                      <span className={`badge badge-${task.status?.toLowerCase()}`}>{task.status}</span>
                      <span className="wallet-tx-amount">{task.amount} ALGO</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
