/**
 * Main game controller that coordinates all game systems.
 */
class GameController {
    constructor() {
        this.gameState = new GameState();
        this.feedbackSystem = new FeedbackSystem();
        this.inputHandler = new InputHandler();
        this.inventorySystem = new InventorySystem();
        
        // Get canvas and create renderer
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        
        // Bind events
        this.setupEventListeners();
        
        // Game loop
        this.lastUpdate = Date.now();
        this.gameLoop();
        
        // Update inventory display
        this.updateInventoryDisplay();
    }
    
    setupEventListeners() {
        // Game control buttons
        const startBtn = document.getElementById('startGame');
        const resetBtn = document.getElementById('resetGame');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }
        
        // Temperature control buttons
        const tempUpBtn = document.getElementById('tempUp');
        const tempDownBtn = document.getElementById('tempDown');
        
        if (tempUpBtn) {
            tempUpBtn.addEventListener('click', () => this.inputHandler.handleInput('UP'));
        }
        
        if (tempDownBtn) {
            tempDownBtn.addEventListener('click', () => this.inputHandler.handleInput('DOWN'));
        }
        
        // Keyboard input
        document.addEventListener('keydown', (event) => {
            // Handle spacebar and escape
            if (event.key === ' ') {
                event.preventDefault();
                if (!this.gameState.gameStarted) {
                    this.startGame();
                }
            } else if (event.key === 'Escape') {
                event.preventDefault();
                this.resetGame();
            } else {
                // Let inputHandler handle arrow keys
                this.inputHandler.handleKeyPress(event.key);
            }
        });
        
