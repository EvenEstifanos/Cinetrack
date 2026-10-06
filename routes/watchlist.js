// routes/watchlist.js
//
// Full CRUD for the watchlist, stored in MongoDB:
//   GET    /api/watchlist       list all saved movies (newest  first)
//   POST   /api/watchlist       add a movie
//   PUT    /api/watchlist/:id   mark watched / change rating
//   DELETE /api/watchlist/:id   remove a movie

const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Get all movies in watchlist
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ addedAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Add movie to watchlist
router.post('/', async (req, res) => {
  try {
    const { title, year, rating, overview, posterPath, tmdbId, userRating } = req.body;
    
    const movie = new Movie({
      title,
      year,
      rating,
      overview,
      posterPath,
      tmdbId,
      userRating
    });
    
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    // 11000 = MongoDB duplicate-key error (movie already saved)
    if (error.code === 11000) {
      res.status(400).json({ error: 'Movie already in watchlist' });
    } else {
      res.status(500).json({ error: 'Failed to add movie' });
    }
  }
});

// Update movie (mark as watched or update rating)
router.put('/:id', async (req, res) => {
  try {
    const { watched, userRating } = req.body;
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { watched, userRating },
      { new: true }
    );
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// Delete movie from watchlist
router.delete('/:id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie removed from watchlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove movie' });
  }
});

module.exports = router;
