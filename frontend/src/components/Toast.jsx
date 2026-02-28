import { useState, useEffect } from 'react';

export default function Toast({ message, type = 'success', duration = 4000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type}`}>
      {type === 'success' && '✅'}
      {type === 'error' && '❌'}
      {type === 'info' && 'ℹ️'}
      {message}
    </div>
  );
}
