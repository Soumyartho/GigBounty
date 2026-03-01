/**
 * RoleSelector — full-screen role picker shown when no role is set.
 * Cards are dimmed if wallet is not connected.
 */

import { useState } from 'react';
import { FiBriefcase, FiZap, FiLock } from 'react-icons/fi';
import { useRole } from '../context/RoleContext';

const roles = [
  {
    id: 'poster',
    icon: FiBriefcase,
    label: 'BOUNTY POSTER',
    title: 'Post Tasks,\nGet Results',
    description:
      'You have work that needs doing. Post a bounty, lock ALGO in escrow, review the submission, and release payment instantly — no middlemen, no delays.',
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
      'You bring the skill. Browse open bounties, claim the ones you want, submit your proof, and get paid — directly to your wallet, every time.',
    perks: ['Browse all open bounties', 'Submit proof of work', 'Instant ALGO payout on approval'],
    cta: 'I want to Earn ALGO',
    accent: '#2563EB',
    accentText: '#FFFFFF',
    bg: '#EFF6FF',
    border: '#2563EB',
  },
];

export default function RoleSelector({ walletAddress }) {
  const { setRole } = useRole();
  const [selecting, setSelecting] = useState(null);
  const isConnected = !!walletAddress;

  const handleSelect = async (roleId) => {
    if (!isConnected) return;
    setSelecting(roleId);
    await setRole(roleId);
    setSelecting(null);
  };

  return (
    <div className="role-selector">
      <div className="role-selector-inner">
        {/* Header */}
        <div className="role-selector-header">
          <span className="role-selector-badge">CHOOSE YOUR ROLE</span>
          <h1 className="role-selector-title">
            How do you want to<br />
            use <span className="text-highlight">GigBounty</span>?
          </h1>
          <p className="role-selector-sub">
            Your role is tied to your wallet — switch anytime from the nav.
          </p>
          {!isConnected && (
            <div className="role-selector-warning">
              <FiLock size={14} />
              Connect your Pera Wallet above to choose a role
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="role-cards">
          {roles.map((r) => {
            const Icon = r.icon;
            const isLoading = selecting === r.id;
            return (
              <button
                key={r.id}
                className={`role-card${!isConnected ? ' role-card--locked' : ''}`}
                style={{
                  '--rc-accent': r.accent,
                  '--rc-accent-text': r.accentText,
                  '--rc-bg': r.bg,
                  '--rc-border': r.border,
                }}
                onClick={() => handleSelect(r.id)}
                disabled={!isConnected || !!selecting}
                aria-label={r.cta}
              >
                {/* Icon */}
                <div className="role-card-icon">
                  <Icon size={32} />
                </div>

                {/* Label */}
                <span className="role-card-label">{r.label}</span>

                {/* Title */}
                <h2 className="role-card-title">{r.title}</h2>

                {/* Description */}
                <p className="role-card-desc">{r.description}</p>

                {/* Perks */}
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

                {/* CTA */}
                <div className="role-card-cta">
                  {isLoading ? 'Saving…' : !isConnected ? <><FiLock size={13} /> Connect Wallet</> : r.cta}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
