// ============================================================
// server.js — Main Entry Point for SHAGUN Wedding Planners API
// ============================================================

const express     = require('express');
const mongoose    = require('mongoose');
const cors        = require('cors');
const dotenv      = require('dotenv');
const path        = require('path');

// ── Load Environment Variables ─────────────────────────────
dotenv.config();

// ── App Init ───────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5500',   // Live Server (VS Code)
    'http://localhost:5500',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Serve Frontend Static Files ────────────────────────────
// Serves the entire frontend folder at the root URL so you can
// open http://localhost:5000 and navigate the site directly.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Routes ─────────────────────────────────────────────
const authRoutes    = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

app.use('/api/auth',     authRoutes);
app.use('/api/bookings', bookingRoutes);

// ── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status : 'ok',
    message: 'SHAGUN Wedding Planners API is running 🎊',
    time   : new Date().toISOString()
  });
});

// ── Catch-all: serve index.html for any unmatched route ────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── Global Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ── MongoDB Connection + Server Start ──────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shagun_db';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser   : true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB connected →', MONGO_URI);

    app.listen(PORT, () => {
      console.log(`🚀 SHAGUN API running at http://localhost:${PORT}`);
      console.log(`🌐 Open website at  http://localhost:${PORT}`);
      console.log(`🔍 Health check at  http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
