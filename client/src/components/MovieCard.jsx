import React from 'react';

const MovieCard = ({ movie, onBookClick }) => {
  return (
    <div className="col">
      <div className="card h-100 movie-card border-0 bg-dark-cinema shadow-lg overflow-hidden position-relative">
        {/* Poster Wrapper with Overlay Badges */}
        <div className="movie-poster-wrapper position-relative">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="card-img-top movie-poster"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Rating Badge */}
          <div className="position-absolute top-0 start-0 m-3">
            <span className="badge bg-dark bg-opacity-80 text-warning px-2 py-1 rounded-pill border border-warning border-opacity-25 shadow-sm">
              <i className="bi bi-star-fill text-warning me-1"></i>
              {movie.rating ? movie.rating.toFixed(1) : '8.5'}/10
            </span>
          </div>

          {/* Certificate Badge */}
          <div className="position-absolute top-0 end-0 m-3">
            <span className="badge bg-danger px-2 py-1 rounded font-monospace shadow-sm">
              {movie.certificate || 'UA 16+'}
            </span>
          </div>

          {/* Quick Hall Info Pill */}
          <div className="position-absolute bottom-0 start-0 w-100 p-2 movie-poster-gradient">
            <span className="badge bg-black bg-opacity-75 text-info border border-info border-opacity-50 small">
              <i className="bi bi-speaker me-1"></i>{movie.hall || 'Audi 1 - IMAX 4K'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column p-3 p-md-4">
          <h5 className="card-title text-light fw-bold mb-1 text-truncate" title={movie.title}>
            {movie.title}
          </h5>

          {/* Metadata */}
          <div className="text-secondary small mb-2 d-flex align-items-center gap-2">
            <span><i className="bi bi-clock me-1"></i>{movie.duration}</span>
            <span>•</span>
            <span className="text-truncate" style={{ maxWidth: '140px' }}>{movie.language}</span>
          </div>

          {/* Genre Badges */}
          <div className="d-flex flex-wrap gap-1 mb-3">
            {movie.genre &&
              movie.genre.slice(0, 3).map((g, idx) => (
                <span
                  key={idx}
                  className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-25"
                  style={{ fontSize: '0.72rem' }}
                >
                  {g}
                </span>
              ))}
          </div>

          {/* Short Synopsis */}
          <p
            className="card-text text-secondary small flex-grow-1 mb-3"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.45',
            }}
          >
            {movie.description}
          </p>

          {/* Pricing & CTA */}
          <div className="pt-3 border-top border-secondary border-opacity-25 mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="small text-secondary">
                From <span className="text-warning fw-bold fs-6">₹250</span> (Std) /{' '}
                <span className="text-warning fw-bold fs-6">₹450</span> (VIP)
              </div>
            </div>

            <button
              onClick={() => onBookClick(movie)}
              className="btn btn-danger w-100 py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm book-btn"
            >
              <i className="bi bi-ticket-perforated-fill fs-5"></i>
              <span>Book Seats</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

