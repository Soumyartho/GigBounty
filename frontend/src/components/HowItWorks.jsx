export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      label: 'STEP 1',
      title: 'Post & Escrow',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="6" width="24" height="32" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <line x1="14" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="14" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="14" y1="26" x2="22" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <rect x="28" y="22" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <path d="M32 28 L35 31 L40 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#DBEAFE',
      border: '#93C5FD',
    },
    {
      number: 2,
      label: 'STEP 2',
      title: 'Claim & Build',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="20" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <path d="M8 40 C8 32 14 28 20 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M32 24 L36 28 L44 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M28 36 L34 30 L40 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <line x1="37" y1="33" x2="37" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      color: '#D1FAE5',
      border: '#6EE7B7',
    },
    {
      number: 3,
      label: 'STEP 3',
      title: 'Verify Proof',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <path d="M24 8 C24 8 30 16 30 24 C30 32 24 40 24 40" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M24 8 C24 8 18 16 18 24 C18 32 24 40 24 40" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="10" y1="18" x2="38" y2="18" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="10" y1="30" x2="38" y2="30" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M30 32 L34 36 L42 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: '#EDE9FE',
      border: '#C4B5FD',
    },
    {
      number: 4,
      label: 'STEP 4',
      title: 'Instant Pay',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="6" y="14" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <line x1="6" y1="22" x2="34" y2="22" stroke="currentColor" strokeWidth="2"/>
          <rect x="10" y="28" width="10" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M36 20 L42 14 L42 22 Z" fill="currentColor" opacity="0.6"/>
          <circle cx="40" cy="32" r="6" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <path d="M40 29 L40 35 M37 32 L43 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      color: '#FEF3C7',
      border: '#FCD34D',
    },
  ];

  const Arrow = () => (
    <div className="step-arrow">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8 16 L22 16" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 10 L24 16 L18 22" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );

  return (
    <section className="how-it-works" id="how">
      <div className="container">
        <h2>From Task to Payment</h2>

        <div className="steps-flow">
          {steps.map((step, i) => (
            <div className="step-flow-group" key={step.number}>
              <div className="step-card" style={{ backgroundColor: step.color, borderColor: step.border }}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-label">{step.label}</div>
                <h3>{step.title}</h3>
              </div>
              {i < steps.length - 1 && <Arrow />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
