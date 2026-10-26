const bcrypt = require('bcryptjs');

const initialMovies = [
  {
    _id: '671d45a90100000000000001',
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
    _id: '671d45a90100000000000002',
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
    _id: '671d45a90100000000000003',
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
    _id: '671d45a90100000000000004',
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
    _id: '671d45a90100000000000005',
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
    _id: '671d45a90100000000000006',
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

// In-Memory store arrays
let memoryMovies = [...initialMovies];
let memoryUsers = [
  {
    _id: '671d45a90100000000000099',
    name: 'Demo Moviegoer',
    email: 'guest@imovies.com',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    role: 'user',
  },
];
let memoryBookings = [
  {
    _id: '671d45a90100000000000055',
    bookingId: 'IMOV-DEMO01',
    user: '671d45a90100000000000099',
    movie: '671d45a90100000000000001',
    movieTitle: 'Interstellar: Beyond Time',
    moviePoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    certificate: 'UA 16+',
    hall: 'Audi 1 (IMAX 4K Laser)',
    showDate: '2026-10-27',
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
      user: 'Demo Moviegoer',
      movie: 'Interstellar: Beyond Time',
      date: '2026-10-27',
      time: '05:00 PM',
      seats: ['A4', 'A5'],
      total: '₹1062.00',
      status: 'VERIFIED_CONFIRMED',
    }),
    bookedAt: new Date(),
  },
];

module.exports = {
  getMovies: (search, genre) => {
    let list = [...memoryMovies];
    if (genre && genre !== 'All') {
      const gRegex = new RegExp(genre, 'i');
      list = list.filter((m) => m.genre.some((g) => gRegex.test(g)));
    }
    if (search && search.trim() !== '') {
      const sRegex = new RegExp(search.trim(), 'i');
      list = list.filter(
        (m) =>
          sRegex.test(m.title) ||
          sRegex.test(m.description) ||
          sRegex.test(m.language) ||
          m.genre.some((g) => sRegex.test(g))
      );
    }
    return list;
  },

  getMovieById: (id) => {
    return memoryMovies.find((m) => m._id.toString() === id.toString() || m.title === id);
  },

  findUserByEmail: (email) => {
    return memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById: (id) => {
    const u = memoryUsers.find((user) => user._id.toString() === id.toString());
    if (!u) return null;
    const { passwordHash, ...safeUser } = u;
    return safeUser;
  },

  createUser: async ({ name, email, password }) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = {
      _id: 'user_' + Date.now(),
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user',
    };
    memoryUsers.push(newUser);
    return newUser;
  },

  verifyPassword: async (enteredPassword, passwordHash) => {
    return await bcrypt.compare(enteredPassword, passwordHash);
  },

  getOccupiedSeats: (movieId, showDate, showtime) => {
    const bookings = memoryBookings.filter(
      (b) =>
        b.movie.toString() === movieId.toString() &&
        b.showDate === showDate &&
        b.showtime === showtime &&
        b.paymentStatus === 'CONFIRMED'
    );
    const seats = [];
    bookings.forEach((b) => {
      b.seats.forEach((s) => {
        if (!seats.includes(s.seatNumber)) seats.push(s.seatNumber);
      });
    });
    return seats;
  },

  createBooking: (booking) => {
    const newB = {
      _id: 'book_' + Date.now(),
      ...booking,
      createdAt: new Date(),
    };
    memoryBookings.unshift(newB);
    return newB;
  },

  getBookingsByUser: (userId) => {
    return memoryBookings.filter((b) => b.user.toString() === userId.toString());
  },

  getBookingById: (id) => {
    return memoryBookings.find(
      (b) => b._id.toString() === id.toString() || b.bookingId === id
    );
  },
};

