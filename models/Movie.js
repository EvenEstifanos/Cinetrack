// models/Movie.js
//
// Mongoose schema for a watchlist entry. Movies added from search keep
// their TMDB id (unique, so the same movie can't be added twice); custom
// movies added by hand have no TMDB id, which is why the index is sparse.

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true
  },
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  // TMDB's public rating (0-10)
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  overview: String,
  posterPath: String,
  addedAt: {
    type: Date,
    default: Date.now
  },
  // The user's own rating (0-10)
  userRating: {
    type: Number,
    min: 0,
    max: 10
  },
  watched: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Movie', movieSchema);