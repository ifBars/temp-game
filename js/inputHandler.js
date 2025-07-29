/**
 * Input handling for the temperature control game.
 */
class InputHandler {
    constructor() {
        this.currentInput = null;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Only handle keyboard input
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
    }
    
    handleKeyDown(event) {
        switch(event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.currentInput = 'UP';
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.currentInput = 'DOWN';
                break;
        }
    }
    
    handleKeyPress(key) {
        switch(key) {
            case 'ArrowUp':
                this.currentInput = 'UP';
                break;
            case 'ArrowDown':
                this.currentInput = 'DOWN';
                break;
        }
    }
    
    handleInput(direction) {
        this.currentInput = direction;
    }
    
    getInput() {
        const input = this.currentInput;
        this.currentInput = null; // Clear after reading
        
        if (input === 'UP') return 1;
        if (input === 'DOWN') return -1;
        return null;
    }
} 