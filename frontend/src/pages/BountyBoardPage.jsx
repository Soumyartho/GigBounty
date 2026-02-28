import TaskBoard from '../components/TaskBoard';

export default function BountyBoardPage({ tasks, loading, walletAddress, onClaim, onSubmitProof, onApprove }) {
  return (
    <section style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <TaskBoard
        tasks={tasks}
        loading={loading}
        walletAddress={walletAddress}
        onClaim={onClaim}
        onSubmitProof={onSubmitProof}
        onApprove={onApprove}
      />
    </section>
  );
}
