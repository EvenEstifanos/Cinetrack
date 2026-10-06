# CineTrack

A full-stack movie discovery and watchlist app. Browse trending movies, search the full TMDB catalog, and keep a personal watchlist with your own ratings, all backed by a REST API and MongoDB.

<!-- Screenshots: add home.png and watchlist.png to a screenshots/ folder -->
<p float="left">
  <img src="screenshots/home.png" width="400" />
  <img src="screenshots/watchlist.png" width="400" />
</p>

## Features

- **Trending movies:** loads this week's trending films on page open
- **Search:** find any movie in The Movie Database (TMDB) catalog
- **Watchlist:** save movies with one click; duplicates are blocked at the database level
- **Custom entries:** add movies by hand with your own year and rating
- **Ratings & watched status:** track your own 0–10 rating and what you've watched
- **Secure API key handling:** all TMDB requests go through the server, so the key never reaches the browser

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | EJS, HTML/CSS, vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| External API | TMDB API (via Axios) |

## REST API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies/trending` | This week's trending movies |
| GET | `/api/movies/popular` | Popular movies |
| GET | `/api/movies/search?query=` | Search movies by title |
| GET | `/api/watchlist` | List saved movies (newest first) |
| POST | `/api/watchlist` | Add a movie |
| PUT | `/api/watchlist/:id` | Mark watched / update rating |
| DELETE | `/api/watchlist/:id` | Remove a movie |

## Project Structure

```
├── server.js          # Express setup, MongoDB connection, routing
├── models/Movie.js    # Mongoose schema for watchlist entries
├── routes/
│   ├── movies.js      # TMDB-backed discovery endpoints
│   └── watchlist.js   # Watchlist CRUD endpoints
├── views/index.ejs    # Page layout
└── public/
    ├── script.js      # Frontend logic and API calls
    └── styles.css     # Styling
```

## Running Locally

```bash
git clone https://github.com/EvenEstifanos/cinetrack.git
cd cinetrack
npm install
cp .env.example .env   # then add your MongoDB URI and TMDB API key
npm start
```

Open http://localhost:3000. Get a free TMDB API key at [themoviedb.org](https://www.themoviedb.org/settings/api).

## Author

**Even Estifanos** · [GitHub](https://github.com/EvenEstifanos) · [LinkedIn](https://www.linkedin.com/in/even-estifanos-2ab18b2a6/)

*This product uses the TMDB API but is not endorsed or certified by TMDB.*
