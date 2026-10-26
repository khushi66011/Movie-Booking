const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Movie = require('./models/Movie');

// Load environment variables
dotenv.config();

const mongoose = require('mongoose');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auto-seed sample catalog if collection is empty
const autoSeedIfEmpty = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return;
    }
    const count = await Movie.countDocuments();
    if (count === 0) {
      console.log('[IMovies Server] Movies collection empty. Auto-seeding initial catalog...');
      const sampleMovies = [
        {
          title: 'Interstellar: Beyond Time',
          description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft to find a new planet for humans.',
          genre: ['Sci-Fi', 'Adventure', 'Drama'],
          language: 'English & Hindi (Dolby Atmos)',
          duration: '2h 49m',
          releaseDate: 'Re-Release Oct 2026',
          posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
          rating: 9.2,
          votes: '82.4K',
          certificate: 'UA 16+',
          hall: 'Audi 1 (IMAX 4K Laser)',
          showtimes: ['10:00 AM', '01:30 PM', '05:00 PM', '08:45 PM', '11:45 PM'],
          pricing: { vip: 450, standard: 250 },
          featured: true,
        },
        {
          title: 'Dune: Awakening Part II',
          description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.',
          genre: ['Sci-Fi', 'Action', 'Adventure'],
          language: 'English & Hindi',
          duration: '2h 46m',
          releaseDate: 'Now Showing',
          posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
          rating: 8.9,
          votes: '64.1K',
          certificate: 'UA 16+',
          hall: 'Audi 2 (Dolby Cinema 7.1)',
          showtimes: ['11:00 AM', '02:45 PM', '06:15 PM', '09:30 PM'],
          pricing: { vip: 450, standard: 250 },
          featured: true,
        },
        {
          title: 'Vanguard: Cyber Dynasty',
          description: 'In neo-Mumbai 2099, a covert operative uncovers a sinister syndicate threatening digital civilization and autonomous defense networks.',
          genre: ['Action', 'Thriller', 'Sci-Fi'],
          language: 'Hindi & Tamil',
          duration: '2h 28m',
          releaseDate: 'New Release',
          posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1600&q=80',
          rating: 8.7,
          votes: '39.8K',
          certificate: 'A 18+',
          hall: 'Audi 3 (4DX Sensory Experience)',
          showtimes: ['10:45 AM', '02:00 PM', '05:30 PM', '08:45 PM'],
          pricing: { vip: 450, standard: 250 },
          featured: false,
        },
        {
          title: 'The Silent Mirage',
          description: 'A psychological thriller tracking a master detective who investigates an impossible locked-room disappearance in the royal dunes of Rajasthan.',
          genre: ['Thriller', 'Mystery', 'Drama'],
          language: 'Hindi (Subtitled)',
          duration: '2h 15m',
          releaseDate: 'Oct 2026',
          posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
          rating: 8.4,
          votes: '28.3K',
          certificate: 'UA 16+',
          hall: 'Audi 4 (Prime Gold)',
          showtimes: ['12:15 PM', '03:45 PM', '07:15 PM', '10:30 PM'],
          pricing: { vip: 450, standard: 250 },
          featured: false,
        },
        {
          title: 'Laugh Out Loud: The Big Fat Wedding',
          description: 'When two chaotic families assemble for a lavish destination wedding in Goa, an uproarious series of mistaken identities ensues.',
          genre: ['Comedy', 'Romance'],
          language: 'Hindi',
          duration: '2h 10m',
          releaseDate: 'Festival Special',
          posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
          rating: 8.1,
          votes: '21.5K',
          certificate: 'U (Universal)',
          hall: 'Audi 5 (Dolby Atmos)',
          showtimes: ['11:30 AM', '02:30 PM', '06:00 PM', '09:00 PM'],
          pricing: { vip: 450, standard: 250 },
          featured: false,
        },
        {
          title: 'Chronicles of the Cosmic Blade',
          description: 'An ancient warrior must awaken the legendary blade to protect the realms from an interdimensional rift that threatens total oblivion.',
          genre: ['Action', 'Fantasy', 'Adventure'],
          language: 'Hindi & Telugu',
          duration: '2h 35m',
          releaseDate: 'Blockbuster',
          posterUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=800&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
          rating: 8.6,
          votes: '33.9K',
          certificate: 'UA 16+',
          hall: 'Audi 1 (IMAX 4K Laser)',
          showtimes: ['01:00 PM', '04:30 PM', '08:00 PM', '11:15 PM'],
          pricing: { vip: 450, standard: 250 },
          featured: true,
        },
      ];
      await Movie.insertMany(sampleMovies);
      console.log(`[IMovies Server] Auto-seeded ${sampleMovies.length} movies.`);
    }
  } catch (e) {
    console.warn('[IMovies Server] Auto-seed deferred:', e.message);
  }
};

mongoose.connection.once('open', () => {
  autoSeedIfEmpty();
});

// API Route Mounts
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/bookings', require('./routes/bookings'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: 'IMovies API Server',
    environment: process.env.NODE_ENV || 'development',
    serverTimeIST: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
  });
});

// Root API Welcome
app.get('/', (req, res) => {
  res.send('🎬 IMovies Cinema Ticket Booking API is running smoothly.');
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 IMovies Server running on port ${PORT}`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api`);
  console.log(`🎬 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});

