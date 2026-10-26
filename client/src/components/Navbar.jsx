import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LiveClock from './LiveClock';

const Navbar = ({ onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark-cinema sticky-top border-bottom border-dark-subtle shadow">
      <div className="container-fluid px-lg-5">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div className="brand-logo-icon">
            <i className="bi bi-film text-danger fs-3"></i>
          </div>
          <div>
            <span className="brand-title">
              <span className="text-danger fw-bold">I</span>MOVIES
            </span>
            <span className="badge bg-danger ms-2 font-monospace" style={{ fontSize: '0.65rem' }}>
              CINEMAS
            </span>
          </div>
        </Link>

        {/* Live IST Clock */}
        <div className="d-none d-sm-block my-2 my-lg-0">
          <LiveClock />
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#imoviesNavbar"
          aria-controls="imoviesNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links & Actions */}
        <div className="collapse navbar-collapse" id="imoviesNavbar">
          <div className="d-sm-none my-2 text-center">
            <LiveClock />
          </div>

          <ul className="navbar-nav ms-auto align-items-lg-center gap-2 gap-lg-3">
            <li className="nav-item">
              <Link className="nav-link px-3 active" to="/">
                <i className="bi bi-camera-reels me-1"></i> Movies
              </Link>
            </li>

            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link px-3 position-relative" to="/my-bookings">
                  <i className="bi bi-ticket-perforated me-1 text-warning"></i> My Bookings
                </Link>
              </li>
            )}

            {/* Auth Actions */}
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle btn btn-outline-secondary text-light px-3 py-1 rounded-pill d-flex align-items-center gap-2"
                  href="#profile"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle text-danger"></i>
                  <span className="fw-medium">{user.name.split(' ')[0]}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow border-secondary">
                  <li className="px-3 py-2 border-bottom border-secondary border-opacity-50">
                    <div className="small text-secondary">Signed in as</div>
                    <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>
                      {user.email}
                    </div>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/my-bookings">
                      <i className="bi bi-ticket-detailed me-2 text-warning"></i>
                      Past Confirmed Bookings
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider border-secondary" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item py-2 text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item d-flex gap-2">
                <button
                  className="btn btn-outline-light btn-sm px-3 rounded-pill"
                  onClick={() => onOpenAuth('login')}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                </button>
                <button
                  className="btn btn-danger btn-sm px-3 rounded-pill fw-semibold shadow-sm"
                  onClick={() => onOpenAuth('register')}
                >
                  Register
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

