/**
 * Configuration settings and constants for the temperature control game.
 */
const GameConfig = {
    // Display settings
    WINDOW_WIDTH: 700,
    WINDOW_HEIGHT: 450,
    WINDOW_TITLE: "Temperature Control Game",
    FPS: 10,
    
    // Colors (RGB values)
    WHITE: [255, 255, 255],
    GREEN: [0, 255, 0],
    RED: [255, 0, 0],
    BLACK: [0, 0, 0],
    BLUE: [0, 0, 255],
    GRAY: [128, 128, 128],
    ORANGE: [255, 165, 0],
    
    // Game mechanics
    TEMPERATURE_INCREMENT: 5,
    TEMPERATURE_MIN: 0,
    TEMPERATURE_MAX: 100,
    TEMPERATURE_START: 50, // Still used for reference, but actual start is random
    
    // Sweet spot settings
    SWEET_SPOT_SIZE: 10, // ±5% around center
    SWEET_SPOT_START_CENTER: 50,
    SWEET_SPOT_SHIFT_MIN_INTERVAL: 6.0, // minimum seconds between shifts
    SWEET_SPOT_SHIFT_MAX_INTERVAL: 14.0, // maximum seconds between shifts
    SWEET_SPOT_SHIFT_MIN: -20,
    SWEET_SPOT_SHIFT_MAX: 20,
    
    // Failure mechanics
    MAX_FAILURE_TIME: 15.0, // seconds outside sweet spot before failure
    FAILURE_WARNING_TIME: 10.0, // seconds to start warning player
    
    // Timing
    TOTAL_GAME_TIME: 60.0, // seconds
    FEEDBACK_DELAY: 0.5, // seconds
    UPDATE_INTERVAL: 0.1, // seconds (10 FPS)
    HISTORY_RETENTION: 10.0, // seconds
    
    // UI positioning (for canvas rendering)
    FONT_SIZE: 36,
    SMALL_FONT_SIZE: 24,
    TEMP_TEXT_POS: [50, 50],
    FEEDBACK_RECT_POS: [50, 100],
    FEEDBACK_RECT_SIZE: [100, 50],
    TIME_TEXT_POS: [50, 200],
    SWEET_SPOT_TEXT_POS: [50, 250],
    SCORE_TEXT_POS: [50, 300],
    
    // Helper function to convert RGB array to CSS color
    rgbToColor: function(rgb) {
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
}; 