import { useState } from 'react';

export default function SubmitProofModal({ task, onClose, onSubmit }) {
  const [proofUrl, setProofUrl] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofUrl.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        task_id: task.id,
        proof_url: proofUrl,
        ai_verify: useAI,
      });
      onClose();
    } catch (err) {
      console.error('Failed to submit proof:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Submit Proof</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 'var(--space-component)' }}>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Submitting proof for: <strong>{task?.title}</strong>
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Bounty: <strong style={{ color: 'var(--accent-green)' }}>{task?.amount} ALGO</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="proof-url">Proof URL</label>
            <input
              id="proof-url"
              className="form-input"
              type="url"
              placeholder="https://github.com/your-repo or a link to your deliverable"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              required
            />
            <span className="form-helper">
              Link to your completed work — GitHub repo, document, deployed site, etc.
            </span>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                color: 'var(--text-secondary)',
              }}
            >
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span>
                🤖 Request AI Auto-Verification
              </span>
            </label>
            <span className="form-helper" style={{ marginLeft: '28px' }}>
              AI will evaluate your submission and auto-release payment if approved.
            </span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-tight)', marginTop: 'var(--space-component)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!proofUrl.trim() || submitting}
              style={{ flex: 2 }}
            >
              {submitting ? 'Submitting...' : 'Submit Proof'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
