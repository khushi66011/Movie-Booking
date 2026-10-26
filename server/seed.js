const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const User = require('./models/User');
const Booking = require('./models/Booking');

dotenv.config();

const sampleMovies = [
  {
    title: 'Interstellar: Beyond Time',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
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
    description: 'In neo-Mumbai 2099, a covert operative uncovers a sinister syndicate threatening digital civilization and must fight against rogue autonomous defense networks.',
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
    description: 'When two chaotic families assemble for a lavish destination wedding in Goa, an uproarious series of mistaken identities and comedic mishaps ensues.',
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
    description: 'An ancient guardian must awaken the legendary blade to protect the seven realms from an interdimensional rift that threatens total oblivion.',
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

const sanitizeMongoUri = (uri) => {
  if (!uri) return uri;
  try {
    const regex = /^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@(.+)$/;
    const match = uri.match(regex);
    if (match) {
      const protocol = match[1];
      const username = encodeURIComponent(decodeURIComponent(match[2]));
      const password = encodeURIComponent(decodeURIComponent(match[3]));
      const rest = match[4];
      return `${protocol}${username}:${password}@${rest}`;
    }
  } catch (err) {}
  return uri;
};

const seedData = async () => {
  try {
    const rawUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';
    const mongoUri = sanitizeMongoUri(rawUri);
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri.replace(/:([^:@]{1,})@/, ':****@')}`);
    
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log('[Seed] Database connected!');

    // Clean existing movies
    await Movie.deleteMany({});
    console.log('[Seed] Cleared existing movies.');

    const createdMovies = await Movie.insertMany(sampleMovies);
    console.log(`[Seed] Successfully seeded ${createdMovies.length} blockbuster movies into IMovies!`);

    // Check if demo user exists
    let demoUser = await User.findOne({ email: 'guest@imovies.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Demo Moviegoer',
        email: 'guest@imovies.com',
        password: 'Password123!',
        role: 'user',
      });
      console.log('[Seed] Created demo user: guest@imovies.com (password: Password123!)');
    }

    // Seed a sample booking for the demo user
    const sampleMovie = createdMovies[0];
    const todayStr = '2026-10-27';
    await Booking.deleteMany({ bookingId: 'IMOV-DEMO01' });
    
    await Booking.create({
      bookingId: 'IMOV-DEMO01',
      user: demoUser._id,
      movie: sampleMovie._id,
      movieTitle: sampleMovie.title,
      moviePoster: sampleMovie.posterUrl,
      certificate: sampleMovie.certificate,
      hall: sampleMovie.hall,
      showDate: todayStr,
      showtime: '05:00 PM',
      seats: [
        { seatNumber: 'A4', seatType: 'VIP', price: 450 },
        { seatNumber: 'A5', seatType: 'VIP', price: 450 },
      ],
      subtotal: 900,
      gstRate: 0.18,
      gstAmount: 162,
      totalAmount: 1062,
      paymentStatus: 'CONFIRMED',
      paymentMethod: 'UPI - Instant Pay',
      qrData: JSON.stringify({
        bookingId: 'IMOV-DEMO01',
        user: demoUser.name,
        movie: sampleMovie.title,
        date: todayStr,
        time: '05:00 PM',
        seats: ['A4', 'A5'],
        total: '₹1062.00',
        status: 'VERIFIED_CONFIRMED',
      }),
      bookedAt: new Date(),
    });
    console.log('[Seed] Sample confirmed booking seeded: IMOV-DEMO01 (Seats: A4, A5 - VIP)');

    console.log('[Seed] Database seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err.message);
    process.exit(1);
  }
};

seedData();

