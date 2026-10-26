import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchFilter from './components/SearchFilter';
import MovieGrid from './components/MovieGrid';
import SeatMatrixModal from './components/SeatMatrixModal';
import CheckoutModal from './components/CheckoutModal';
import DigitalTicket from './components/DigitalTicket';
import BookingHistory from './components/BookingHistory';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import api from './services/api';
import './App.css';

function MainCatalog({
  onBookMovie,
}) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Fetch movies from API with search & genre filtering
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedGenre && selectedGenre !== 'All') params.genre = selectedGenre;

      const data = await api.get('/movies', params);
      if (data.success && Array.isArray(data.movies)) {
        setMovies(data.movies);
      }
    } catch (err) {
      console.error('[Movies Catalog Error]:', err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedGenre]);

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchMovies();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchMovies]);

  return (
    <div>
      {/* Cinematic Hero Section */}
      <section className="hero-banner py-5 px-3 mb-4 text-center">
        <div className="container py-3">
          <div className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-3 py-1 rounded-pill mb-3 font-monospace small">
            <i className="bi bi-stars me-1"></i> NEXT-GEN CINEMA BOOKING
          </div>
          <h1 className="display-4 fw-bold text-light mb-3 tracking-wide">
            Experience Stories on the <span className="text-danger">Grand Screen</span>
          </h1>
          <p className="lead text-secondary max-w-2xl mx-auto mb-4" style={{ maxWidth: '640px' }}>
            Book premium IMAX 4K Laser and Dolby Atmos recliner seats in Indian Standard Time (IST).
            Real-time interactive matrix with instant digital QR e-tickets.
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="container pb-5">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          totalResults={movies.length}
        />

        <MovieGrid
          movies={movies}
          loading={loading}
          onBookClick={onBookMovie}
        />
      </div>
    </div>
  );
}

function App() {
  const { openAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Booking Flow State
  const [activeMovieForBooking, setActiveMovieForBooking] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);

  // Trigger Seat Matrix
  const handleOpenSeatMatrix = (movie) => {
    setActiveMovieForBooking(movie);
  };

  // From Seat Matrix to Checkout
  const handleProceedToCheckout = (data) => {
    setActiveMovieForBooking(null);
    setCheckoutData(data);
  };

  // From Checkout to Ticket or Booking History
  const handleBookingSuccess = (booking, action) => {
    setCheckoutData(null);
    if (action === 'view_ticket') {
      setCurrentTicket(booking);
    } else if (action === 'view_history') {
      navigate('/my-bookings');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navigation */}
      <Navbar onOpenAuth={openAuthModal} />

      {/* Main Routes */}
      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={<MainCatalog onBookMovie={handleOpenSeatMatrix} />}
          />
          <Route path="/my-bookings" element={<BookingHistory />} />
        </Routes>
      </main>

      {/* Interactive Seat Matrix Modal */}
      {activeMovieForBooking && (
        <SeatMatrixModal
          movie={activeMovieForBooking}
          isOpen={!!activeMovieForBooking}
          onClose={() => setActiveMovieForBooking(null)}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* Checkout & GST Breakdown Modal */}
      {checkoutData && (
        <CheckoutModal
          bookingData={checkoutData}
          isOpen={!!checkoutData}
          onClose={() => setCheckoutData(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Standalone Digital Printable E-Ticket View */}
      {currentTicket && (
        <div className="modal fade show d-block checkout-modal-backdrop" tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-transparent border-0">
              <DigitalTicket
                booking={currentTicket}
                onClose={() => setCurrentTicket(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* User Authentication Modal (Login / Register) */}
      <AuthModal />

      {/* Cinema Footer */}
      <footer className="footer bg-dark-cinema border-top border-secondary border-opacity-25 py-4 text-center text-secondary small d-print-none mt-auto">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span className="brand-title fs-6">
                <span className="text-danger">I</span>MOVIES
              </span>
              <span>© {new Date().getFullYear()} IMovies Entertainment Ltd. India.</span>
            </div>
            <div className="d-flex gap-3">
              <span>Standard: ₹250</span>
              <span>•</span>
              <span className="text-warning">VIP: ₹450</span>
              <span>•</span>
              <span>GST: 18%</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

