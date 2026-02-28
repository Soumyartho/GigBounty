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
          <img
            src="/ProjectMedia/Work From Home 2.png"
            alt="GigBounty - Decentralized Freelancing"
            style={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
              borderRadius: 'var(--radius-lg)',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    </section>
  );
}
