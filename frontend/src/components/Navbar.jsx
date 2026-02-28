import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({
  walletAddress,
  onConnect,
  onDisconnect,
}) {
  const navigate = useNavigate();

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <div className="navbar-logo-icon">⚡</div>
          GigBounty
        </NavLink>

        <ul className="navbar-links">
          <li>
            <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-active' : ''}>
              Browse Tasks
            </NavLink>
          </li>
          <li>
            <NavLink to="/post" className={({ isActive }) => isActive ? 'nav-active' : ''}>
              Post a Task
            </NavLink>
          </li>
          {walletAddress && (
            <li>
              <NavLink to="/my-tasks" className={({ isActive }) => isActive ? 'nav-active' : ''}>
                My Tasks
              </NavLink>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          {walletAddress ? (
            <>
              <div className="navbar-wallet">
                <span className="navbar-wallet-dot"></span>
                {truncateAddress(walletAddress)}
              </div>
              <button
                className="btn btn-secondary"
                onClick={onDisconnect}
                style={{
                  padding: '8px 16px',
                  minHeight: '36px',
                  fontSize: '12px',
                }}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onConnect}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
