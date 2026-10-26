import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

const PRICING = {
  VIP: 450, // Rows A and B
  Standard: 250, // Rows C, D, E
};

const DATES = [
  { label: 'Today', date: '2026-10-26' },
  { label: 'Tomorrow', date: '2026-10-27' },
  { label: 'Wed, 28 Oct', date: '2026-10-28' },
];

const SeatMatrixModal = ({
  movie,
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const [selectedDate, setSelectedDate] = useState(DATES[0].date);
  const [selectedTime, setSelectedTime] = useState(
    movie?.showtimes?.[0] || '05:15 PM'
  );
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [seatError, setSeatError] = useState('');

  // Determine seat tier: A & B are VIP, C, D, E are Standard
  const getSeatTier = (row) => {
    return row === 'A' || row === 'B' ? 'VIP' : 'Standard';
  };

  // Fetch occupied/reserved seats from backend
  const fetchOccupiedSeats = useCallback(async () => {
    if (!movie?._id || !selectedDate || !selectedTime) return;

    setLoadingSeats(true);
    setSeatError('');
    try {
      const data = await api.get('/bookings/occupied-seats', {
        movieId: movie._id,
        showDate: selectedDate,
        showtime: selectedTime,
      });

      if (data.success && Array.isArray(data.occupiedSeats)) {
        setOccupiedSeats(data.occupiedSeats);
        // Clear any selected seats that are now occupied
        setSelectedSeats((prev) =>
          prev.filter((s) => !data.occupiedSeats.includes(s.seatNumber))
        );
      }
    } catch (err) {
      console.warn('[SeatMatrix] Could not load occupied seats:', err.message);
      // Fallback empty if network error
      setOccupiedSeats([]);
    } finally {
      setLoadingSeats(false);
    }
  }, [movie?._id, selectedDate, selectedTime]);

  useEffect(() => {
    if (isOpen && movie) {
      setSelectedSeats([]);
      fetchOccupiedSeats();
    }
  }, [isOpen, movie, selectedDate, selectedTime, fetchOccupiedSeats]);

  // Handle seat click toggle
  const toggleSeat = (seatId, tier) => {
    if (occupiedSeats.includes(seatId)) return;

    setSeatError('');
    const exists = selectedSeats.find((s) => s.seatNumber === seatId);

    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatNumber !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        setSeatError('Maximum 8 seats allowed per single transaction.');
        return;
      }
      const price = PRICING[tier];
      setSelectedSeats([
        ...selectedSeats,
        { seatNumber: seatId, seatType: tier, price },
      ]);
    }
  };

  // Financial calculations
  const subtotal = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
  const gstRate = 0.18; // 18% GST
  const gstAmount = Math.round(subtotal * gstRate * 100) / 100;
  const grandTotal = Math.round((subtotal + gstAmount) * 100) / 100;

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (selectedSeats.length === 0) {
      setSeatError('Please choose at least 1 seat before proceeding.');
      return;
    }

    onProceedToCheckout({
      movie,
      showDate: selectedDate,
      showtime: selectedTime,
      seats: selectedSeats,
      subtotal,
      gstRate,
      gstAmount,
      totalAmount: grandTotal,
    });
  };

  if (!isOpen || !movie) return null;

  return (
    <div
      className="modal fade show d-block seat-matrix-modal-backdrop"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content bg-cinema-dark border-secondary border-opacity-50 text-light shadow-2xl">
          {/* Header */}
          <div className="modal-header border-secondary border-opacity-25 pb-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-2 shadow-sm"
                style={{ width: '48px', height: '64px', objectFit: 'cover' }}
              />
              <div>
                <h5 className="modal-title fw-bold text-light mb-0 d-flex align-items-center gap-2">
                  <span>{movie.title}</span>
                  <span className="badge bg-danger font-monospace" style={{ fontSize: '0.7rem' }}>
                    {movie.certificate}
                  </span>
                </h5>
                <span className="text-secondary small">
                  {movie.hall || 'Audi 1 (IMAX 4K Atmos)'} • {movie.duration} • {movie.language}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-3 p-md-4">
            {/* Date & Showtime Selectors */}
            <div className="row g-3 mb-4 p-3 rounded-3 bg-dark bg-opacity-60 border border-secondary border-opacity-25 align-items-center">
              {/* Dates */}
              <div className="col-12 col-md-5">
                <label className="text-secondary small fw-bold text-uppercase d-block mb-2">
                  <i className="bi bi-calendar3 me-1 text-danger"></i> Select Date:
                </label>
                <div className="d-flex gap-2">
                  {DATES.map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setSelectedDate(d.date)}
                      className={`btn btn-sm px-3 rounded-pill transition-all ${
                        selectedDate === d.date
                          ? 'btn-danger fw-bold shadow-sm'
                          : 'btn-outline-secondary text-light'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Showtimes */}
              <div className="col-12 col-md-7">
                <label className="text-secondary small fw-bold text-uppercase d-block mb-2">
                  <i className="bi bi-clock-history me-1 text-warning"></i> Select Showtime (IST):
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {(movie.showtimes || ['10:30 AM', '01:45 PM', '05:15 PM', '08:30 PM']).map(
                    (time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`btn btn-sm px-3 rounded-pill transition-all ${
                          selectedTime === time
                            ? 'btn-warning text-dark fw-bold shadow-sm'
                            : 'btn-outline-secondary text-light'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Cinema Screen Visual Graphic */}
            <div className="cinema-screen-container text-center my-4">
              <div className="cinema-screen-arc"></div>
              <div className="cinema-screen-glow"></div>
              <div className="text-uppercase small tracking-widest text-secondary fw-semibold mt-2">
                <i className="bi bi-display me-1 text-info"></i> All Eyes This Way • Cinema Screen
              </div>
            </div>

            {/* Error or Live Locking Alert */}
            {seatError && (
              <div className="alert alert-warning py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{seatError}</span>
              </div>
            )}

            {/* Seat Matrix Grid */}
            <div className="seat-matrix-wrapper my-4">
              {loadingSeats ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-danger spinner-border-sm me-2" role="status"></div>
                  <span className="text-secondary small">Synchronizing real-time seat status...</span>
                </div>
              ) : (
                <div className="seats-container">
                  {ROWS.map((row) => {
                    const tier = getSeatTier(row);
                    const isVip = tier === 'VIP';

                    return (
                      <div key={row} className="seat-row d-flex align-items-center justify-content-center mb-2">
                        {/* Row Identifier */}
                        <div
                          className={`seat-row-label me-2 fw-bold font-monospace ${
                            isVip ? 'text-warning' : 'text-secondary'
                          }`}
                          style={{ width: '28px' }}
                        >
                          {row}
                        </div>

                        {/* 8 Seats per Row with Aisle in Center (after seat 4) */}
                        <div className="d-flex gap-1 gap-md-2">
                          {COLS.map((col) => {
                            const seatId = `${row}${col}`;
                            const isOccupied = occupiedSeats.includes(seatId);
                            const isSelected = selectedSeats.some(
                              (s) => s.seatNumber === seatId
                            );

                            return (
                              <React.Fragment key={seatId}>
                                <button
                                  type="button"
                                  disabled={isOccupied}
                                  onClick={() => toggleSeat(seatId, tier)}
                                  className={`seat-btn ${
                                    isOccupied
                                      ? 'seat-occupied'
                                      : isSelected
                                      ? isVip
                                        ? 'seat-selected-vip'
                                        : 'seat-selected-std'
                                      : isVip
                                      ? 'seat-available-vip'
                                      : 'seat-available-std'
                                  }`}
                                  title={`${seatId} (${tier} - ₹${PRICING[tier]})${
                                    isOccupied ? ' [OCCUPIED / RESERVED]' : ''
                                  }`}
                                >
                                  {isOccupied ? (
                                    <i className="bi bi-lock-fill" style={{ fontSize: '0.65rem' }}></i>
                                  ) : (
                                    seatId
                                  )}
                                </button>
                                {/* Center Aisle separation between column 4 and 5 */}
                                {col === 4 && <div className="seat-aisle-gap"></div>}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Tier Label badge on right */}
                        <div
                          className={`ms-2 font-monospace small d-none d-sm-block ${
                            isVip ? 'text-warning' : 'text-secondary'
                          }`}
                          style={{ width: '70px', fontSize: '0.72rem' }}
                        >
                          {tier} (₹{PRICING[tier]})
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Seat Map Legend */}
            <div className="seat-legend d-flex flex-wrap justify-content-center gap-3 gap-md-4 py-2 border-top border-bottom border-secondary border-opacity-25 small text-secondary">
              <div className="d-flex align-items-center gap-2">
                <span className="legend-box seat-available-std"></span>
                <span>Standard (₹250)</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="legend-box seat-available-vip"></span>
                <span className="text-warning">VIP Row A-B (₹450)</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="legend-box seat-selected-std"></span>
                <span className="text-light">Selected</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="legend-box seat-occupied d-flex align-items-center justify-content-center text-secondary">
                  <i className="bi bi-lock-fill" style={{ fontSize: '0.6rem' }}></i>
                </span>
                <span>Reserved / Locked</span>
              </div>
            </div>

            {/* Live Calculation Tray */}
            <div className="calculation-tray mt-4 p-3 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-50">
              <div className="row g-3 align-items-center">
                {/* Selected seats list */}
                <div className="col-12 col-lg-6">
                  <div className="small text-secondary mb-1">
                    Selected Seats ({selectedSeats.length}):
                  </div>
                  {selectedSeats.length === 0 ? (
                    <div className="text-secondary fst-italic small">
                      No seats selected yet. Click on the seats above to choose.
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-1">
                      {selectedSeats.map((s) => (
                        <span
                          key={s.seatNumber}
                          className={`badge rounded-pill ${
                            s.seatType === 'VIP' ? 'bg-warning text-dark' : 'bg-danger text-light'
                          }`}
                        >
                          {s.seatNumber} ({s.seatType} - ₹{s.price})
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtotal, GST, Total Breakdown */}
                <div className="col-12 col-lg-6">
                  <div className="p-2 rounded bg-black bg-opacity-50 border border-secondary border-opacity-25 text-end font-monospace">
                    <div className="d-flex justify-content-between small text-secondary">
                      <span>Subtotal:</span>
                      <span className="text-light">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between small text-secondary">
                      <span>GST (18%):</span>
                      <span className="text-light">₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between fs-5 fw-bold text-warning border-top border-secondary border-opacity-25 pt-1 mt-1">
                      <span>Total Amount:</span>
                      <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="modal-footer border-secondary border-opacity-25 d-flex justify-content-between">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
              Cancel
            </button>

            <button
              type="button"
              disabled={selectedSeats.length === 0}
              onClick={handleCheckoutClick}
              className="btn btn-danger px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow"
            >
              <span>Proceed to Checkout</span>
              <span className="badge bg-white text-danger font-monospace">
                ₹{grandTotal.toFixed(2)}
              </span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatMatrixModal;