        // Inventory management buttons
        const clearInventoryBtn = document.getElementById('clearInventory');
        if (clearInventoryBtn) {
            clearInventoryBtn.addEventListener('click', () => this.clearInventory());
        }
    }
    
    gameLoop() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdate) / 1000;
        
        if (deltaTime >= GameConfig.UPDATE_INTERVAL) {
            this.update();
            this.render();
            this.lastUpdate = currentTime;
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (!this.gameState.gameStarted) return;
        
        // Process input
        const input = this.inputHandler.getInput();
        if (input) {
            this.gameState.adjustTemperature(input);
        }
        
        // Update game systems
        this.gameState.updateSweetSpot();
        this.gameState.updateScore();
        this.gameState.addToHistory();
        this.feedbackSystem.update(this.gameState);
        this.feedbackSystem.updateFeedback(this.gameState);
        
        // Check for game over
        if (this.gameState.isGameOver() && this.gameState.running) {
            this.endGame();
        }
    }
    
    render() {
        this.renderer.renderFrame(this.gameState, this.feedbackSystem);
    }
    
    startGame() {
        this.gameState.startGame();
        this.feedbackSystem.reset();
        
        // Update button states
        const startBtn = document.getElementById('startGame');
        const resetBtn = document.getElementById('resetGame');
        
        if (startBtn) startBtn.disabled = true;
        if (resetBtn) resetBtn.disabled = false;
    }
    
    endGame() {
        this.gameState.running = false;
        const finalScore = this.gameState.getQualityScore();
        const hasFailed = this.gameState.hasFailed;
        const failureReason = this.gameState.failureReason;
        
        console.log(`🎮 GAME ENDING:`);
        console.log(`   Failed: ${hasFailed}`);
        console.log(`   Score: ${finalScore}%`);
        console.log(`   Reason: ${failureReason}`);
        
        // CRITICAL: Ensure we only process one outcome
        if (hasFailed === true) {
            console.log(`❌ GAME FAILED - Processing failure...`);
            
            // Add failed result to inventory (should give 0 trays)
            const result = this.inventorySystem.addGameResult(finalScore, true, failureReason);
            
            console.log(`❌ Failure result:`, result);
            
            // MUST be failure notification
            this.hideNotifications(); // Clear any existing notifications first
            this.showFailureNotification(result, finalScore);
            
            console.log(`❌ FINAL: Game failed, 0 trays awarded`);
            
        } else {
            console.log(`✅ GAME COMPLETED SUCCESSFULLY - Processing success...`);
            
            // Add successful result to inventory (should give trays)
            const result = this.inventorySystem.addGameResult(finalScore, false, null);
            
            console.log(`✅ Success result:`, result);
            
            // MUST be reward notification
            this.hideNotifications(); // Clear any existing notifications first
            this.showRewardNotification(result, finalScore);
            
            console.log(`✅ FINAL: Game completed, ${result.traysEarned} trays awarded`);
        }
        
        // Update inventory display
        this.updateInventoryDisplay();
    }
    
    resetGame() {
        this.gameState.resetGame();
        this.feedbackSystem.reset();
        
        // Update button states
        const startBtn = document.getElementById('startGame');
        const resetBtn = document.getElementById('resetGame');
        
        if (startBtn) startBtn.disabled = false;
        if (resetBtn) resetBtn.disabled = true;
        
        // Hide any notifications
        this.hideNotifications();
    }
    
    showRewardNotification(result, finalScore) {
        console.log(`🏆 SHOWING REWARD NOTIFICATION:`, result);
        
        // Create or update reward notification
        let notification = document.getElementById('rewardNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'rewardNotification';
            notification.className = 'reward-notification';
            document.querySelector('.container').appendChild(notification);
        }
        
        const emoji = this.inventorySystem.getQualityEmoji(result.quality);
        notification.innerHTML = `
            <div class="reward-content">
                <h3>🍽️ Cooking Complete!</h3>
                <div class="reward-trays">
                    <span class="tray-count">+${result.traysEarned}</span>
                    <span class="tray-quality" style="color: ${this.inventorySystem.getQualityColor(result.quality)}">
                        ${emoji} ${result.quality} Tray${result.traysEarned > 1 ? 's' : ''}
                    </span>
                </div>
                <div class="final-score">Final Score: ${finalScore}%</div>
                ${result.newBestScore ? '<div class="new-best">🎉 New Best Score!</div>' : ''}
            </div>
        `;
        
        notification.style.display = 'block';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);
    }
    
    showFailureNotification(result, finalScore) {
        console.log(`❌ SHOWING FAILURE NOTIFICATION:`, result);
        
        // Create or update failure notification
        let notification = document.getElementById('failureNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'failureNotification';
            notification.className = 'failure-notification';
            document.querySelector('.container').appendChild(notification);
        }
        
        // CRITICAL: Failure notification should NEVER show trays
        notification.innerHTML = `
            <div class="failure-content">
                <h3>❌ Cook Failed!</h3>
                <div class="failure-reason">
                    <span class="failure-text">${result.reason}</span>
                </div>
                <div class="failure-score">Score at failure: ${finalScore}%</div>
                <div class="failure-message">❌ No trays earned - Try to stay in the sweet spot longer!</div>
            </div>
        `;
        
        notification.style.display = 'block';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);
    }
    
    hideNotifications() {
        const rewardNotification = document.getElementById('rewardNotification');
        const failureNotification = document.getElementById('failureNotification');
        
        if (rewardNotification) {
            rewardNotification.style.display = 'none';
        }
        if (failureNotification) {
            failureNotification.style.display = 'none';
        }
    }
    
    updateInventoryDisplay() {
        const stats = this.inventorySystem.getStats();
        const recentActivity = this.inventorySystem.getRecentActivity(5);
        
        console.log('Updating inventory display with stats:', stats);
        console.log('Recent activity:', recentActivity);
        
        // Update stats display
        const statsContainer = document.getElementById('inventoryStats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">Total Trays:</span>
                    <span class="stat-value">${stats.totalTrays}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Games Played:</span>
                    <span class="stat-value">${stats.totalGames}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Success Rate:</span>
                    <span class="stat-value">${stats.successRate}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Best Score:</span>
                    <span class="stat-value">${stats.bestScore}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Failed Cooks:</span>
                    <span class="stat-value failure-count">${stats.totalFailures}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Average Score:</span>
                    <span class="stat-value">${stats.averageScore}%</span>
                </div>
            `;
        }
        
        // Update recent activity display (combining successes and failures)
        const activityContainer = document.getElementById('recentTrays');
        if (activityContainer) {
            if (recentActivity.length === 0) {
                activityContainer.innerHTML = '<div class="no-trays">Start playing to collect trays!</div>';
            } else {
                activityContainer.innerHTML = recentActivity.map(item => {
                    const emoji = this.inventorySystem.getQualityEmoji(item.quality);
                    const color = this.inventorySystem.getQualityColor(item.quality);
                    const displayScore = item.type === 'failure' ? `${item.score}% FAILED` : `${item.score}%`;
                    
                    return `
                        <div class="tray-item ${item.type === 'failure' ? 'failed-item' : ''}" style="border-left-color: ${color}">
                            <span class="tray-emoji">${emoji}</span>
                            <span class="tray-quality" style="color: ${color}">${item.quality}</span>
                            <span class="tray-score">${displayScore}</span>
                        </div>
                    `;
                }).join('');
            }
        }
    }
    
    clearInventory() {
        if (confirm('Are you sure you want to clear all your collected trays and stats? This cannot be undone.')) {
            this.inventorySystem.clearInventory();
            this.updateInventoryDisplay();
        }
    }
} 