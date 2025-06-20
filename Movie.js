const { ContentProcessor } = require('./index');

class Movie extends ContentProcessor {
    constructor(data) {
        super();
        this.id = data.id;
        this.title = data.title;
        this.duration = data.duration;
        this.quality = data.quality || 'HD';
        this.rating = data.rating || 0;
        this.genres = data.genres || [];
        this.streamUrl = data.streamUrl;
        this.subtitles = [];
    }

    getInfo() {
        return {
            id: this.id,
            title: this.title,
            duration: this.duration,
            quality: this.quality,
            rating: this.rating,
            genres: this.genres,
            streamUrl: this.streamUrl
        };
    }

    play() {
        console.log(`Playing movie: ${this.title}`);
        return `Streaming ${this.title} in ${this.quality}`;
    }

    getSubtitles() {
        return this.subtitles;
    }

    validate() {
        if (!this.title || !this.streamUrl) {
            throw new Error('Invalid movie data');
        }
        return true;
    }

    load() {
        console.log(`Loading movie: ${this.title}`);
    }

    cleanup() {
        console.log(`Cleaning up movie: ${this.title}`);
    }
}

class EnhancedMovie extends Movie {
    constructor(movie) {
        super(movie);
        this.subtitles = [...movie.subtitles, 'Enhanced Audio Description'];
    }

    getQuality() {
        return `Enhanced ${super.quality}`;
    }
}

module.exports = { Movie, EnhancedMovie };