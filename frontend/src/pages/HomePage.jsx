import StatsBar from '../components/StatsBar';
import StepperHorizontal from '../components/StepperHorizontal';
import HeroBlock from '../components/HeroBlock';
import HowItWorks from '../components/HowItWorks';
import { useNavigate } from 'react-router-dom';

export default function HomePage({ tasks }) {
  const navigate = useNavigate();

  return (
    <>
      <HeroBlock
        onGetStarted={() => navigate('/post')}
        onLearnMore={() => {
          document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <StatsBar tasks={tasks} />

      <div className="container" style={{ paddingBottom: '32px' }}>
        <StepperHorizontal status="OPEN" />
      </div>

      {/* Featured tasks preview */}
      <section className="container" style={{ paddingBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2>Latest Bounties</h2>
          <button className="btn btn-secondary" onClick={() => navigate('/tasks')}>
            View All →
          </button>
        </div>
        <div className="task-grid">
          {tasks.slice(0, 3).map(task => (
            <div
              key={task.id}
              className="task-card"
              data-status={task.status}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/tasks/${task.id}`)}
            >
              <div className="task-card-header">
                <h3 className="task-card-title">{task.title}</h3>
                <span className={`badge badge-${task.status?.toLowerCase()}`}>{task.status}</span>
              </div>
              <p className="task-card-description">{task.description}</p>
              <div className="task-card-meta">
                <div className="task-card-bounty">
                  {task.amount} <span className="algo-symbol">ALGO</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HowItWorks />
    </>
  );
}
