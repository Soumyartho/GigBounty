const API_BASE = 'http://localhost:8000';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
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

  // AI verification
  aiVerify: (taskId) =>
    request('/task/ai-verify', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId }),
    }),
};
