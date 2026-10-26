import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, loading, onBookClick }) => {
  if (loading) {
    return (
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-3 g-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div className="col" key={n}>
            <div
              className="card h-100 bg-dark-cinema border-0 p-3 rounded-4 shadow-sm placeholder-glow"
              style={{ minHeight: '440px' }}
            >
              <div
                className="placeholder col-12 rounded-3 mb-3"
                style={{ height: '260px', backgroundColor: '#1e2230' }}
              ></div>
              <div
                className="placeholder col-8 mb-2"
                style={{ height: '20px', backgroundColor: '#1e2230' }}
              ></div>
              <div
                className="placeholder col-5 mb-3"
                style={{ height: '14px', backgroundColor: '#1e2230' }}
              ></div>
              <div
                className="placeholder col-12 mt-auto"
                style={{ height: '40px', backgroundColor: '#2d3348' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-5 bg-dark-cinema rounded-4 border border-secondary border-opacity-25 shadow-sm p-5 my-4">
        <i className="bi bi-camera-reels text-secondary fs-1 mb-3 d-block"></i>
        <h4 className="text-light fw-bold">No movies matched your search</h4>
        <p className="text-secondary mb-4">
          Try clearing your search query or selecting another genre category.
        </p>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-3 g-4 mb-5">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} onBookClick={onBookClick} />
      ))}
    </div>
  );
};

export default MovieGrid;

