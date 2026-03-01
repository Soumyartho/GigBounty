/**
 * RoleSelector — full-screen role picker.
 * Step 1: Pick role (always enabled, no wallet needed)
 * Step 2: Connect wallet (shown after role picked)
 */

import { FiBriefcase, FiZap, FiArrowRight } from 'react-icons/fi';
import { useRole } from '../context/RoleContext';

const roles = [
  {
    id: 'poster',
    icon: FiBriefcase,
    label: 'BOUNTY POSTER',
    title: 'Post Tasks,\nGet Results',
    description:
      'You have work that needs doing. Post a bounty, lock ALGO in escrow, review submissions, and release payment instantly.',
    perks: ['Lock ALGO in escrow', 'AI-verified submissions', 'Release or dispute anytime'],
    cta: 'I want to Post Bounties',
    accent: '#A3E635',
    accentText: '#111111',
    bg: '#F0FDE4',
    border: '#A3E635',
  },
  {
    id: 'acceptor',
    icon: FiZap,
    label: 'BOUNTY ACCEPTOR',
    title: 'Claim Tasks,\nEarn ALGO',
    description:
      'Browse open bounties, claim the ones you want, submit your proof, and get paid — directly to your wallet.',
    perks: ['Browse all open bounties', 'Submit proof of work', 'Instant ALGO payout on approval'],
    cta: 'I want to Earn ALGO',
    accent: '#2563EB',
    accentText: '#FFFFFF',
    bg: '#EFF6FF',
    border: '#2563EB',
  },
];

export default function RoleSelector({ walletAddress, onConnect }) {
  const { role, setRole } = useRole();
  const isConnected = !!walletAddress;

  // Step 2: role is picked but wallet not connected yet
  if (role && !isConnected) {
    const picked = roles.find(r => r.id === role);
    return (
      <div className="role-selector">
        <div className="role-selector-inner">
          <div className="role-selector-header">
            <span className="role-selector-badge">STEP 2 OF 2</span>
            <h1 className="role-selector-title">
              Now <span className="text-highlight">Connect</span> Your Wallet
            </h1>
            <p className="role-selector-sub">
              You chose <strong>{picked?.label}</strong>. Connect your Pera Wallet to start.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <button
              className="btn btn-primary"
              onClick={onConnect}
              style={{ padding: '16px 40px', fontSize: '16px', borderRadius: '14px' }}
            >
              Connect Pera Wallet →
            </button>
            <button
              className="role-banner-switch"
              onClick={() => setRole(null) || localStorage.removeItem('gigbounty_session_role')}
              style={{ marginTop: '8px' }}
            >
              ← Go Back & Change Role
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Pick your role (no wallet needed)
  return (
    <div className="role-selector">
      <div className="role-selector-inner">
        {/* Header */}
        <div className="role-selector-header">
          <span className="role-selector-badge">STEP 1 OF 2 — CHOOSE YOUR ROLE</span>
          <h1 className="role-selector-title">
            How do you want to<br />
            use <span className="text-highlight">GigBounty</span>?
          </h1>
          <p className="role-selector-sub">
            Pick your role first. You'll connect your wallet next.
          </p>
        </div>

        {/* Cards — always active */}
        <div className="role-cards">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                className="role-card"
                style={{
                  '--rc-accent': r.accent,
                  '--rc-accent-text': r.accentText,
                  '--rc-bg': r.bg,
                  '--rc-border': r.border,
                }}
                onClick={() => setRole(r.id)}
                aria-label={r.cta}
              >
                <div className="role-card-icon">
                  <Icon size={32} />
                </div>
                <span className="role-card-label">{r.label}</span>
                <h2 className="role-card-title">{r.title}</h2>
                <p className="role-card-desc">{r.description}</p>

                <ul className="role-card-perks">
                  {r.perks.map((p) => (
                    <li key={p}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-5" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="role-card-cta">
                  {r.cta} <FiArrowRight size={14} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
