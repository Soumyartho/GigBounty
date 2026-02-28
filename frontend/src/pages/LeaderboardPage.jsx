import { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer, useScrollRevealProps } from '../lib/motion';

const tableContainer = staggerContainer(0.05);
const rowVariant = fadeUp(12);

export default function LeaderboardPage({ tasks }) {
  const [tab, setTab] = useState('earners');
  const scrollProps = useScrollRevealProps();
  const prefersReduced = useReducedMotion();

  // Compute leaderboard from tasks
  const topEarners = useMemo(() => {
    const map = {};
    tasks.filter(t => t.status === 'COMPLETED' && t.worker_wallet).forEach(t => {
      const w = t.worker_wallet;
      if (!map[w]) map[w] = { wallet: w, totalAlgo: 0, tasksCompleted: 0 };
      map[w].totalAlgo += t.amount;
      map[w].tasksCompleted += 1;
    });
    return Object.values(map).sort((a, b) => b.totalAlgo - a.totalAlgo).slice(0, 10);
  }, [tasks]);

  const topPosters = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      const c = t.creator_wallet;
      if (!map[c]) map[c] = { wallet: c, totalAlgo: 0, tasksPosted: 0 };
      map[c].totalAlgo += t.amount;
      map[c].tasksPosted += 1;
    });
    return Object.values(map).sort((a, b) => b.totalAlgo - a.totalAlgo).slice(0, 10);
  }, [tasks]);

  const recentCompletions = useMemo(() => {
    return tasks.filter(t => t.status === 'COMPLETED').slice(0, 5);
  }, [tasks]);

  const truncate = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '—';

  const getRankBadge = (i) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  return (
    <div className="page-leaderboard">
      <section className="leaderboard-hero">
        <div className="container">
          <motion.h1 variants={fadeUp(20)} {...scrollProps}>Leaderboard</motion.h1>
          <motion.p className="section-subtitle" variants={fadeUp(20)} {...scrollProps}>
            Top performers on the GigBounty platform.
          </motion.p>
        </div>
      </section>

      <section className="container">
        {/* Tabs */}
        <motion.div className="lb-tabs" variants={fadeUp(12)} {...scrollProps}>
          <button
            className={`lb-tab ${tab === 'earners' ? 'lb-tab-active' : ''}`}
            onClick={() => setTab('earners')}
          >
            🏆 Top Earners
          </button>
          <button
            className={`lb-tab ${tab === 'posters' ? 'lb-tab-active' : ''}`}
            onClick={() => setTab('posters')}
          >
            📋 Top Posters
          </button>
        </motion.div>

        {/* Table */}
        <motion.div className="lb-table" variants={tableContainer} {...scrollProps}>
          <div className="lb-table-header">
            <span className="lb-col-rank">Rank</span>
            <span className="lb-col-wallet">Wallet</span>
            <span className="lb-col-stat">{tab === 'earners' ? 'Tasks Done' : 'Tasks Posted'}</span>
            <span className="lb-col-algo">Total ALGO</span>
          </div>

          {(tab === 'earners' ? topEarners : topPosters).length === 0 ? (
            <div className="lb-empty">
              <p>No data yet. Complete some tasks to see rankings!</p>
            </div>
          ) : (
            (tab === 'earners' ? topEarners : topPosters).map((entry, i) => (
              <motion.div className="lb-row" key={entry.wallet} variants={rowVariant}>
                <span className="lb-col-rank lb-rank-badge">{getRankBadge(i)}</span>
                <span className="lb-col-wallet lb-wallet-addr">{truncate(entry.wallet)}</span>
                <span className="lb-col-stat">{tab === 'earners' ? entry.tasksCompleted : entry.tasksPosted}</span>
                <span className="lb-col-algo lb-algo-amount">{entry.totalAlgo.toFixed(1)} ALGO</span>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Recent */}
        <motion.div className="lb-recent" variants={fadeUp(16)} {...scrollProps}>
          <h3>Recent Completions</h3>
          {recentCompletions.length === 0 ? (
            <p className="lb-empty-text">No completed tasks yet.</p>
          ) : (
            <div className="lb-activity">
              {recentCompletions.map((task) => (
                <div className="lb-activity-item" key={task.id}>
                  <span className="lb-activity-dot" />
                  <span className="lb-activity-title">{task.title}</span>
                  <span className="lb-activity-amount">{task.amount} ALGO</span>
                  <span className="lb-activity-wallet">→ {truncate(task.worker_wallet)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
