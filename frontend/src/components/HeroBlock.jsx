export default function HeroBlock({ onGetStarted, onLearnMore }) {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <h1>Decentralized Micro-Task Bounty Board</h1>
          <p>
            Post tasks, lock ALGO in escrow, and pay workers instantly on completion. 
            Powered by Algorand blockchain with optional AI verification.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onGetStarted} style={{ padding: '16px 40px', fontSize: '16px' }}>
              Post a Bounty
            </button>
            <button className="btn btn-secondary" onClick={onLearnMore}>
              Learn More
            </button>
          </div>
        </div>

        <div className="hero-visual">
          {/* Organic background circles */}
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-circle hero-circle-3"></div>

          {/* Flat geometric card stack illustration */}
          <div className="hero-card-stack">
            <div className="hero-float-card hero-float-card-1">
              <div className="card-line"></div>
              <div className="card-line"></div>
              <div className="card-line"></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span className="badge badge-open">Open</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-green)' }}>5 ALGO</span>
              </div>
            </div>
            <div className="hero-float-card hero-float-card-2">
              <div className="card-line"></div>
              <div className="card-line"></div>
              <div className="card-line"></div>
            </div>
            <div className="hero-float-card hero-float-card-3">
              <div className="card-line"></div>
              <div className="card-line"></div>
              <div className="card-line"></div>
            </div>
            <div className="hero-float-badge">✓ Verified</div>
            
            {/* Dot grid accent */}
            <div className="hero-dots">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="hero-dot"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
