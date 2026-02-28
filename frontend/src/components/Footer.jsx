export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-text">
          © 2026 GigBounty — Decentralized Micro-Task Bounty Board
        </span>
        <div className="footer-links">
          <a href="https://algorand.com" target="_blank" rel="noopener noreferrer">Algorand</a>
          <a href="https://perawallet.app" target="_blank" rel="noopener noreferrer">Pera Wallet</a>
          <a href="#" onClick={(e) => e.preventDefault()}>GitHub</a>
        </div>
      </div>
    </footer>
  );
}
