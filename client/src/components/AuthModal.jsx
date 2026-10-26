import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    setAuthModalMode,
    login,
    register,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        await register(name, email, password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('guest@imovies.com');
    setPassword('Password123!');
    setErrorMsg('');
  };

  return (
    <div
      className="modal fade show d-block auth-modal-backdrop"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
        <div className="modal-content bg-cinema-dark border-secondary border-opacity-50 text-light shadow-2xl rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header border-secondary border-opacity-25 pb-2">
            <h5 className="modal-title fw-bold text-light d-flex align-items-center gap-2">
              <i className="bi bi-person-lock text-danger"></i>
              <span>{isLogin ? 'Sign In to IMovies' : 'Create an Account'}</span>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={closeAuthModal}
              aria-label="Close"
            ></button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="d-flex border-bottom border-secondary border-opacity-25">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setErrorMsg('');
              }}
              className={`btn flex-grow-1 rounded-0 py-2 fw-semibold ${
                isLogin
                  ? 'btn-dark text-danger border-bottom border-2 border-danger'
                  : 'btn-dark bg-transparent text-secondary'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('register');
                setErrorMsg('');
              }}
              className={`btn flex-grow-1 rounded-0 py-2 fw-semibold ${
                !isLogin
                  ? 'btn-dark text-danger border-bottom border-2 border-danger'
                  : 'btn-dark bg-transparent text-secondary'
              }`}
            >
              Register
            </button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {errorMsg && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label small text-secondary fw-semibold">
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small text-secondary fw-semibold">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small text-secondary fw-semibold">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-danger w-100 py-2 fw-bold shadow-sm mb-3"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Fill for testing */}
            {isLogin && (
              <div className="text-center pt-2 border-top border-secondary border-opacity-25">
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className="btn btn-outline-warning btn-sm rounded-pill px-3 py-1"
                  style={{ fontSize: '0.78rem' }}
                >
                  <i className="bi bi-magic me-1"></i> Quick Fill Demo Account
                </button>
                <div className="text-secondary small mt-1" style={{ fontSize: '0.7rem' }}>
                  guest@imovies.com | Password123!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

