-- Create the database
CREATE DATABASE IF NOT EXISTS streamflix_db;
USE streamflix_db;

-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    subscription_status ENUM('active', 'inactive', 'cancelled') DEFAULT 'inactive',
    subscription_plan ENUM('basic', 'standard', 'premium') DEFAULT 'basic'
);

-- Movies table
CREATE TABLE movies (
    movie_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INT,
    duration INT, -- in minutes
    rating DECIMAL(3,1),
    poster_url VARCHAR(255),
    trailer_url VARCHAR(255),
    stream_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Genres table
CREATE TABLE genres (
    genre_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Movie-Genre relationship
CREATE TABLE movie_genres (
    movie_id INT,
    genre_id INT,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE
);

-- Watchlist table
CREATE TABLE watchlist (
    user_id INT,
    movie_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    movie_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
);

-- Subscription Plans table
CREATE TABLE subscription_plans (
    plan_id INT PRIMARY KEY AUTO_INCREMENT,
    name ENUM('basic', 'standard', 'premium'),
    price DECIMAL(10,2) NOT NULL,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Subscriptions table
CREATE TABLE user_subscriptions (
    subscription_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    plan_id INT,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id)
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, features) VALUES
('basic', 8.99, '{"quality": "HD", "devices": 1, "downloads": false}'),
('standard', 13.99, '{"quality": "Full HD", "devices": 2, "downloads": true}'),
('premium', 17.99, '{"quality": "4K + HDR", "devices": 4, "downloads": true}');

-- Insert default genres
INSERT INTO genres (name) VALUES
('Action'),
('Comedy'),
('Drama'),
('Fantasy'),
('Horror'),
('Sci-Fi'),
('Romance'),
('Thriller'),
('Documentary'),
('Animation'),
('K-Drama'),
('Anime');

-- Insert new movies
INSERT INTO movies (title, description, release_year, duration, rating, poster_url, stream_url) VALUES
('Attack on Titan', 'A post-apocalyptic world where humans fight giant Titans.', 2013, 25, 8.8, '/assets/images/aot.jpg', '/assets/videos/aot.mp4'),
('Demon Slayer', 'A young boy becomes a demon slayer to save his sister.', 2019, 24, 8.7, '/assets/images/ds.jpg', '/assets/videos/ds.mp4'),
('Inglourious Basterds', 'A group of soldiers plot to assassinate Nazi leaders.', 2009, 153, 8.3, '/assets/images/ib.jpg', '/assets/videos/ib.mp4'),
('Squid Game', 'Contestants risk their lives in deadly games for a cash prize.', 2021, 55, 8.0, '/assets/images/sg.jpg', '/assets/videos/sg.mp4'),
('Surf''s Up', 'A penguin competes in a surfing championship.', 2007, 85, 6.7, '/assets/images/su.jpg', '/assets/videos/su.mp4');

-- Insert movie-genre relationships
INSERT INTO movie_genres (movie_id, genre_id) VALUES
((SELECT movie_id FROM movies WHERE title = 'Attack on Titan'), (SELECT genre_id FROM genres WHERE name = 'Anime')),
((SELECT movie_id FROM movies WHERE title = 'Attack on Titan'), (SELECT genre_id FROM genres WHERE name = 'Action')),
((SELECT movie_id FROM movies WHERE title = 'Demon Slayer'), (SELECT genre_id FROM genres WHERE name = 'Anime')),
((SELECT movie_id FROM movies WHERE title = 'Demon Slayer'), (SELECT genre_id FROM genres WHERE name = 'Action')),
((SELECT movie_id FROM movies WHERE title = 'Inglourious Basterds'), (SELECT genre_id FROM genres WHERE name = 'Drama')),
((SELECT movie_id FROM movies WHERE title = 'Inglourious Basterds'), (SELECT genre_id FROM genres WHERE name = 'Thriller')),
((SELECT movie_id FROM movies WHERE title = 'Squid Game'), (SELECT genre_id FROM genres WHERE name = 'Thriller')),
((SELECT movie_id FROM movies WHERE title = 'Squid Game'), (SELECT genre_id FROM genres WHERE name = 'Drama')),
((SELECT movie_id FROM movies WHERE title = 'Surf''s Up'), (SELECT genre_id FROM genres WHERE name = 'Animation')),
((SELECT movie_id FROM movies WHERE title = 'Surf''s Up'), (SELECT genre_id FROM genres WHERE name = 'Comedy'));

-- Create indexes for better performance
CREATE INDEX idx_movies_title ON movies(title);
CREATE INDEX idx_movies_rating ON movies(rating);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_reviews_movie ON reviews(movie_id);
CREATE INDEX idx_watchlist_user ON watchlist(user_id);