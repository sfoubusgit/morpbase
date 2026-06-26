import { useState } from 'react';
import { Modal } from './Modal';
import './AuthModal.css';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (name: string, email: string, password: string) => Promise<boolean>;
  onGoogle?: () => void;
  error?: string | null;
};

type AuthMode = 'login' | 'register';

const GoogleGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
    <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33Z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
  </svg>
);

export function AuthModal({ isOpen, onClose, onLogin, onRegister, onGoogle, error }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    const ok = mode === 'login'
      ? await onLogin(email, password)
      : await onRegister(name, email, password);
    if (ok) {
      resetForm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="auth-shell">
      <div className="auth-modal">
        <button type="button" className="auth-x" onClick={handleClose} aria-label="Close">✕</button>
        <div className="auth-brand">
          <span className="auth-wordmark"><span className="base">MORPBASE</span><span className="ai">AI</span></span>
          <h2 className="auth-heading">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="auth-tagline">{mode === 'login' ? 'Log in to generate, save and share.' : 'Join the community and start creating.'}</p>
        </div>
        {onGoogle && (
          <>
            <button type="button" className="auth-google" onClick={onGoogle}>
              <GoogleGlyph />
              Continue with Google
            </button>
            <div className="auth-or"><span>or use email</span></div>
          </>
        )}
        <div className="auth-toggle">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Log In
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
        {mode === 'register' && (
          <label className="auth-field">
            Name
            <input
              type="text"
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="Your name"
            />
          </label>
        )}
        <label className="auth-field">
          Email
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="auth-field">
          Password
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder="At least 6 characters"
          />
        </label>
        <button type="button" className="auth-primary" onClick={handleSubmit}>
          {mode === 'login' ? 'Log in' : 'Create account'}
        </button>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-hint">
          {mode === 'login'
            ? 'New here? Register to create an account.'
            : 'Already have an account? Switch to Log In.'}
        </div>
      </div>
    </Modal>
  );
}
