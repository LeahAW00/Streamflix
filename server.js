const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'streamflix_db'
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// API endpoint to fetch top picks
app.get('/api/top-picks', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, GROUP_CONCAT(g.name) as genres
            FROM movies m
            LEFT JOIN movie_genres mg ON m.movie_id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.genre_id
            GROUP BY m.movie_id
        `);
        const movies = rows.map(row => ({
            title: row.title,
            genres: row.genres ? row.genres.split(',') : [],
            rating: row.rating,
            poster_url: row.poster_url,
            stream_url: row.stream_url
        }));
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
