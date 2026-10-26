import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCodeComponent from './QRCodeComponent';

const DigitalTicket = ({ booking, onClose }) => {
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const seatsList = booking.seats || [];
  const vipSeats = seatsList.filter((s) => s.seatType === 'VIP');
  const stdSeats = seatsList.filter((s) => s.seatType === 'Standard');

  const formattedBookedAt = booking.bookedAt
    ? new Date(booking.bookedAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '26 Oct 2026, 10:45 PM IST';

  return (
    <div className="digital-ticket-container py-4 px-2 px-md-3">
      {/* Control Buttons (hidden when printing) */}
      <div className="d-print-none d-flex flex-wrap justify-content-between align-items-center mb-4 max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => (onClose ? onClose() : navigate(-1))}
          className="btn btn-outline-secondary btn-sm rounded-pill px-3 text-light"
        >
          <i className="bi bi-arrow-left me-1"></i> Back
        </button>

        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/my-bookings')}
            className="btn btn-outline-warning btn-sm rounded-pill px-3"
          >
            <i className="bi bi-clock-history me-1"></i> Booking History
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-danger btn-sm rounded-pill px-4 fw-bold shadow-sm"
          >
            <i className="bi bi-printer-fill me-1"></i> Print / Save Ticket
          </button>
        </div>
      </div>

      {/* Main E-Ticket Card */}
      <div
        ref={ticketRef}
        className="e-ticket-card max-w-3xl mx-auto bg-white text-dark rounded-4 shadow-2xl overflow-hidden position-relative"
      >
        {/* Top Header Banner */}
        <div className="e-ticket-header p-3 px-md-4 bg-dark text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-film text-danger fs-4"></i>
            <div>
              <span className="fw-bold tracking-wider fs-5">
                <span className="text-danger">I</span>MOVIES CINEMAS
              </span>
              <span className="d-block small text-secondary font-monospace" style={{ fontSize: '0.68rem' }}>
                DIGITAL BOARDING PASS • ADMIT ONE
              </span>
            </div>
          </div>
          <div className="text-end">
            <span className="badge bg-success text-uppercase font-monospace px-3 py-1">
              <i className="bi bi-check-circle-fill me-1"></i> Confirmed
            </span>
            <div className="small text-secondary font-monospace mt-1">
              REF: <strong className="text-warning">{booking.bookingId}</strong>
            </div>
          </div>
        </div>

        {/* Ticket Body: Two-column Layout (Left: Film Details, Right: Stub + QR) */}
        <div className="row g-0">
          {/* Main Film Screening Panel */}
          <div className="col-12 col-md-8 p-3 p-md-4 border-end-dashed">
            {/* Film Title & Poster info */}
            <div className="d-flex gap-3 align-items-start mb-3">
              {booking.moviePoster && (
                <img
                  src={booking.moviePoster}
                  alt={booking.movieTitle}
                  className="rounded-2 shadow-sm border"
                  style={{ width: '70px', height: '96px', objectFit: 'cover' }}
                />
              )}
              <div>
                <h4 className="fw-bold text-dark mb-1">{booking.movieTitle}</h4>
                <div className="d-flex flex-wrap gap-2 align-items-center text-muted small mb-1">
                  <span className="badge bg-danger text-white font-monospace">
                    {booking.certificate || 'UA 16+'}
                  </span>
                  <span>{booking.hall || 'Audi 1 (IMAX 4K Atmos)'}</span>
                </div>
                <div className="text-muted small">
                  Payment: <strong className="text-dark">{booking.paymentMethod || 'UPI Instant Pay'}</strong>
                </div>
              </div>
            </div>

            {/* Screening Metadata Grid */}
            <div className="row g-3 py-3 border-top border-bottom my-3">
              <div className="col-4">
                <div className="text-muted small text-uppercase fw-semibold">Show Date</div>
                <div className="fw-bold text-dark fs-6">{booking.showDate}</div>
              </div>
              <div className="col-4">
                <div className="text-muted small text-uppercase fw-semibold">Time (IST)</div>
                <div className="fw-bold text-danger fs-6">{booking.showtime}</div>
              </div>
              <div className="col-4">
                <div className="text-muted small text-uppercase fw-semibold">Screen</div>
                <div className="fw-bold text-dark fs-6">SCREEN 1</div>
              </div>
            </div>

            {/* Confirmed Seats Pill Display */}
            <div className="mb-3">
              <div className="text-muted small text-uppercase fw-semibold mb-1">
                Reserved Seats ({seatsList.length}):
              </div>
              <div className="d-flex flex-wrap gap-2">
                {seatsList.map((s, idx) => (
                  <span
                    key={idx}
                    className={`badge font-monospace fs-6 px-3 py-2 ${
                      s.seatType === 'VIP' ? 'bg-warning text-dark border border-warning' : 'bg-dark text-white'
                    }`}
                  >
                    {s.seatNumber} <small>({s.seatType})</small>
                  </span>
                ))}
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="bg-light p-3 rounded-3 border small font-monospace">
              {vipSeats.length > 0 && (
                <div className="d-flex justify-content-between text-muted">
                  <span>VIP Seats ({vipSeats.length} × ₹450):</span>
                  <span>₹{(vipSeats.length * 450).toFixed(2)}</span>
                </div>
              )}
              {stdSeats.length > 0 && (
                <div className="d-flex justify-content-between text-muted">
                  <span>Standard Seats ({stdSeats.length} × ₹250):</span>
                  <span>₹{(stdSeats.length * 250).toFixed(2)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between text-muted">
                <span>Subtotal:</span>
                <span>₹{booking.subtotal ? booking.subtotal.toFixed(2) : '0.00'}</span>
              </div>
              <div className="d-flex justify-content-between text-muted">
                <span>Cinema GST (18%):</span>
                <span>₹{booking.gstAmount ? booking.gstAmount.toFixed(2) : '0.00'}</span>
              </div>
              <div className="d-flex justify-content-between text-dark fw-bold fs-6 border-top pt-1 mt-1">
                <span>Total Amount Paid:</span>
                <span className="text-danger">
                  ₹{booking.totalAmount ? booking.totalAmount.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            <div className="text-muted small mt-2" style={{ fontSize: '0.72rem' }}>
              Booked on: {formattedBookedAt} • Non-refundable ticket
            </div>
          </div>

          {/* Ticket Stub & Verification QR Code */}
          <div className="col-12 col-md-4 p-4 bg-light d-flex flex-column align-items-center justify-content-center text-center ticket-stub-section">
            {/* Notch Cutout circles for cinema ticket visual */}
            <div className="ticket-notch ticket-notch-top d-none d-md-block"></div>
            <div className="ticket-notch ticket-notch-bottom d-none d-md-block"></div>

            <div className="mb-2 text-muted text-uppercase font-monospace fw-bold small">
              Entry Gate Verification
            </div>

            {/* Printable QR Code */}
            <div className="my-2">
              <QRCodeComponent
                value={
                  booking.qrData ||
                  JSON.stringify({
                    bookingId: booking.bookingId,
                    movie: booking.movieTitle,
                    seats: seatsList.map((s) => s.seatNumber),
                    total: `₹${booking.totalAmount}`,
                    time: `${booking.showDate} ${booking.showtime}`,
                  })
                }
                size={150}
              />
            </div>

            <div className="font-monospace fw-bold text-dark fs-5 mt-2">
              {booking.bookingId}
            </div>
            <div className="text-muted small font-monospace">
              {booking.user?.name || 'Verified Customer'}
            </div>

            <div className="mt-3 p-2 bg-white rounded border w-100 text-center small text-muted font-monospace" style={{ fontSize: '0.68rem' }}>
              Show this QR code at turnstile gate. Screen brightness must be at 100%.
            </div>
          </div>
        </div>

        {/* Barcode Strip Footer */}
        <div className="p-2 bg-dark text-center font-monospace text-secondary small d-flex justify-content-between px-4 border-top">
          <span>IMOVIES CINEMA NETWORKS • INDIA</span>
          <span>CERTIFIED TAX INVOICE (GSTIN: 27AAAAA0000A1Z5)</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalTicket;

