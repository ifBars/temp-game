/**
 * Game state management for the temperature control game.
 */
class GameState {
    constructor(config = GameConfig) {
        this.config = config;
        this.actualTemperature = this.getRandomTemperature();
        this.targetCenter = this.config.SWEET_SPOT_START_CENTER;
        this.targetMin = this.targetCenter - (this.config.SWEET_SPOT_SIZE / 2);
        this.targetMax = this.targetCenter + (this.config.SWEET_SPOT_SIZE / 2);
        
        this.goodTime = 0.0;
        this.badTime = 0.0; // Time outside sweet spot
        this.consecutiveBadTime = 0.0; // Consecutive time outside sweet spot
        this.lastTargetChange = 0.0;
        this.nextShiftTime = this.getRandomShiftInterval(); // Random interval for first shift
        this.startTime = null; // Will be set when game actually starts
        this.history = [];
        
        this.running = false;
        this.gameStarted = false;
        this.hasFailed = false;
        this.failureReason = null;
    }
    
    getRandomTemperature() {
        return Math.floor(Math.random() * (this.config.TEMPERATURE_MAX - this.config.TEMPERATURE_MIN + 1)) + this.config.TEMPERATURE_MIN;
    }
    
    getRandomShiftInterval() {
        return Math.random() * (this.config.SWEET_SPOT_SHIFT_MAX_INTERVAL - this.config.SWEET_SPOT_SHIFT_MIN_INTERVAL) + this.config.SWEET_SPOT_SHIFT_MIN_INTERVAL;
    }
    
    getCurrentTime() {
        if (!this.startTime) return 0;
        return (Date.now() / 1000) - this.startTime;
    }
    
    getTimeRemaining() {
        if (!this.gameStarted) return this.config.TOTAL_GAME_TIME;
        return Math.max(0, this.config.TOTAL_GAME_TIME - this.getCurrentTime());
    }
    
    isGameOver() {
        return this.getCurrentTime() >= this.config.TOTAL_GAME_TIME || this.hasFailed;
    }
    
    adjustTemperature(direction) {
        if (!this.gameStarted || this.hasFailed) return;
        
        const change = direction * this.config.TEMPERATURE_INCREMENT;
        this.actualTemperature = Math.max(
            this.config.TEMPERATURE_MIN,
            Math.min(this.config.TEMPERATURE_MAX, this.actualTemperature + change)
        );
    }
    
    updateSweetSpot() {
        const currentTime = this.getCurrentTime();
        
        if (currentTime - this.lastTargetChange >= this.nextShiftTime) {
            // Calculate new center with random shift
            const shift = (Math.random() * (this.config.SWEET_SPOT_SHIFT_MAX - this.config.SWEET_SPOT_SHIFT_MIN)) + this.config.SWEET_SPOT_SHIFT_MIN;
            this.targetCenter += shift;
            
            // Clamp to valid range
            this.targetCenter = Math.max(
                this.config.TEMPERATURE_MIN + (this.config.SWEET_SPOT_SIZE / 2),
                Math.min(this.config.TEMPERATURE_MAX - (this.config.SWEET_SPOT_SIZE / 2), this.targetCenter)
            );
            
            // Update min/max boundaries
            this.targetMin = this.targetCenter - (this.config.SWEET_SPOT_SIZE / 2);
            this.targetMax = this.targetCenter + (this.config.SWEET_SPOT_SIZE / 2);
            
            this.lastTargetChange = currentTime;
            this.nextShiftTime = this.getRandomShiftInterval(); // Set next random interval
            
            console.log(`Sweet spot moved to: ${this.targetMin}-${this.targetMax}%`); // Debug log
        }
    }
    
    isInSweetSpot() {
        return this.actualTemperature >= this.targetMin && this.actualTemperature <= this.targetMax;
    }
    
