# 🌡️ Temperature Control Game

A web-based temperature control challenge game. This browser game challenges players to maintain an optimal temperature within a dynamic sweet spot over 60 seconds to achieve the highest quality score.

**🎮 [Play Online](https://ifbars.github.io/temp-game/)** 

## Features

- **🌐 Web-Based**: Play directly in your browser, no downloads required
- **🎲 Random Start**: Temperature starts at a random value (0-100%) each game
- **🎯 Temperature Control**: Use arrow keys or buttons to adjust temperature in 5% increments
- **📊 Dynamic Sweet Spot**: 10% range that shifts every 6-14 seconds by 10-20%
- **⚠️ Failure System**: Stay out of sweet spot for 15 seconds = cook fails!
- **⏱️ Delayed Feedback**: 0.5-second delay between actions and visual feedback
- **📈 Real-time Scoring**: Track quality percentage based on time in sweet spot
- **🍽️ Inventory System**: Collect trays based on performance and track progress
- **📊 Performance Analytics**: Success rate, failure tracking, and detailed stats
- **🎨 Clean UI**: Modern web interface with visual warnings and notifications
- **📱 Mobile Friendly**: Responsive design works on desktop and mobile devices

## Project Structure

The project is a modular web application organized into clean components:

```
temp-game/
├── index.html              # Main game page
├── css/
│   └── style.css          # Game styling
├── js/
│   ├── config.js          # Game configuration
│   ├── gameState.js       # Game state management
│   ├── inputHandler.js    # Input processing
│   ├── feedbackSystem.js  # Delayed feedback logic
│   ├── inventorySystem.js # Tray collection & stats
│   ├── renderer.js        # Canvas rendering
│   ├── gameController.js  # Main game loop
│   └── main.js           # Entry point
├── _config.yml           # GitHub Pages config
└── .github/workflows/     # GitHub Actions
    └── pages.yml         # Deployment workflow
```

### Component Overview

- **GameConfig**: Centralized configuration for all game constants and settings
- **GameState**: Manages temperature, sweet spot targets, timing, scoring, and failure detection
- **InputHandler**: Processes keyboard input and translates to game actions
- **FeedbackSystem**: Handles the 0.5-second delayed feedback mechanism
- **InventorySystem**: Tracks collected trays, failed cooks, and player progression with localStorage
- **Renderer**: Manages all UI rendering, warnings, and display logic
- **GameController**: Coordinates all components and runs the main game loop

## Quick Start

**Just visit**: [https://ifbars.github.io/temp-game/](https://ifbars.github.io/temp-game/)

No installation required! Works on any modern browser.

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages:

1. **Fork this repository**
2. **Enable GitHub Pages** in repository settings
3. **Update the URLs** in `_config.yml` and `index.html` to match your GitHub username
4. **Push to main branch** - the site will automatically deploy via GitHub Actions

### Manual Setup

1. Go to your repository **Settings**
2. Scroll to **Pages** section
3. Set **Source** to "GitHub Actions"
4. The workflow will automatically deploy on every push to main

## Controls

- **UP Arrow / ↑ Button**: Increase temperature by 5%
- **DOWN Arrow / ↓ Button**: Decrease temperature by 5%
- **Spacebar / Start Button**: Begin game
- **ESC / Reset Button**: Reset game

## Gameplay

1. **Start**: Click "Start Game" or press Spacebar
2. **Random Start**: Each game starts with a random temperature (0-100%)
3. **Control**: Use arrow keys or buttons to adjust temperature
4. **Target**: Keep temperature within the hidden sweet spot range (10% wide)
5. **Challenge**: Sweet spot shifts randomly every 6-14 seconds by ±10-20%
6. **Feedback**: Green indicator = good, Red = bad (0.5 second delay)
7. **Warning**: Red overlay appears after 10 seconds outside sweet spot
8. **Failure**: Cook fails if outside sweet spot for 15 consecutive seconds
9. **Goal**: Maximize time in sweet spot over 60 seconds or avoid failure
10. **Rewards**: Earn 1-3 trays based on performance quality

### 🏆 Quality Grades & Rewards
- **90-100%**: Amazing Control! 🏆 (3 trays)
- **80-89%**: Excellent Performance! 🥇 (3 trays)
- **70-79%**: Great Job! 🥈 (2 trays)
- **50-69%**: Good Work! 🥉 (2 trays)
- **30-49%**: Average Performance 📋 (1 tray)
- **0-29%**: Poor Performance 📄 (1 tray)
- **Failed**: Cook Failed! ❌ (no trays, tracked separately)

## Game Mechanics

- **Temperature Range**: 0-100%
- **Sweet Spot Size**: 10% (±5% around center)
- **Shift Interval**: Random 6-14 seconds
- **Shift Amount**: Random ±10-20%
- **Feedback Delay**: 0.5 seconds
- **Failure Timer**: 15 seconds outside sweet spot
- **Warning Timer**: 10 seconds (warning starts)
- **Game Duration**: 60 seconds
- **Update Rate**: 10 FPS (0.1 second intervals)

## Technical Details

- Built with **HTML5 Canvas** and **JavaScript** for universal browser compatibility
- **localStorage** for persistent tray collection and stats tracking
- **Responsive CSS** design that works on desktop and mobile
- **Real-time rendering** at 10 FPS for smooth gameplay
- **Modular JavaScript architecture** with separated concerns
- **GitHub Pages** deployment with automated CI/CD

## Customization

Edit values in `js/config.js`:
```javascript
const GameConfig = {
    TOTAL_GAME_TIME: 60.0,                    // Game duration
    SWEET_SPOT_SIZE: 10,                      // Sweet spot range
    SWEET_SPOT_SHIFT_MIN_INTERVAL: 6.0,       // Min shift time
    SWEET_SPOT_SHIFT_MAX_INTERVAL: 14.0,      // Max shift time
    TEMPERATURE_INCREMENT: 5,                 // Temperature step size
    FEEDBACK_DELAY: 0.5,                      // Feedback delay
    MAX_FAILURE_TIME: 15.0,                   // Failure threshold
    FAILURE_WARNING_TIME: 10.0                // Warning threshold
};
```

## Browser Compatibility

✅ **Supported Browsers**:
- Chrome 60+
- Firefox 55+  
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Requirements

- Modern web browser with HTML5 Canvas support
- JavaScript enabled
- Internet connection (for initial load)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Web Gaming Community** - For inspiration and feedback
- **HTML5 Canvas** - For making browser-based games possible

---

🎮 **Ready to play?** [Play the game now!](https://ifbars.github.io/temp-game/)

*Challenge yourself to achieve the perfect temperature control! Master the dynamic sweet spots, avoid failures, and become the ultimate temperature control champion.*