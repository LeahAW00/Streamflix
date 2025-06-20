const { SubscriptionStrategy } = require('./index');

const PLANS = {
    basic: {
        name: 'Basic',
        price: 8.99,
        features: ['HD streaming', '1 device']
    },
    creator: {
        name: 'Creator',
        price: 14.99,
        features: ['Full HD streaming', '2 devices', 'Content creation']
    },
    premium: {
        name: 'Premium',
        price: 19.99,
        features: ['4K streaming', '4 devices', 'Content creation', 'Offline viewing']
    }
};

class Subscription {
    constructor(planType = 'basic') {
        this.strategy = new SubscriptionStrategy(PLANS[planType]);
    }

    getPlanDetails() {
        return {
            name: this.strategy.plan.name,
            price: this.strategy.getPrice(),
            features: this.strategy.getFeatures()
        };
    }

    async upgradePlan(planType) {
        if (!PLANS[planType]) {
            throw new Error('Invalid plan type');
        }
        this.strategy = new SubscriptionStrategy(PLANS[planType]);
        return this.getPlanDetails();
    }
}

module.exports = Subscription;