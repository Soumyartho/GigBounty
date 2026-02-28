export default function SkeletonLoader({ type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="card" style={{ padding: 'var(--space-component)' }}>
        <div className="skeleton skeleton-title" style={{ width: '70%' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '85%' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '40%', marginTop: '16px' }}></div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <div className="skeleton" style={{ height: '36px', width: '80px', borderRadius: '24px' }}></div>
          <div className="skeleton" style={{ height: '36px', width: '60px', borderRadius: '24px' }}></div>
        </div>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
      </div>
    );
  }

  return <div className="skeleton skeleton-card"></div>;
}
