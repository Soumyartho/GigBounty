import PostTaskForm from '../components/PostTaskForm';
import { useNavigate } from 'react-router-dom';

export default function PostTaskPage({ walletAddress, onSubmit }) {
  const navigate = useNavigate();

  const handleSubmit = async (taskData) => {
    await onSubmit(taskData);
    navigate('/tasks');
  };

  return (
    <section style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <PostTaskForm walletAddress={walletAddress} onSubmit={handleSubmit} />
    </section>
  );
}
