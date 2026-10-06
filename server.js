// server.js
//
// Entry point for CineTrack. Sets up the Express server, connects to
// MongoDB, serves the frontend, and mounts the two REST API routers:
//   /api/movies     -> movie search/trending/popular (proxied from TMDB)
//   /api/watchlist  -> the user's saved watchlist (stored in MongoDB)

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// MongoDB connection (URI comes from .env; falls back to a local database)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinetrack', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Routes
const movieRoutes = require('./routes/movies');
const watchlistRoutes = require('./routes/watchlist');

app.use('/api/movies', movieRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Serve the single-page frontend
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});