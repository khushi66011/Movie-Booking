import React from 'react';

const GENRES = ['All', 'Sci-Fi', 'Action', 'Adventure', 'Thriller', 'Drama', 'Comedy'];

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  totalResults,
}) => {
  return (
    <div className="search-filter-card p-3 p-md-4 rounded-4 mb-4 border border-secondary border-opacity-25 bg-dark-cinema shadow">
      <div className="row g-3 align-items-center">
        {/* Real-time Search Box */}
        <div className="col-12 col-lg-5">
          <div className="input-group">
            <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-warning">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary placeholder-secondary"
              placeholder="Search by movie title, genre, or language..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search movies"
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary border-secondary text-light"
                type="button"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="col-12 col-lg-7">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="text-secondary small fw-medium me-1 d-none d-sm-inline">
              <i className="bi bi-funnel-fill text-danger me-1"></i>Genre:
            </span>
            {GENRES.map((genre) => {
              const isActive = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => onGenreChange(genre)}
                  className={`btn btn-sm rounded-pill px-3 transition-all ${
                    isActive
                      ? 'btn-danger shadow-sm fw-semibold'
                      : 'btn-outline-secondary text-light border-opacity-50'
                  }`}
                  style={{ fontSize: '0.82rem' }}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info indicator */}
      <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary border-opacity-25 text-secondary small">
        <div>
          Showing <span className="text-light fw-bold">{totalResults}</span> blockbuster movie
          {totalResults === 1 ? '' : 's'} in Indian Standard Time (IST)
        </div>
        <div className="d-flex align-items-center gap-3">
          <span>
            <i className="bi bi-ticket-fill text-danger me-1"></i>Standard: <strong className="text-warning">₹250</strong>
          </span>
          <span>
            <i className="bi bi-gem text-warning me-1"></i>VIP: <strong className="text-warning">₹450</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;

