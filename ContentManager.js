const { ContentFactory, EventEmitter, ContentProxy, ContentIterator } = require('./index');
const { Movie, EnhancedMovie } = require('./Movie');
const mysql = require('mysql2/promise');

class ContentManager extends EventEmitter {
    constructor() {
        super();
        this.contents = [];
        this.currentIndex = 0;
        this.db = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'pass',
            database: 'streamflix_db'
        });
    }

    async initialize() {
        const [rows] = await this.db.query(`
            SELECT m.*, GROUP_CONCAT(g.name) as genres
            FROM movies m
            LEFT JOIN movie_genres mg ON m.movie_id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.genre_id
            GROUP BY m.movie_id
        `);
        this.contents = rows.map(row => {
            const data = {
                id: row.movie_id,
                title: row.title,
                duration: row.duration,
                quality: 'HD', // Default quality
                rating: row.rating,
                genres: row.genres ? row.genres.split(',') : [],
                streamUrl: row.stream_url
            };
            return new ContentProxy(ContentFactory.createContent('movie', data));
        });
        this.notify('contentLoaded', this.contents);
    }

    addContent(type, data) {
        const content = ContentFactory.createContent(type, data);
        this.contents.push(new ContentProxy(content));
        this.notify('contentAdded', content);
        return content;
    }

    getNextContent() {
        const iterator = new ContentIterator(this.contents);
        while (iterator.hasNext()) {
            const content = iterator.next();
            if (content && this.canAccess(content)) {
                return content;
            }
        }
        return null;
    }

    canAccess(content) {
        return content.checkAccess();
    }

    onContentAdded(callback) {
        this.subscribe('contentAdded', callback);
    }

    onContentRemoved(callback) {
        this.subscribe('contentRemoved', callback);
    }

    enhanceContent(contentId) {
        const content = this.contents.find(c => c.content.id === contentId);
        if (content) {
            const enhancedContent = new EnhancedMovie(content.content);
            this.contents = this.contents.map(c => 
                c.content.id === contentId ? new ContentProxy(enhancedContent) : c
            );
            this.notify('contentEnhanced', enhancedContent);
        }
    }

    filterContent(criteria) {
        return this.contents.filter(content => {
            const movieInfo = content.content.getInfo();
            return Object.entries(criteria).every(([key, value]) => 
                movieInfo[key] === value
            );
        });
    }

    processContent(contentId) {
        const content = this.contents.find(c => c.content.id === contentId);
        if (content) {
            content.content.process();
        }
    }

    getContentByCategory(category) {
        return this.contents.filter(content => 
            content.content.genres.includes(category)
        );
    }

    getTrendingContent() {
        return this.contents
            .sort((a, b) => b.content.rating - a.content.rating)
            .slice(0, 10);
    }

    getRecommendedContent(userPreferences) {
        return this.contents
            .filter(content => {
                const movieInfo = content.content.getInfo();
                return userPreferences.genres.some(genre => 
                    movieInfo.genres.includes(genre)
                );
            })
            .sort((a, b) => b.content.rating - a.content.rating)
            .slice(0, 5);
    }
}

module.exports = ContentManager;
