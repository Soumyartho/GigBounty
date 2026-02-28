import { motion } from 'framer-motion';
import {
  EASE, DURATION, STAGGER,
  staggerContainer, scaleIn,
  useScrollRevealProps,
} from '../lib/motion';

const STEPS = [
  {
    label: 'Post',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    label: 'Claim',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Submit',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    label: 'Approve',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: 'Paid',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

const STATUS_TO_STEP = {
  'OPEN': 0,
  'CLAIMED': 1,
  'SUBMITTED': 2,
  'COMPLETED': 4,
  'CANCELLED': -1,
  'EXPIRED': -1,
  'DISPUTED': -1,
};

const ERROR_STATUSES = ['CANCELLED', 'EXPIRED', 'DISPUTED'];

const stepperContainer = staggerContainer(0.1, 0.2);

export default function StepperHorizontal({ status = 'OPEN' }) {
  const isErrorStatus = ERROR_STATUSES.includes(status);
  const currentStep = isErrorStatus ? -1 : (STATUS_TO_STEP[status] ?? 0);
  const scrollProps = useScrollRevealProps();

  return (
    <motion.div className="stepper" variants={stepperContainer} {...scrollProps}>
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const stepClass = isCompleted ? 'completed' : isActive ? 'active' : '';

        return (
          <div key={step.label} className="stepper-item">
            <motion.div
              className={`stepper-step ${stepClass}`}
              variants={scaleIn(index * 0.08)}
            >
              <div className="stepper-circle">
                <span className="stepper-icon">
                  {isCompleted ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </span>
              </div>
              <span className="stepper-label">{step.label}</span>
            </motion.div>
            {index < STEPS.length - 1 && (
              <div className={`stepper-connector ${isCompleted ? 'completed' : ''}`}>
                <div className="stepper-connector-fill" />
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
