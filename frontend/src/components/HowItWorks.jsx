export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Post a Task',
      description: 'Describe your micro-task and lock ALGO in escrow as the bounty reward.',
    },
    {
      number: 2,
      title: 'Claim & Work',
      description: 'Workers browse open tasks, claim one, and start working on it.',
    },
    {
      number: 3,
      title: 'Submit Proof',
      description: 'Worker submits a proof URL. Optional AI auto-verification available.',
    },
    {
      number: 4,
      title: 'Get Paid',
      description: 'Creator approves the work and ALGO is released instantly from escrow.',
    },
  ];

  return (
    <section className="how-it-works" id="how">
      <div className="container">
        <h2>How It Works</h2>
        <p>Trustless micro-task completion in four simple steps, powered by Algorand.</p>

        <div className="steps-grid">
          {steps.map(step => (
            <div className="step-card" key={step.number}>
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