    updateScore() {
        if (this.hasFailed || !this.running || this.getCurrentTime() >= this.config.TOTAL_GAME_TIME) return;
        
        const inSweetSpot = this.isInSweetSpot();
        
        if (inSweetSpot) {
            this.goodTime += this.config.UPDATE_INTERVAL;
            this.consecutiveBadTime = 0; // Reset consecutive bad time
        } else {
            this.badTime += this.config.UPDATE_INTERVAL;
            this.consecutiveBadTime += this.config.UPDATE_INTERVAL;
            
            // Debug log for failure tracking
            if (this.consecutiveBadTime >= this.config.FAILURE_WARNING_TIME) {
                console.log(`Warning: ${this.consecutiveBadTime.toFixed(1)}s outside sweet spot (${this.config.MAX_FAILURE_TIME}s = failure)`);
            }
            
            // Check for failure
            if (this.consecutiveBadTime >= this.config.MAX_FAILURE_TIME) {
                this.hasFailed = true;
                this.failureReason = "Too long outside sweet spot";
                this.running = false;
                console.log('GAME FAILED: Too long outside sweet spot!'); // Debug log
            }
        }
    }
    
    addToHistory() {
        const currentTime = this.getCurrentTime();
        const isGood = this.isInSweetSpot();
        this.history.push([currentTime, isGood]);
        
        // Remove old entries
        const cutoffTime = currentTime - this.config.HISTORY_RETENTION;
        this.history = this.history.filter(([time, good]) => time >= cutoffTime);
    }
    
    getDelayedFeedback() {
        const currentTime = this.getCurrentTime();
        const targetTime = currentTime - this.config.FEEDBACK_DELAY;
        
        // Find the closest history entry to the target time
        for (let [histTime, isGood] of this.history) {
            if (histTime >= targetTime) {
                return isGood;
            }
        }
        
        return false; // Default to no feedback if no history available
    }
    
    getQualityScore() {
        if (this.config.TOTAL_GAME_TIME === 0) {
            return 0;
        }
        return Math.floor((this.goodTime / this.config.TOTAL_GAME_TIME) * 100);
    }
    
    getSweetSpotRange() {
        return [this.targetMin, this.targetMax];
    }
    
    getFailureProgress() {
        return Math.min(this.consecutiveBadTime / this.config.MAX_FAILURE_TIME, 1.0);
    }
    
    isFailureWarning() {
        return this.consecutiveBadTime >= this.config.FAILURE_WARNING_TIME && !this.hasFailed;
    }
    
    getTimeUntilFailure() {
        return Math.max(0, this.config.MAX_FAILURE_TIME - this.consecutiveBadTime);
    }
    
    startGame() {
        this.gameStarted = true;
        this.running = true;
        this.startTime = Date.now() / 1000;
        this.goodTime = 0.0;
        this.badTime = 0.0;
        this.consecutiveBadTime = 0.0;
        this.lastTargetChange = 0.0;
        this.nextShiftTime = this.getRandomShiftInterval(); // Reset to random interval
        this.history = [];
        this.hasFailed = false;
        this.failureReason = null;
        
        console.log(`Game started! Temperature: ${this.actualTemperature}%, Sweet spot: ${this.targetMin}-${this.targetMax}%`); // Debug log
    }
    
    resetGame() {
        this.actualTemperature = this.getRandomTemperature();
        this.targetCenter = this.config.SWEET_SPOT_START_CENTER;
        this.targetMin = this.targetCenter - (this.config.SWEET_SPOT_SIZE / 2);
        this.targetMax = this.targetCenter + (this.config.SWEET_SPOT_SIZE / 2);
        this.goodTime = 0.0;
        this.badTime = 0.0;
        this.consecutiveBadTime = 0.0;
        this.lastTargetChange = 0.0;
        this.nextShiftTime = this.getRandomShiftInterval(); // Random interval for reset
        this.history = [];
        this.running = false;
        this.gameStarted = false;
        this.hasFailed = false;
        this.failureReason = null;
        
        console.log('Game reset!'); // Debug log
    }
} 