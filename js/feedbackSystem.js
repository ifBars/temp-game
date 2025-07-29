/**
 * Feedback system for the temperature control game.
 */
class FeedbackSystem {
    constructor() {
        // No need to store gameState reference, it will be passed to methods
    }
    
    update(gameState) {
        // Add current state to history for future delayed feedback
        gameState.addToHistory();
    }
    
    getCurrentFeedback() {
        // This will be called by renderer with current gameState
        return this.lastFeedback || false;
    }
    
    isFeedbackAvailable() {
        // This will be called by renderer with current gameState
        return this.feedbackAvailable || false;
    }
    
    updateFeedback(gameState) {
        this.lastFeedback = gameState.getDelayedFeedback();
        this.feedbackAvailable = gameState.getCurrentTime() >= GameConfig.FEEDBACK_DELAY;
    }
    
    reset() {
        this.lastFeedback = false;
        this.feedbackAvailable = false;
    }
} 