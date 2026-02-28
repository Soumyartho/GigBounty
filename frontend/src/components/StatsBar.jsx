export default function StatsBar({ tasks }) {
  const openCount = tasks.filter(t => t.status === 'OPEN').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const totalBounty = tasks.reduce((sum, t) => sum + (t.amount || 0), 0);
  const workers = new Set(tasks.filter(t => t.worker_wallet).map(t => t.worker_wallet)).size;

  const stats = [
    { number: tasks.length, label: '📋 Total Tasks' },
    { number: openCount, label: '⚡ Open Bounties' },
    { number: `${totalBounty.toFixed(1)}`, label: '💰 ALGO Locked' },
    { number: completedCount, label: '🛡️ Completed' },
  ];

  return (
    <div className="container">
      <div className="stats-bar">
        {stats.map((stat, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
