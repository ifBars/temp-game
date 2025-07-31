/**
 * Rendering system for the temperature control game UI.
 */
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupCanvas();
    }
    
    setupCanvas() {
        // Set up canvas for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Set canvas display size
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Store actual canvas dimensions for centering
        this.canvasWidth = rect.width;
        this.canvasHeight = rect.height;
    }
    
    renderFrame(gameState, feedbackSystem) {
        this.clearScreen();
        
        if (!gameState.gameStarted) {
            this.renderWelcomeScreen();
        } else if (gameState.isGameOver()) {
            if (gameState.hasFailed) {
                this.renderFailureScreen(gameState.getQualityScore(), gameState.failureReason);
            } else {
                this.renderGameOverScreen(gameState.getQualityScore());
            }
        } else {
            this.renderGameScreen(gameState, feedbackSystem);
        }
        
        // Update HTML status elements
        this.updateHTMLStatus(gameState);
    }
    
    renderWelcomeScreen() {
        // Add a subtle pulsing effect
        const time = Date.now() / 1000;
        const pulse = 0.95 + Math.sin(time * 2) * 0.05;
        
        // Main title with gradient effect
        this.ctx.fillStyle = GameConfig.rgbToColor([102, 126, 234]);
        this.ctx.font = 'bold 42px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.save();
        this.ctx.scale(pulse, pulse);
        this.ctx.fillText('🌡️ Temperature Control Challenge', this.canvasWidth / 2 / pulse, (this.canvasHeight / 2 - 80) / pulse);
        this.ctx.restore();
        
        // Subtitle
        this.ctx.fillStyle = GameConfig.rgbToColor([118, 75, 162]);
        this.ctx.font = 'italic 28px Arial';
        this.ctx.fillText('Master the Hidden Sweet Spot', this.canvasWidth / 2, this.canvasHeight / 2 - 30);
        
        // Instructions with better styling
        this.ctx.fillStyle = GameConfig.rgbToColor([80, 80, 80]);
        this.ctx.font = '22px Arial';
        this.ctx.fillText('🎮 Press Start Game or Spacebar to begin', this.canvasWidth / 2, this.canvasHeight / 2 + 20);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText('🎯 Use arrow keys or buttons to control temperature', this.canvasWidth / 2, this.canvasHeight / 2 + 50);
        this.ctx.fillText('🔍 Find the hidden sweet spot and stay in it!', this.canvasWidth / 2, this.canvasHeight / 2 + 80);
        
        // Warning with emphasis
        this.ctx.fillStyle = GameConfig.rgbToColor([244, 67, 54]);
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText('⚠️ Stay out for 15 seconds = COOK FAILS!', this.canvasWidth / 2, this.canvasHeight / 2 + 120);
        
        // Animated dots
        const dots = '...'.substring(0, Math.floor(time * 2) % 4);
        this.ctx.fillStyle = GameConfig.rgbToColor([102, 126, 234]);
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`Ready to cook${dots}`, this.canvasWidth / 2, this.canvasHeight / 2 + 160);
    }
    
    renderGameScreen(gameState, feedbackSystem) {
        // Render temperature display
        this.renderTemperature(gameState);
        
        // Render feedback indicator
        this.renderFeedbackIndicator(feedbackSystem);
        
        // Render failure warning if needed
        if (gameState.isFailureWarning()) {
            this.renderFailureWarning(gameState);
        }
        
        // Render time and score info
        this.renderGameInfo(gameState);
    }
    
    renderGameOverScreen(finalScore) {
        this.ctx.fillStyle = GameConfig.rgbToColor(GameConfig.BLACK);
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        
        this.ctx.fillText('CHALLENGE COMPLETE!', this.canvasWidth / 2, this.canvasHeight / 2 - 80);
        
        this.ctx.font = '36px Arial';
        this.ctx.fillStyle = finalScore >= 70 ? GameConfig.rgbToColor(GameConfig.GREEN) : 
                           finalScore >= 40 ? GameConfig.rgbToColor([255, 165, 0]) : // Orange
                           GameConfig.rgbToColor(GameConfig.RED);
        
        this.ctx.fillText(`Final Quality: ${finalScore}%`, this.canvasWidth / 2, this.canvasHeight / 2 - 20);
        
        this.ctx.fillStyle = GameConfig.rgbToColor(GameConfig.BLACK);
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press Reset to play again', this.canvasWidth / 2, this.canvasHeight / 2 + 60);
        
        // Quality assessment
        let assessment = '';
        if (finalScore >= 90) assessment = 'Perfect Control! 🏆';
        else if (finalScore >= 70) assessment = 'Excellent Performance! 🥇';
        else if (finalScore >= 50) assessment = 'Good Job! 🥈';
        else if (finalScore >= 30) assessment = 'Needs Practice 🥉';
        else assessment = 'Keep Trying! 💪';
        
        this.ctx.fillText(assessment, this.canvasWidth / 2, this.canvasHeight / 2 + 20);
    }
    
    renderFailureScreen(finalScore, failureReason) {
        this.ctx.fillStyle = GameConfig.rgbToColor([139, 0, 0]); // Dark red
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        
        this.ctx.fillText('COOK FAILED!', this.canvasWidth / 2, this.canvasHeight / 2 - 80);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = GameConfig.rgbToColor(GameConfig.BLACK);
        this.ctx.fillText(failureReason, this.canvasWidth / 2, this.canvasHeight / 2 - 40);
        
        this.ctx.font = '36px Arial';
        this.ctx.fillStyle = GameConfig.rgbToColor([139, 0, 0]);
        this.ctx.fillText(`Score: ${finalScore}%`, this.canvasWidth / 2, this.canvasHeight / 2);
        
        this.ctx.fillStyle = GameConfig.rgbToColor(GameConfig.BLACK);
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Stay in the sweet spot longer next time!', this.canvasWidth / 2, this.canvasHeight / 2 + 40);
        this.ctx.fillText('Press Reset to try again', this.canvasWidth / 2, this.canvasHeight / 2 + 80);
    }
    
    renderTemperature(gameState) {
        this.ctx.fillStyle = GameConfig.rgbToColor(GameConfig.BLACK);
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Temperature: ${gameState.actualTemperature}%`, this.canvasWidth / 2, 120);
    }
    
    renderFeedbackIndicator(feedbackSystem) {
        const y = 160;
        
        let message, color;
        if (feedbackSystem.isFeedbackAvailable()) {
            if (feedbackSystem.getCurrentFeedback()) {
                message = "The temperature is responding well";
                color = GameConfig.rgbToColor(GameConfig.GREEN);
            } else {
                message = "The temperature is not responding well";
                color = GameConfig.rgbToColor(GameConfig.ORANGE);
            }
        } else {
            message = "Temperature status pending...";
            color = GameConfig.rgbToColor(GameConfig.GRAY);
        }
        
        // Draw feedback text
        this.ctx.fillStyle = color;
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(message, this.canvasWidth / 2, y + 40);
        
        // Add subtle background box for better readability
        const textWidth = this.ctx.measureText(message).width;
        const boxPadding = 20;
        const boxX = (this.canvasWidth / 2) - (textWidth / 2) - boxPadding;
        const boxY = y + 10;
        const boxWidth = textWidth + (boxPadding * 2);
        const boxHeight = 50;
        
        // Draw background box
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        
        // Add border to box
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Draw text again on top of box
        this.ctx.fillStyle = color;
        this.ctx.fillText(message, this.canvasWidth / 2, y + 40);
    }
    
    renderFailureWarning(gameState) {
        const timeUntilFailure = gameState.getTimeUntilFailure();
        const progress = gameState.getFailureProgress();
        
        // Warning background
        this.ctx.fillStyle = `rgba(255, 0, 0, ${0.1 + (progress * 0.3)})`;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Warning text
        this.ctx.fillStyle = GameConfig.rgbToColor([139, 0, 0]); // Dark red
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⚠️ WARNING ⚠️', this.canvasWidth / 2, 280);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Find the sweet spot in ${Math.ceil(timeUntilFailure)}s!`, this.canvasWidth / 2, 315);
        
        // Failure progress bar
        const barWidth = 300;
        const barHeight = 20;
        const barX = (this.canvasWidth / 2) - (barWidth / 2);
        const barY = 325;
        
        // Background
        this.ctx.fillStyle = GameConfig.rgbToColor([240, 240, 240]);
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Progress fill
        const fillWidth = progress * barWidth;
        this.ctx.fillStyle = GameConfig.rgbToColor([255, 0, 0]);
        this.ctx.fillRect(barX, barY, fillWidth, barHeight);
        
        // Border
        this.ctx.strokeStyle = GameConfig.rgbToColor(GameConfig.BLACK);
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
    
    renderGameInfo(gameState) {
        this.ctx.fillStyle = GameConfig.rgbToColor(GameConfig.BLACK);
        this.ctx.font = '32px Arial';
        this.ctx.textAlign = 'center';
        
        const yOffset = gameState.isFailureWarning() ? 80 : 0;
        
        const timeLeft = Math.ceil(gameState.getTimeRemaining());
        this.ctx.fillText(`Time Left: ${timeLeft}s`, this.canvasWidth / 2, 340 + yOffset);
        
        const currentScore = gameState.getQualityScore();
        this.ctx.fillText(`Quality: ${currentScore}%`, this.canvasWidth / 2, 390 + yOffset);
        
        // Progress bar for quality
        const progressX = (this.canvasWidth / 2) - 150;
        const progressY = 410 + yOffset;
        const progressWidth = 300;
        const progressHeight = 30;
        
        // Background
        this.ctx.fillStyle = GameConfig.rgbToColor([240, 240, 240]);
        this.ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
        
        // Progress fill
        const fillWidth = (currentScore / 100) * progressWidth;
        this.ctx.fillStyle = currentScore >= 70 ? GameConfig.rgbToColor(GameConfig.GREEN) :
                           currentScore >= 40 ? GameConfig.rgbToColor([255, 165, 0]) :
                           GameConfig.rgbToColor(GameConfig.RED);
        this.ctx.fillRect(progressX, progressY, fillWidth, progressHeight);
        
        // Border
        this.ctx.strokeStyle = GameConfig.rgbToColor(GameConfig.BLACK);
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(progressX, progressY, progressWidth, progressHeight);
    }
    
    updateHTMLStatus(gameState) {
        // Update HTML elements
        const currentTempEl = document.getElementById('currentTemp');
        const timeLeftEl = document.getElementById('timeLeft');
        const currentQualityEl = document.getElementById('currentQuality');
        
        if (currentTempEl) {
            if (!gameState.gameStarted) {
                currentTempEl.textContent = '-- Ready --';
                currentTempEl.style.color = '#667eea';
                currentTempEl.style.fontStyle = 'italic';
            } else {
                currentTempEl.textContent = `${gameState.actualTemperature}%`;
                currentTempEl.style.color = '';
                currentTempEl.style.fontStyle = '';
            }
        }
        
        if (timeLeftEl) {
            if (!gameState.gameStarted) {
                timeLeftEl.textContent = 'Press Start!';
                timeLeftEl.style.color = '#667eea';
                timeLeftEl.style.fontStyle = 'italic';
            } else {
                const timeLeft = Math.ceil(gameState.getTimeRemaining());
                timeLeftEl.textContent = `${timeLeft}s`;
                timeLeftEl.style.color = timeLeft <= 10 ? '#f44336' : '';
                timeLeftEl.style.fontStyle = '';
            }
        }
        
        if (currentQualityEl) {
            if (!gameState.gameStarted) {
                currentQualityEl.textContent = '0%';
                currentQualityEl.style.color = '#999';
            } else {
                const quality = gameState.getQualityScore();
                currentQualityEl.textContent = `${quality}%`;
                currentQualityEl.style.color = quality >= 70 ? '#4CAF50' : 
                                             quality >= 40 ? '#FF9800' : '#f44336';
            }
        }
    }
    
    clearScreen() {
        this.ctx.fillStyle = GameConfig.rgbToColor(GameConfig.WHITE);
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
} 