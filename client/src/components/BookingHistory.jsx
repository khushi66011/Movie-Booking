import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DigitalTicket from './DigitalTicket';

const BookingHistory = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/bookings/my-bookings');
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('[Booking History Error]:', err);
      setError(err.message || 'Failed to fetch booking history');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // If viewing a single ticket in full
  if (selectedTicket) {
    return (
      <div className="container py-4">
        <DigitalTicket
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <div className="bg-dark-cinema p-5 rounded-4 border border-secondary border-opacity-25 max-w-md mx-auto shadow-lg">
          <i className="bi bi-shield-lock-fill text-warning fs-1 mb-3 d-block"></i>
          <h4 className="text-light fw-bold mb-2">Account Required</h4>
          <p className="text-secondary mb-4">
            Please sign in to inspect your past cinema bookings and digital tickets.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="btn btn-danger px-4 py-2 rounded-pill fw-bold shadow-sm"
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      {/* Page Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25 gap-3">
        <div>
          <h2 className="text-light fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-ticket-perforated-fill text-danger"></i>
            <span>My Booking History</span>
          </h2>
          <p className="text-secondary small mb-0">
            View, track, and reprint all your confirmed cinema reservations.
          </p>
        </div>
        <Link to="/" className="btn btn-outline-light btn-sm rounded-pill px-3">
          <i className="bi bi-plus-circle me-1"></i> Book Another Movie
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-4">
          <i className="bi bi-exclamation-octagon-fill"></i>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger me-2" role="status"></div>
          <p className="text-secondary mt-3">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        /* Empty History State */
        <div className="text-center py-5 bg-dark-cinema rounded-4 border border-secondary border-opacity-25 p-5 shadow-sm">
          <i className="bi bi-ticket-detailed text-secondary fs-1 mb-3 d-block"></i>
          <h4 className="text-light fw-bold mb-2">No Bookings Yet</h4>
          <p className="text-secondary mb-4">
            You haven't reserved any movie tickets yet. Explore now showing blockbusters!
          </p>
          <Link to="/" className="btn btn-danger px-4 py-2 rounded-pill fw-bold">
            Explore Now Showing
          </Link>
        </div>
      ) : (
        /* Booking Cards Grid */
        <div className="row g-4">
          {bookings.map((booking) => {
            const seats = booking.seats || [];
            const bookingDate = booking.bookedAt
              ? new Date(booking.bookedAt).toLocaleDateString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '26 Oct 2026';

            return (
              <div className="col-12" key={booking._id || booking.bookingId}>
                <div className="card bg-dark-cinema border-secondary border-opacity-25 rounded-4 shadow-md overflow-hidden text-light">
                  <div className="card-body p-3 p-md-4">
                    <div className="row g-3 align-items-center">
                      {/* Movie Thumbnail */}
                      <div className="col-auto">
                        <img
                          src={booking.moviePoster || booking.movie?.posterUrl}
                          alt={booking.movieTitle}
                          className="rounded-3 shadow-sm border border-secondary border-opacity-25"
                          style={{ width: '70px', height: '98px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>

                      {/* Main Details */}
                      <div className="col">
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                          <span className="badge bg-danger font-monospace">
                            {booking.certificate || 'UA 16+'}
                          </span>
                          <span className="badge bg-dark border border-secondary text-secondary font-monospace">
                            ID: {booking.bookingId}
                          </span>
                          <span className="badge bg-success bg-opacity-75 font-monospace">
                            CONFIRMED
                          </span>
                        </div>

                        <h5 className="fw-bold text-light mb-1">{booking.movieTitle}</h5>
                        <div className="text-secondary small mb-2">
                          <i className="bi bi-calendar-event me-1 text-danger"></i>
                          <span>{booking.showDate}</span>
                          <span className="mx-2">•</span>
                          <i className="bi bi-clock me-1 text-warning"></i>
                          <span>{booking.showtime} (IST)</span>
                          <span className="mx-2">•</span>
                          <span>{booking.hall || 'Audi 1'}</span>
                        </div>

                        {/* Seats */}
                        <div className="d-flex flex-wrap gap-1 align-items-center">
                          <span className="text-secondary small me-1">Seats:</span>
                          {seats.map((s) => (
                            <span
                              key={s.seatNumber}
                              className={`badge ${
                                s.seatType === 'VIP' ? 'bg-warning text-dark' : 'bg-secondary'
                              } font-monospace`}
                            >
                              {s.seatNumber} ({s.seatType})
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Financials & Action */}
                      <div className="col-12 col-md-auto text-md-end pt-3 pt-md-0 border-top border-md-top-0 border-secondary border-opacity-25">
                        <div className="text-secondary small">Total Paid (inc. 18% GST)</div>
                        <div className="fs-4 fw-bold text-warning font-monospace mb-2">
                          ₹{booking.totalAmount ? booking.totalAmount.toFixed(2) : '0.00'}
                        </div>
                        <div className="text-secondary small mb-3" style={{ fontSize: '0.72rem' }}>
                          Booked on: {bookingDate}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedTicket(booking)}
                          className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-semibold d-inline-flex align-items-center gap-2"
                        >
                          <i className="bi bi-qr-code-scan"></i>
                          <span>View E-Ticket</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;

