import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, DURATION, fadeIn, buttonHover, buttonTap } from '../lib/motion';

const navVariant = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.medium, ease: EASE },
  },
};

export default function Navbar({ walletAddress, onConnect, onDisconnect }) {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for subtle background opacity change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const motionProps = prefersReduced
    ? {}
    : { initial: 'hidden', animate: 'visible', variants: navVariant };

  return (
    <motion.nav
      className="navbar"
      {...motionProps}
      style={{
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        backgroundColor: scrolled
          ? 'rgba(244, 239, 231, 0.92)'
          : 'var(--bg-primary)',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <img src="/Logo.svg" alt="GigBounty" style={{ height: '36px', width: 'auto' }} />
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
          <li>
            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'nav-active' : ''}>
              Leaderboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-active' : ''}>
              About
            </NavLink>
          </li>
          {walletAddress && (
            <>
              <li>
                <NavLink to="/my-tasks" className={({ isActive }) => isActive ? 'nav-active' : ''}>
                  My Tasks
                </NavLink>
              </li>
              <li>
                <NavLink to="/wallet" className={({ isActive }) => isActive ? 'nav-active' : ''}>
                  Wallet
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="navbar-actions">
          {walletAddress ? (
            <>
              <div className="navbar-wallet">
                <span className="navbar-wallet-dot"></span>
                {truncateAddress(walletAddress)}
              </div>
              <motion.button
                className="btn btn-secondary"
                onClick={onDisconnect}
                style={{ padding: '8px 16px', minHeight: '36px', fontSize: '12px' }}
                whileHover={prefersReduced ? {} : buttonHover}
                whileTap={prefersReduced ? {} : buttonTap}
              >
                Disconnect
              </motion.button>
            </>
          ) : (
            <motion.button
              className="btn btn-primary"
              onClick={onConnect}
              whileHover={prefersReduced ? {} : buttonHover}
              whileTap={prefersReduced ? {} : buttonTap}
            >
              Connect Wallet
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
