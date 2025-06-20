class ContentFactory {
    static createContent(type, data) {
        switch (type) {
            case 'movie':
                return new (require('./Movie').Movie)(data);
            case 'series':
                return new Series(data);
            case 'documentary':
                return new Documentary(data);
            default:
                throw new Error('Invalid content type');
        }
    }
}

class Series {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.episodes = data.episodes || [];
    }
    play() {
        return `Playing series: ${this.title}`;
    }
}

class Documentary {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
    }
    play() {
        return `Playing documentary: ${this.title}`;
    }
}

class EventEmitter {
    constructor() {
        this.observers = new Map();
    }
    subscribe(event, callback) {
        if (!this.observers.has(event)) {
            this.observers.set(event, []);
        }
        this.observers.get(event).push(callback);
    }
    notify(event, data) {
        if (!this.observers.has(event)) return;
        this.observers.get(event).forEach(callback => callback(data));
    }
}

class StreamFlixState {
    static instance = null;
    constructor() {
        if (StreamFlixState.instance) {
            return StreamFlixState.instance;
        }
        this.user = null;
        this.currentContent = null;
        this.playbackState = null;
        StreamFlixState.instance = this;
    }
    static getInstance() {
        if (!StreamFlixState.instance) {
            StreamFlixState.instance = new StreamFlixState();
        }
        return StreamFlixState.instance;
    }
}

class SubscriptionStrategy {
    constructor(plan) {
        this.plan = plan;
    }
    getPrice() {
        return this.plan.price;
    }
    getFeatures() {
        return this.plan.features;
    }
}

class ContentDecorator {
    constructor(content) {
        this.content = content;
    }
    getQuality() {
        return this.content.quality;
    }
    getSubtitles() {
        return this.content.subtitles;
    }
}

class Command {
    execute() {
        throw new Error('Method not implemented');
    }
}

class PlayCommand extends Command {
    constructor(content) {
        super();
        this.content = content;
    }
    execute() {
        return this.content.play();
    }
}

class ContentProxy {
    constructor(content) {
        this.content = content;
    }
    async play() {
        if (this.checkAccess()) {
            return this.content.play();
        }
        throw new Error('Access denied');
    }
    checkAccess() {
        return true; // Simplified for demo
    }
}

class ContentProcessor {
    process() {
        this.validate();
        this.load();
        this.play();
        this.cleanup();
    }
    validate() { throw new Error('Method not implemented'); }
    load() { throw new Error('Method not implemented'); }
    play() { throw new Error('Method not implemented'); }
    cleanup() { throw new Error('Method not implemented'); }
}

class ContentFilter {
    constructor() {
        this.nextFilter = null;
    }
    setNext(filter) {
        this.nextFilter = filter;
        return filter;
    }
    filter(content) {
        if (this.nextFilter) {
            return this.nextFilter.filter(content);
        }
        return content;
    }
}

class ContentIterator {
    constructor(contents) {
        this.contents = contents;
        this.index = 0;
    }
    hasNext() {
        return this.index < this.contents.length;
    }
    next() {
        if (this.hasNext()) {
            return this.contents[this.index++];
        }
        return null;
    }
}

module.exports = {
    ContentFactory,
    EventEmitter,
    StreamFlixState,
    SubscriptionStrategy,
    ContentDecorator,
    PlayCommand,
    ContentProxy,
    ContentProcessor,
    ContentFilter,
    ContentIterator
};