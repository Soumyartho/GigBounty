import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import SubmitProofModal from './components/SubmitProofModal';
import Footer from './components/Footer';
import Toast from './components/Toast';
import useWallet from './hooks/useWallet';
import { api, setWalletAddress } from './services/api';
import { buildEscrowPayment, submitTransaction, getEscrowAddress } from './services/algorand';

// Pages
import HomePage from './pages/HomePage';
import BountyBoardPage from './pages/BountyBoardPage';
import TaskDetailPage from './pages/TaskDetailPage';
import PostTaskPage from './pages/PostTaskPage';
import MyTasksPage from './pages/MyTasksPage';
import AboutPage from './pages/AboutPage';
import ForBusinessPage from './pages/ForBusinessPage';
import LeaderboardPage from './pages/LeaderboardPage';
import WalletPage from './pages/WalletPage';
import NotFoundPage from './pages/NotFoundPage';

// Demo tasks for when backend is not running
const DEMO_TASKS = [
  {
    id: '1',
    title: 'Design a Logo for DeFi Protocol',
    description: 'Create a modern, flat-style logo for a DeFi protocol. Must include icon and wordmark. Deliverable: SVG + PNG files.',
    amount: 15,
    creator_wallet: 'DEMO_CREATOR_1',
    worker_wallet: null,
    status: 'OPEN',
    proof_url: null,
    created_at: new Date().toISOString(),
    deadline: '2026-03-15',
  },
  {
    id: '2',
    title: 'Write Smart Contract Documentation',
    description: 'Document the escrow smart contract functions, parameters, and usage examples. Must be clear for developers.',
    amount: 8,
    creator_wallet: 'DEMO_CREATOR_2',
    worker_wallet: 'DEMO_WORKER_1',
    status: 'CLAIMED',
    proof_url: null,
    created_at: new Date().toISOString(),
    deadline: '2026-03-10',
  },
  {
    id: '3',
    title: 'Build a Token Price Widget',
    description: 'Create a React component that shows real-time ALGO price with a mini chart. Use CoinGecko API.',
    amount: 20,
    creator_wallet: 'DEMO_CREATOR_1',
    worker_wallet: 'DEMO_WORKER_2',
    status: 'SUBMITTED',
    proof_url: 'https://github.com/example/price-widget',
    created_at: new Date().toISOString(),
    deadline: '2026-03-08',
  },
  {
    id: '4',
    title: 'Create Landing Page Copy',
    description: 'Write compelling copy for the GigBounty landing page. Include hero headline, value props, and CTA text.',
    amount: 5,
    creator_wallet: 'DEMO_CREATOR_3',
    worker_wallet: null,
    status: 'OPEN',
    proof_url: null,
    created_at: new Date().toISOString(),
    deadline: '2026-03-20',
  },
  {
    id: '5',
    title: 'Audit Algorand PyTEAL Contract',
    description: 'Security audit of a PyTEAL escrow contract. Check for reentrancy, overflow, and access control issues.',
    amount: 50,
    creator_wallet: 'DEMO_CREATOR_2',
    worker_wallet: 'DEMO_WORKER_3',
    status: 'COMPLETED',
    proof_url: 'https://github.com/example/audit-report',
    created_at: new Date().toISOString(),
    deadline: '2026-03-01',
  },
  {
    id: '6',
    title: 'Deploy TestNet Faucet Bot',
    description: 'Build a Discord bot that dispenses TestNet ALGO to users. Must include rate limiting and address validation.',
    amount: 12,
    creator_wallet: 'DEMO_CREATOR_1',
    worker_wallet: null,
    status: 'OPEN',
    proof_url: null,
    created_at: new Date().toISOString(),
    deadline: '2026-03-25',
  },
];

