import React, { useState } from 'react';
import api from '../services/api';

const CheckoutModal = ({
  bookingData,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('UPI - Instant Pay');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  if (!isOpen || !bookingData) return null;

  const { movie, showDate, showtime, seats, subtotal, gstAmount, totalAmount } =
    bookingData;

  const vipSeats = seats.filter((s) => s.seatType === 'VIP');
  const stdSeats = seats.filter((s) => s.seatType === 'Standard');

  const handleConfirmPayment = async () => {
    setProcessing(true);
    setErrorMsg('');

    try {
      const response = await api.post('/bookings', {
        movieId: movie._id,
        showDate,
        showtime,
        seats,
        paymentMethod,
      });

      if (response.success && response.booking) {
        setSuccessResult(response);
      } else {
        setErrorMsg(response.message || 'Payment could not be processed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="modal fade show d-block checkout-modal-backdrop"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-cinema-dark border-secondary border-opacity-50 text-light shadow-2xl">
          {/* Header */}
          <div className="modal-header border-secondary border-opacity-25 pb-3">
            <h5 className="modal-title fw-bold text-light d-flex align-items-center gap-2">
              <i className="bi bi-shield-check text-success"></i>
              <span>{successResult ? 'Booking Confirmation' : 'Order Checkout & Payment'}</span>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {successResult ? (
              /* Success View */
              <div className="text-center py-4">
                <div className="success-checkmark-circle mb-3 mx-auto">
                  <i className="bi bi-check-lg text-white fs-1"></i>
                </div>

                {/* EXACT REQUIRED MESSAGE */}
                <h3 className="text-success fw-bold mb-2">
                  Congratulations! Your ticket has been booked.
                </h3>
                <p className="text-secondary mb-4">
                  Your cinema pass has been generated. Confirmation code:{' '}
                  <span className="text-warning fw-bold font-monospace">
                    {successResult.booking.bookingId}
                  </span>
                </p>

                {/* Quick Pass Preview */}
                <div className="p-3 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-50 text-start max-w-md mx-auto mb-4">
                  <div className="row g-2 small">
                    <div className="col-6">
                      <span className="text-secondary d-block">Movie</span>
                      <strong className="text-light">{successResult.booking.movieTitle}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary d-block">Hall</span>
                      <strong className="text-light">{successResult.booking.hall}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary d-block">Date & Time (IST)</span>
                      <strong className="text-light">
                        {successResult.booking.showDate} • {successResult.booking.showtime}
                      </strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary d-block">Confirmed Seats</span>
                      <strong className="text-warning">
                        {successResult.booking.seats.map((s) => s.seatNumber).join(', ')}
                      </strong>
                    </div>
                    <div className="col-12 pt-2 border-top border-secondary border-opacity-25 d-flex justify-content-between">
                      <span className="text-secondary">Amount Paid (inc. 18% GST):</span>
                      <strong className="text-success fs-6 font-monospace">
                        ₹{successResult.booking.totalAmount.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <button
                    type="button"
                    onClick={() => onBookingSuccess(successResult.booking, 'view_ticket')}
                    className="btn btn-danger btn-lg px-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-qr-code-scan"></i>
                    <span>View & Print Digital E-Ticket</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onBookingSuccess(successResult.booking, 'view_history')}
                    className="btn btn-outline-light btn-lg px-4"
                  >
                    <i className="bi bi-clock-history me-2"></i>My Bookings
                  </button>
                </div>
              </div>
            ) : (
              /* Review & Payment View */
              <div>
                {errorMsg && (
                  <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-exclamation-octagon-fill"></i>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="row g-4">
                  {/* Left Column: Movie & Showtime Summary */}
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 h-100">
                      <h6 className="text-warning text-uppercase small fw-bold mb-3">
                        <i className="bi bi-film me-1"></i> Screening Details
                      </h6>

                      <div className="d-flex gap-3 mb-3">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="rounded-2 shadow-sm"
                          style={{ width: '64px', height: '88px', objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="text-light fw-bold mb-1">{movie.title}</h6>
                          <div className="text-secondary small mb-1">{movie.hall}</div>
                          <div className="badge bg-secondary font-monospace">{movie.language}</div>
                        </div>
                      </div>

                      <div className="list-group list-group-flush bg-transparent small">
                        <div className="list-group-item bg-transparent text-secondary d-flex justify-content-between px-0 py-1 border-secondary border-opacity-25">
                          <span>Date:</span>
                          <span className="text-light fw-medium">{showDate}</span>
                        </div>
                        <div className="list-group-item bg-transparent text-secondary d-flex justify-content-between px-0 py-1 border-secondary border-opacity-25">
                          <span>Showtime (IST):</span>
                          <span className="text-warning fw-medium">{showtime}</span>
                        </div>
                        <div className="list-group-item bg-transparent text-secondary d-flex justify-content-between px-0 py-1 border-0">
                          <span>Selected Seats:</span>
                          <span className="text-light fw-bold">
                            {seats.map((s) => s.seatNumber).join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Financial Breakdown & Payment Options */}
                  <div className="col-12 col-md-6">
                    <div className="p-3 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-50">
                      <h6 className="text-warning text-uppercase small fw-bold mb-3">
                        <i className="bi bi-receipt me-1"></i> Price Breakdown
                      </h6>

                      <div className="font-monospace small mb-3">
                        {vipSeats.length > 0 && (
                          <div className="d-flex justify-content-between text-secondary py-1">
                            <span>VIP Seats ({vipSeats.length} × ₹450)</span>
                            <span className="text-light">
                              ₹{(vipSeats.length * 450).toFixed(2)}
                            </span>
                          </div>
                        )}
                        {stdSeats.length > 0 && (
                          <div className="d-flex justify-content-between text-secondary py-1">
                            <span>Standard Seats ({stdSeats.length} × ₹250)</span>
                            <span className="text-light">
                              ₹{(stdSeats.length * 250).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="d-flex justify-content-between text-secondary py-1 border-top border-secondary border-opacity-25 mt-1">
                          <span>Ticket Subtotal:</span>
                          <span className="text-light">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between text-secondary py-1">
                          <span>Cinema GST (18%):</span>
                          <span className="text-light">₹{gstAmount.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between text-warning fs-5 fw-bold pt-2 mt-2 border-top border-secondary">
                          <span>Total Payable:</span>
                          <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Payment Method Selector */}
                      <label className="text-secondary small fw-bold text-uppercase d-block mb-2">
                        Select Payment Option:
                      </label>
                      <div className="d-flex flex-column gap-2 mb-4">
                        {[
                          { id: 'UPI - Instant Pay', label: 'UPI / Google Pay / PhonePe', icon: 'bi-qr-code' },
                          { id: 'Credit / Debit Card', label: 'Credit or Debit Card', icon: 'bi-credit-card-2-front' },
                          { id: 'Net Banking', label: 'Net Banking / Indian Banks', icon: 'bi-bank' },
                        ].map((method) => (
                          <label
                            key={method.id}
                            className={`p-2 rounded-2 border d-flex align-items-center gap-2 cursor-pointer small transition-all ${
                              paymentMethod === method.id
                                ? 'bg-danger bg-opacity-20 border-danger text-light fw-medium'
                                : 'bg-dark border-secondary border-opacity-25 text-secondary'
                            }`}
                            style={{ cursor: 'pointer' }}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              className="form-check-input mt-0"
                              checked={paymentMethod === method.id}
                              onChange={() => setPaymentMethod(method.id)}
                            />
                            <i className={`bi ${method.icon} text-warning`}></i>
                            <span>{method.label}</span>
                          </label>
                        ))}
                      </div>

                      {/* Confirm Button */}
                      <button
                        type="button"
                        disabled={processing}
                        onClick={handleConfirmPayment}
                        className="btn btn-danger w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
                      >
                        {processing ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                            <span>Securing Booking...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-lock-fill"></i>
                            <span>Pay ₹{totalAmount.toFixed(2)} & Confirm</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

