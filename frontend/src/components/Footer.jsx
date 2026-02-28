export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-text">
          © 2026 GigBounty — Decentralized Micro-Task Bounty Board
        </span>
        <div className="footer-links">
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <a href="https://algorand.com" target="_blank" rel="noopener noreferrer">Algorand</a>
            <a href="https://perawallet.app" target="_blank" rel="noopener noreferrer">Pera Wallet</a>
            <a href="#" onClick={(e) => e.preventDefault()}>GitHub</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Docs</a>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <span style={{ fontSize: '16px' }}>🛡️</span>
            Secured by Algorand Smart Contracts
          </div>
        </div>
      </div>
    </footer>
  );
}
