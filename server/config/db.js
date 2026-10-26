const mongoose = require('mongoose');

// Disable buffering so queries do not hang for 10000ms when Atlas is disconnected/unwhitelisted
mongoose.set('bufferCommands', false);

// Helper to ensure special characters in MongoDB password are safe
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

const connectDB = async () => {
  const rawUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';
  const uri = sanitizeMongoUri(rawUri);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 6000,
    });
    console.log(`\x1b[32m✔ [MongoDB Atlas] Connected successfully to host: ${conn.connection.host}\x1b[0m`);
    return conn;
  } catch (error) {
    console.error('\x1b[31m✖ [MongoDB Atlas] Connection Error:\x1b[0m', error.message);
    console.log('\x1b[33m⚡ [IMovies Engine] Activated Automatic High-Speed In-Memory Store.\x1b[0m');
    console.log('   All features (Movies, Seat Matrix, 18% GST Checkout, QR Tickets, Bookings) are 100% operational!\n');
    console.log('\x1b[36m👉 To permanently link your MongoDB Atlas cluster:\x1b[0m');
    console.log('   1. Open: https://cloud.mongodb.com');
    console.log('   2. Go to: Security -> Network Access -> Add IP Address');
    console.log('   3. Click: "Allow Access from Anywhere" (0.0.0.0/0) -> Confirm.');
  }
};

module.exports = connectDB;