function App() {
  const { walletAddress, connecting, connect, disconnect, signTransactions } = useWallet();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proofModal, setProofModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [useDemo, setUseDemo] = useState(false);
  const navigate = useNavigate();

  // Fetch tasks from backend or use demo data
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTasks();
      setTasks(data);
      setUseDemo(false);
    } catch (err) {
      console.log('Backend not available, using demo data');
      setTasks(DEMO_TASKS);
      setUseDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Sync wallet address with API auth layer
  useEffect(() => {
    setWalletAddress(walletAddress);
  }, [walletAddress]);

  // Handle wallet connect
  const handleConnect = async () => {
    try {
      await connect();
      showToast('Wallet connected successfully!');
    } catch (err) {
      showToast('Failed to connect wallet', 'error');
    }
  };

  // Handle wallet disconnect
  const handleDisconnect = () => {
    disconnect();
    showToast('Wallet disconnected', 'info');
  };

  // Create task — builds escrow payment, signs via Pera, then creates task
  const handleCreateTask = async (taskData) => {
    if (useDemo) {
      const newTask = {
        ...taskData,
        id: String(Date.now()),
        status: 'OPEN',
        worker_wallet: null,
        proof_url: null,
        created_at: new Date().toISOString(),
      };
      setTasks(prev => [newTask, ...prev]);
      showToast('Bounty posted successfully! (Demo mode)');
      return;
    }

    try {
      let txId = null;

      // Try to do real escrow deposit
      const escrowAddr = await getEscrowAddress();
      if (escrowAddr && walletAddress && signTransactions) {
        showToast('Building escrow transaction...', 'info');
        const txn = await buildEscrowPayment(walletAddress, taskData.amount);
        showToast('Please approve the transaction in Pera Wallet...', 'info');
        const signedTxns = await signTransactions([txn]);
        showToast('Submitting to Algorand TestNet...', 'info');
        txId = await submitTransaction(signedTxns[0]);
      }

      // Create task in backend with the tx_id
      await api.createTask({ ...taskData, tx_id: txId });
      showToast(`Bounty posted! ${txId ? 'ALGO locked in escrow on TestNet.' : 'Escrow recorded.'}`);
      fetchTasks();
    } catch (err) {
      if (err?.message?.includes('cancelled') || err?.data?.type === 'CONNECT_MODAL_CLOSED') {
        showToast('Transaction cancelled by user', 'info');
      } else {
        showToast(err.message || 'Failed to create task', 'error');
      }
      throw err;
    }
  };

  // Claim task
  const handleClaim = async (taskId) => {
    if (!walletAddress) {
      showToast('Please connect your wallet first', 'error');
      return;
    }

    if (useDemo) {
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, status: 'CLAIMED', worker_wallet: walletAddress } : t
        )
      );
      showToast('Task claimed! Start working on it. (Demo mode)');
      return;
    }

    try {
      await api.claimTask(taskId, walletAddress);
      showToast('Task claimed! Start working on it.');
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to claim task', 'error');
    }
  };

  // Open submit proof modal
  const handleSubmitProof = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setProofModal(task);
  };

  // Submit proof
  const handleProofSubmit = async (proofData) => {
    if (useDemo) {
      setTasks(prev =>
        prev.map(t =>
          t.id === proofData.task_id
            ? { ...t, status: 'SUBMITTED', proof_url: proofData.proof_url }
            : t
        )
      );
      showToast('Proof submitted! Awaiting approval. (Demo mode)');
      setProofModal(null);
      return;
    }

    try {
      await api.submitProof(proofData);
      showToast('Proof submitted! Awaiting creator approval.');
      setProofModal(null);
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to submit proof', 'error');
      throw err;
    }
  };

  // Approve task
  const handleApprove = async (taskId) => {
    if (useDemo) {
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, status: 'COMPLETED' } : t
        )
      );
      showToast('Task approved! Payment released. (Demo mode)');
      return;
    }

    try {
      await api.approveTask(taskId);
      showToast('Task approved and ALGO released to worker!');
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to approve task', 'error');
    }
  };

  // Cancel task and refund
  const handleCancel = async (taskId) => {
    if (!walletAddress) {
      showToast('Please connect your wallet first', 'error');
      return;
    }

    if (useDemo) {
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, status: 'CANCELLED' } : t
        )
      );
      showToast('Task cancelled and ALGO refunded. (Demo mode)');
      return;
    }

    try {
      await api.cancelTask(taskId, walletAddress);
      showToast('Task cancelled — ALGO refunded to your wallet!');
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to cancel task', 'error');
    }
  };

  // Dispute task
  const handleDispute = async (taskId, reason) => {
    if (!walletAddress) {
      showToast('Please connect your wallet first', 'error');
      return;
    }

    if (useDemo) {
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId
            ? { ...t, status: 'DISPUTED', dispute_reason: reason, disputed_by: walletAddress }
            : t
        )
      );
      showToast('Dispute raised. Task is now frozen. (Demo mode)');
      return;
    }

    try {
      await api.disputeTask(taskId, walletAddress, reason);
      showToast('Dispute raised — task is now frozen until resolution.');
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to raise dispute', 'error');
    }
  };

  return (
    <>
      <Navbar
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      <main>
        <Routes>
          <Route path="/" element={<HomePage tasks={tasks} />} />
          <Route
            path="/tasks"
            element={
              <BountyBoardPage
                tasks={tasks}
                loading={loading}
                walletAddress={walletAddress}
                onClaim={handleClaim}
                onSubmitProof={handleSubmitProof}
                onApprove={handleApprove}
              />
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <TaskDetailPage
                tasks={tasks}
                walletAddress={walletAddress}
                onClaim={handleClaim}
                onSubmitProof={handleSubmitProof}
                onApprove={handleApprove}
                onCancel={handleCancel}
                onDispute={handleDispute}
                useDemo={useDemo}
              />
            }
          />
          <Route
            path="/post"
            element={
              <PostTaskPage
                walletAddress={walletAddress}
                onSubmit={handleCreateTask}
              />
            }
          />
          <Route
            path="/my-tasks"
            element={
              <MyTasksPage
                tasks={tasks}
                walletAddress={walletAddress}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/business" element={<ForBusinessPage />} />
          <Route
            path="/leaderboard"
            element={<LeaderboardPage tasks={tasks} />}
          />
          <Route
            path="/wallet"
            element={
              <WalletPage
                walletAddress={walletAddress}
                tasks={tasks}
                onConnect={handleConnect}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Submit Proof Modal */}
      {proofModal && (
        <SubmitProofModal
          task={proofModal}
          onClose={() => setProofModal(null)}
          onSubmit={handleProofSubmit}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}


    </>
  );
}

export default App;
