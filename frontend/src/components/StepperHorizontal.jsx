const STEPS = [
  { label: 'Post', icon: '📝' },
  { label: 'Claim', icon: '🤝' },
  { label: 'Submit', icon: '📤' },
  { label: 'Approve', icon: '✅' },
  { label: 'Paid', icon: '💰' },
];

const STATUS_TO_STEP = {
  'OPEN': 0,
  'CLAIMED': 1,
  'SUBMITTED': 2,
  'COMPLETED': 4,
};

export default function StepperHorizontal({ status = 'OPEN' }) {
  const currentStep = STATUS_TO_STEP[status] ?? 0;

  return (
    <div className="stepper">
      {STEPS.map((step, index) => (
        <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
          <div
            className={`stepper-step ${
              index < currentStep ? 'completed' : index === currentStep ? 'active' : ''
            }`}
          >
            <div className="stepper-circle">
              {index < currentStep ? '✓' : step.icon}
            </div>
            <span className="stepper-label">{step.label}</span>
          </div>
          {index < STEPS.length - 1 && (
            <div className={`stepper-connector ${index < currentStep ? 'completed' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );
}
