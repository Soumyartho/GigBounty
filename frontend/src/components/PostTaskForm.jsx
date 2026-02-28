import { useState } from 'react';

export default function PostTaskForm({ walletAddress, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    deadline: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Enter a valid ALGO amount';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        amount: Number(formData.amount),
        creator_wallet: walletAddress,
      });
      setFormData({ title: '', description: '', amount: '', deadline: '' });
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="post-task-section" id="post">
      <div className="container">
        <form className="post-task-card" onSubmit={handleSubmit}>
          <div className="post-task-header">
            <h2>Post a Bounty</h2>
            <p>Describe your task, set the ALGO reward, and let the community help.</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              className="form-input"
              type="text"
              name="title"
              placeholder="e.g. Design a landing page mockup"
              value={formData.title}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="form-textarea"
              name="description"
              placeholder="Describe what needs to be done, deliverables, and quality expectations..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="post-task-row">
            <div className="form-group">
              <label className="form-label" htmlFor="task-amount">Bounty (ALGO)</label>
              <input
                id="task-amount"
                className="form-input"
                type="number"
                name="amount"
                placeholder="e.g. 10"
                min="0.1"
                step="0.1"
                value={formData.amount}
                onChange={handleChange}
              />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-deadline">Deadline</label>
              <input
                id="task-deadline"
                className="form-input"
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
              {errors.deadline && <span className="form-error">{errors.deadline}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={!walletAddress || submitting}
          >
            {submitting ? 'Creating Task...' : !walletAddress ? 'Connect Wallet to Post' : 'Post Bounty & Lock ALGO'}
          </button>

          {!walletAddress && (
            <p className="form-helper" style={{ textAlign: 'center', marginTop: '12px' }}>
              You need to connect your Pera Wallet to post a task.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
