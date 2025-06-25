 StreamFlix

StreamFlix is a modern streaming platform built with Node.js, Express, MySQL, and vanilla JavaScript, designed to deliver a Netflix-inspired experience for watching movies and TV shows. It features a dynamic movie catalog, subscription-based access, and a responsive user interface with a sleek, dark-themed design.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features
- **Dynamic Movie Catalog**: Browse movies by category, view top picks, and filter content based on genres or user preferences.
- **Subscription Plans**: Supports multiple plans (`Basic`, `Standard`, `Premium`) with varying features like HD/4K streaming and device limits.
- **Responsive UI**: Dark-themed, Netflix-inspired interface with smooth animations, modals for login/signup, and a responsive layout for desktop and mobile.
- **Video Playback**: Stream movies with a dedicated video player interface (`player.html`).
- **Database Integration**: MySQL backend for managing movies, genres, users, subscriptions, watchlists, and reviews.
- **Event-Driven Architecture**: Uses an `EventEmitter` system for handling user actions like login, content playback, and subscription upgrades.
- **Content Management**: Proxy and iterator patterns for secure and efficient content access and navigation.
- **Customizable Styling**: CSS with custom properties, flexbox, grid, and responsive design for a polished user experience.

## Technologies
- **Backend**: Node.js, Express.js, MySQL2
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Database**: MySQL
- **Dependencies**:
  - `express`: Web server framework
  - `mysql2`: MySQL client for Node.js
  - `bcrypt`: Password hashing (for future authentication enhancements)
- **Design Patterns**: Factory, Proxy, Iterator, Command, Singleton, Strategy

## Installation
1. **Clone the Repository**:
   ```bash
   [git clone https://github.com/LeahAW00/streamflix.git]
   cd streamflix
   ```

2. **Install Dependencies**:
   Ensure Node.js and npm are installed, then run:
   ```bash
   npm install
   ```

3. **Set Up Environment**:
   - Update the MySQL connection details in `server.js` and `ContentManager.js` :
     ```javascript
     const db = mysql.createPool({
         host: 'localhost',
         user: 'root',
         password: 'your_password',
         database: 'streamflix_db'
     });
     ```

## Database Setup
1. **Install MySQL**: Ensure MySQL is installed and running on your system.
2. **Create the Database**:
   - Run the SQL script in `database.sql` to create the `streamflix_db` database and tables:
     ```bash
     mysql -u root -p < database.sql
     ```
   - Enter your MySQL root password when prompted.
3. **Verify Data**:
   - The script includes sample data for movies (e.g., *Attack on Titan*, *Squid Game*), genres, and subscription plans.
   - Check the `movies`, `genres`, and `subscription_plans` tables to ensure data is populated.

## Usage
1. **Start the Server**:
   ```bash
   npm start
   ```
   This runs `server.js`, starting the Express server on `http://localhost:3000`.

2. **Access the Application**:
   - Open a browser and navigate to `http://localhost:3000`.
   - Explore the homepage (`index.html`) to view top picks, browse categories, or select a subscription plan.
   - Use the login/signup modals to simulate user authentication (note: full authentication logic requires additional implementation).
   - Click a movie card to stream content in the video player (`player.html`).

3. **Interact with Features**:
   - **Browse Content**: View top picks or filter by category (e.g., Anime, Thriller) using the `ContentManager.js` functionality.
   - **Subscription Management**: Upgrade plans via `Subscription.js` (UI integration pending).
   - **Video Playback**: Play movies in `player.html` with basic controls (play/pause, full-screen).

4. **API Usage**:
   - Fetch top picks: `GET /api/top-picks`
     ```bash
     curl http://localhost:3000/api/top-picks
     ```
     Returns a JSON array of movies with titles, genres, ratings, and URLs.

## Project Structure
```
streamflix/
├── ContentManager.js       # Manages content loading, filtering, and enhancement
├── database.sql            # MySQL schema and sample data
├── index.html             # Main landing page
├── index.js               # Core classes (ContentFactory, EventEmitter, etc.)
├── Movie.js               # Movie and EnhancedMovie classes
├── package.json           # Project metadata and dependencies
├── player.html            # Video player interface
├── server.js              # Express server and API endpoints
├── StreamFlixApp.js       # Main app logic with event handling
├── Subscription.js        # Subscription plan management
├── styles.css             # Styling for the frontend
```

## API Endpoints
- **GET /api/top-picks**:
  - Returns a list of movies with titles, genres, ratings, poster URLs, and stream URLs.
  - Example response:
    ```json
    [
      {
        "title": "Attack on Titan",
        "genres": ["Anime", "Action"],
        "rating": 8.8,
        "poster_url": "/assets/images/aot.jpg",
        "stream_url": "/assets/videos/aot.mp4"
      },
      ...
    ]
    ```

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure code follows the project’s style (e.g., consistent naming, comments) and includes tests where applicable.

## Future Enhancements
- Implement full user authentication with `bcrypt` for playlists and watchlist functionality using the `watchlist` table.
- Add search functionality to filter movies by title or genre.
- Enhance the video player (`player.html`) with a progress bar, volume controls, and subtitle toggle.
- Implement a hamburger menu for mobile navigation.
- Add pagination or infinite scrolling for the movie catalog.
- Integrate dynamic hero images tied to featured25, 2025

