const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Stored wallet address for auth headers
let _walletAddress = null;

/**
 * Set the active wallet address for API authentication.
 * Called when wallet connects/disconnects.
 */
export function setWalletAddress(address) {
  _walletAddress = address || null;
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Inject wallet auth header on all requests
  if (_walletAddress) {
    headers['X-Wallet-Address'] = _walletAddress;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Get all tasks
  getTasks: () => request('/tasks'),

  // Get single task by ID
  getTask: (taskId) => request(`/tasks/${taskId}`),

  // Create a new task
  createTask: (data) =>
    request('/task/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Claim a task
  claimTask: (taskId, workerWallet) =>
    request('/task/claim', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId, worker_wallet: workerWallet }),
    }),

  // Submit proof
  submitProof: (data) =>
    request('/task/submit-proof', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Approve and release payment
  approveTask: (taskId) =>
    request('/task/approve', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId }),
    }),

  // Release payment
  releasePayment: (taskId) =>
    request('/task/release-payment', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId }),
    }),

  // Cancel task and refund creator
  cancelTask: (taskId, callerWallet) =>
    request('/task/cancel', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId, caller_wallet: callerWallet }),
    }),

  // Dispute a task
  disputeTask: (taskId, callerWallet, reason) =>
    request('/task/dispute', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId, caller_wallet: callerWallet, reason }),
    }),

  // AI verification
  aiVerify: (taskId) =>
    request('/task/ai-verify', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId }),
    }),
};
