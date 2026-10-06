// public/script.js
//
// Frontend logic (vanilla JavaScript, no framework). Handles tab switching,
// movie search, loading trending movies, rendering movie cards, and adding
// or removing watchlist entries by calling the server's REST API.

// State
let watchlist = [];
let currentTab = 'discover';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const trendingMovies = document.getElementById('trendingMovies');
const watchlistMovies = document.getElementById('watchlistMovies');
const watchlistCount = document.getElementById('watchlistCount');
const addMovieBtn = document.getElementById('addMovieBtn');
const movieTitle = document.getElementById('movieTitle');
const movieYear = document.getElementById('movieYear');
const movieRating = document.getElementById('movieRating');

console.log('Script loaded!'); // Debug

// Tab switching
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('Tab clicked:', btn.dataset.tab);
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');
    
    currentTab = tab;
    if (tab === 'watchlist') {
      loadWatchlist();
    }
  });
});

// Load trending movies on page load
window.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, fetching data...');
  loadTrending();
  loadWatchlist();
});

// Search functionality
searchBtn.addEventListener('click', searchMovies);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchMovies();
});

async function searchMovies() {
  const query = searchInput.value.trim();
  console.log('Searching for:', query);
  
  if (!query) {
    alert('Please enter a search term');
    return;
  }
  
  try {
    trendingMovies.innerHTML = '<p style="color: white; text-align: center;">Searching...</p>';
    const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    console.log('Search results:', data);
    
    if (data.results && data.results.length > 0) {
      displayMovies(data.results, trendingMovies);
    } else {
      trendingMovies.innerHTML = '<p style="color: white; text-align: center;">No movies found</p>';
    }
  } catch (error) {
    console.error('Search failed:', error);
    trendingMovies.innerHTML = '<p style="color: red; text-align: center;">Search failed. Please try again.</p>';
  }
}

async function loadTrending() {
  try {
    console.log('Loading trending movies...');
    trendingMovies.innerHTML = '<p style="color: white; text-align: center;">Loading...</p>';
    
    const response = await fetch('/api/movies/trending');
    const data = await response.json();
    console.log('Trending movies loaded:', data);
    
    if (data.results && data.results.length > 0) {
      displayMovies(data.results, trendingMovies);
    } else {
      trendingMovies.innerHTML = '<p style="color: white; text-align: center;">No trending movies available</p>';
    }
  } catch (error) {
    console.error('Failed to load trending:', error);
    trendingMovies.innerHTML = '<p style="color: red; text-align: center;">Failed to load movies. Check your TMDB API key.</p>';
  }
}

function displayMovies(movies, container) {
  console.log('Displaying', movies.length, 'movies');
  container.innerHTML = '';
  
  if (!movies || movies.length === 0) {
    container.innerHTML = '<p style="color: white; text-align: center;">No movies to display</p>';
    return;
  }
  
  movies.slice(0, 12).forEach(movie => {
    const card = createMovieCard(movie, false);
    container.appendChild(card);
  });
}

function createMovieCard(movie, isWatchlist) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  
  const posterPath = movie.posterPath || movie.poster_path;
  const posterUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : null;
  
  const year = movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A');
  const rating = movie.rating || movie.vote_average || 0;
  const movieId = movie._id || movie.id;
  
  card.innerHTML = `
    <div class="movie-poster">
      ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}" style="width: 100%; height: 100%; object-fit: cover;">` : '🎬'}
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${movie.title}</h3>
      <div class="movie-meta">
        <span class="movie-rating">⭐ ${rating.toFixed(1)}</span>
        <span class="movie-year">📅 ${year}</span>
      </div>
      <button class="movie-btn ${isWatchlist ? 'btn-remove' : 'btn-add'}" data-id="${movieId}">
        ${isWatchlist ? 'Remove' : '+ Add to Watchlist'}
      </button>
    </div>
  `;
  
  const btn = card.querySelector('.movie-btn');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('Button clicked for movie:', movie.title);
    if (isWatchlist) {
      removeFromWatchlist(movie._id);
    } else {
      addToWatchlist(movie);
    }
  });
  
  return card;
}

async function addToWatchlist(movie) {
  console.log('Adding to watchlist:', movie.title);
  
  try {
    const response = await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: movie.title,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : new Date().getFullYear(),
        rating: movie.vote_average || 0,
        overview: movie.overview || '',
        posterPath: movie.poster_path || '',
        tmdbId: movie.id
      })
    });
    
    if (response.ok) {
      alert('✅ Movie added to watchlist!');
      loadWatchlist();
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to add movie');
    }
  } catch (error) {
    console.error('Failed to add to watchlist:', error);
    alert('❌ Failed to add movie to watchlist');
  }
}

async function removeFromWatchlist(id) {
  console.log('Removing from watchlist:', id);
  
  try {
    const response = await fetch(`/api/watchlist/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      alert('✅ Movie removed from watchlist');
      loadWatchlist();
    } else {
      alert('❌ Failed to remove movie');
    }
  } catch (error) {
    console.error('Failed to remove from watchlist:', error);
    alert('❌ Failed to remove movie');
  }
}

async function loadWatchlist() {
  try {
    console.log('Loading watchlist...');
    const response = await fetch('/api/watchlist');
    watchlist = await response.json();
    console.log('Watchlist loaded:', watchlist);
    
    watchlistCount.textContent = `${watchlist.length} movie${watchlist.length !== 1 ? 's' : ''}`;
    
    watchlistMovies.innerHTML = '';
    
    if (watchlist.length === 0) {
      watchlistMovies.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Your watchlist is empty. Add some movies!</p>';
      return;
    }
    
    watchlist.forEach(movie => {
      const card = createMovieCard(movie, true);
      watchlistMovies.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load watchlist:', error);
    watchlistMovies.innerHTML = '<p style="color: red; text-align: center;">Failed to load watchlist</p>';
  }
}

// Add custom movie
addMovieBtn.addEventListener('click', async () => {
  const title = movieTitle.value.trim();
  const year = parseInt(movieYear.value);
  const rating = parseFloat(movieRating.value);
  
  console.log('Adding custom movie:', title, year, rating);
  
  if (!title || !year) {
    alert('⚠️ Please fill in title and year');
    return;
  }
  
  if (year < 1800 || year > 2100) {
    alert('⚠️ Please enter a valid year');
    return;
  }
  
  try {
    const response = await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        year,
        rating: rating || 0,
        overview: `Custom movie added by user`,
        posterPath: '',
        userRating: rating
      })
    });
    
    if (response.ok) {
      alert('✅ Movie added successfully!');
      movieTitle.value = '';
      movieYear.value = '';
      movieRating.value = '';
      loadWatchlist();
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to add movie');
    }
  } catch (error) {
    console.error('Failed to add custom movie:', error);
    alert('❌ Failed to add movie');
  }
});

console.log('All event listeners attached!');