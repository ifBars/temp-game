/**
 * Main entry point for the Temperature Control Game web version.
 */

let gameController = null;

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    try {
        gameController = new GameController();
        // GameController now auto-initializes, no need to call start()
        
        console.log('Temperature Control Game loaded successfully!');
        console.log('🌡️ Welcome to the Temperature Control Challenge');
        console.log('');
        console.log('Controls:');
        console.log('- UP Arrow / ↑ Button: Increase temperature by 5%');
        console.log('- DOWN Arrow / ↓ Button: Decrease temperature by 5%');
        console.log('- Spacebar: Start game (when not started)');
        console.log('- ESC: Reset game');
        console.log('');
        console.log('Goal: Keep temperature in the sweet spot for maximum quality!');
        console.log('⚠️ WARNING: Stay out of sweet spot for 15 seconds and you\'ll fail!');
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        
        // Show error message to user
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'red';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Error loading game!', canvas.width / 2, canvas.height / 2);
            ctx.fillText('Check console for details', canvas.width / 2, canvas.height / 2 + 30);
        }
    }
});

// Handle page visibility changes (pause/resume when tab is hidden/shown)
document.addEventListener('visibilitychange', function() {
    if (gameController) {
        if (document.hidden) {
            // Page is hidden, could pause game here if desired
            console.log('Game paused (tab hidden)');
        } else {
            // Page is visible again
            console.log('Game resumed (tab visible)');
        }
    }
});

// Clean up when page unloads
window.addEventListener('beforeunload', function() {
    if (gameController) {
        // GameController doesn't need cleanup method anymore
        console.log('Game session ended');
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (gameController && gameController.renderer) {
        // Reinitialize canvas for new size
        gameController.renderer.setupCanvas();
    }
});

// Export for debugging (if needed)
window.gameController = gameController; 