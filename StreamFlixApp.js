const { EventEmitter, StreamFlixState, ContentProxy } = require('./index');
const ContentManager = require('./contentManager');
const Subscription = require('./subscription');

class StreamFlixApp extends EventEmitter {
    constructor() {
        super();
        this.state = StreamFlixState.getInstance();
        this.contentManager = new ContentManager();
        this.contentProxy = new ContentProxy(this.contentManager);
        this.subscriptionManagement = new Subscription();
        this.initializeEventListeners();
    }

    async initialize() {
        await this.contentManager.initialize();
        this.notifyObservers('appInitialized');
    }

    initializeEventListeners() {
        this.contentManager.on('contentAdded', content => {
            this.notifyObservers('contentAdded', content);
        });

        this.on('userSubscribed', user => {
            this.state.user = user;
            this.notifyObservers('userSubscribed', user);
        });

        this.on('user:login', this.handleUserLogin.bind(this));
        this.on('content:play', this.handleContentPlay.bind(this));
        this.on('subscription:upgrade', this.handleSubscriptionUpgrade.bind(this));
    }

    async handleUserLogin(userCredentials) {
        try {
            const user = await this.validateUser(userCredentials);
            this.state.user = user;
            this.notifyObservers('userLoggedIn', user);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async validateUser({ email, password }) {
        // Simulated user validation
        return { email, subscription: this.subscriptionManagement.getPlanDetails('basic') };
    }

    async handleContentPlay(contentId) {
        try {
            const content = await this.contentProxy.getContent(contentId);
            const playCommand = new PlayCommand(content);
            await playCommand.execute();
            this.state.currentContent = content;
            this.notifyObservers('contentPlaying', content);
        } catch (error) {
            console.error('Playback failed:', error);
            throw error;
        }
    }

    async handleSubscriptionUpgrade(planId) {
        try {
            const newPlan = await this.subscriptionManagement.upgradePlan(planId);
            this.state.user.subscription = newPlan;
            this.notifyObservers('subscriptionUpgraded', newPlan);
        } catch (error) {
            console.error('Subscription upgrade failed:', error);
            throw error;
        }
    }

    notifyObservers(event, data) {
        this.emit(event, data);
    }

    getCurrentUser() {
        return this.state.user;
    }

    getAvailableContent() {
        return this.contentManager.getAvailableContent();
    }

    async filterContentByPreferences(preferences) {
        return await this.contentManager.filterContentByPreferences(preferences);
    }
}

module.exports = StreamFlixApp;