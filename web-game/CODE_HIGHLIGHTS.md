# 📖 Code Highlights & Architecture

## Memory Match - Web Game Project

Complete reference for understanding the codebase.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│          INDEX.HTML (Markup)            │
│  - Title Screen                         │
│  - Game Screen                          │
│  - Win Screen                           │
│  - Audio Elements                       │
└─────────┬───────────────────────────────┘
          │
┌─────────▼──────────────────────────────────┐
│        SCRIPT.JS (Game Logic)              │
│  - GameState Class                         │
│  - AudioManager Class                      │
│  - Tile Class                              │
│  - MemoryMatchGame Class                   │
└─────────┬──────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────┐
│       STYLE.CSS (Presentation)              │
│  - CSS Variables                           │
│  - Layout (Grid, Flexbox)                  │
│  - Animations (3D Transforms)              │
│  - Responsive (4 Breakpoints)              │
└─────────────────────────────────────────────┘
```

---

## 📋 HTML Structure (index.html)

### Main Sections:
```html
<div id="app" class="app-container">
  <!-- Title Screen -->
  <div id="titleScreen" class="screen title-screen active">
    <h1>Memory Match</h1>
    <select id="difficulty">...</select>
    <button id="startBtn">Start Game</button>
  </div>

  <!-- Game Screen -->
  <div id="gameScreen" class="screen game-screen">
    <div class="game-header">
      <div class="game-stats">...</div>
    </div>
    <div id="gameBoard" class="game-board">
      <!-- Tiles generated here -->
    </div>
  </div>

  <!-- Win Screen -->
  <div id="winScreen" class="screen win-screen">
    <h1 class="win-title">🎉 You Won! 🎉</h1>
    <div class="win-stats">...</div>
    <button id="playAgainBtn">Play Again</button>
  </div>
</div>

<!-- Audio Elements -->
<div id="audioContainer">
  <audio id="clickSound" src="assets/sounds/click.mp3"></audio>
  <audio id="matchSound" src="assets/sounds/match.mp3"></audio>
  <audio id="winSound" src="assets/sounds/win.mp3"></audio>
</div>
```

---

## 🎨 CSS Architecture (style.css)

### CSS Variables (Customization Hub):
```css
:root {
    /* Colors */
    --color-primary: #3498db;
    --color-secondary: #2c3e50;
    --color-success: #27ae60;
    --color-danger: #e74c3c;
    
    /* Sizes */
    --tile-size: 80px;
    --tile-gap: 10px;
    --border-radius: 8px;
    
    /* Animations */
    --transition-speed: 0.3s;
}
```

### Key Animations:
```css
/* Tile Flip Animation */
.tile-inner {
    transition: transform 0.6s;
    transform-style: preserve-3d;
}
.tile.flipped .tile-inner {
    transform: rotateY(180deg);
}

/* Match Pulse Animation */
.tile.matched .tile-inner {
    animation: matchPulse 0.6s ease-out;
}

/* Screen Transitions */
.screen {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
}
.screen.active {
    opacity: 1;
    visibility: visible;
}
```

### Responsive Breakpoints:
```css
/* Desktop: 1200px+ */
:root { --tile-size: 80px; }

/* Tablet: 768px - 1199px */
@media (max-width: 768px) {
    :root { --tile-size: 70px; }
}

/* Mobile: 480px - 767px */
@media (max-width: 480px) {
    :root { --tile-size: 60px; }
}

/* Small Mobile: <480px */
@media (max-width: 360px) {
    :root { --tile-size: 50px; }
}
```

---

## ⚙️ JavaScript Classes (script.js)

### 1. GameState Class
```javascript
class GameState {
    constructor() {
        this.difficulty = 'medium';
        this.tiles = [];
        this.flipped = [];
        this.matched = 0;
        this.moves = 0;
        this.gameStartTime = null;
        this.gameActive = false;
    }
    
    getElapsedTime() {
        return Math.floor((Date.now() - this.gameStartTime) / 1000);
    }
}
```

**Purpose:** Centralized state management for the game

### 2. AudioManager Class
```javascript
class AudioManager {
    constructor() {
        this.clickSound = document.getElementById('clickSound');
        this.matchSound = document.getElementById('matchSound');
        this.winSound = document.getElementById('winSound');
    }
    
    playClick() {
        if (!this.soundEnabled || !this.clickSound) return;
        this.clickSound.currentTime = 0;
        this.clickSound.play();
    }
    
    playMatch() {
        // Play match sound
    }
    
    playWin() {
        // Play win sound
    }
}
```

**Purpose:** Handle all audio playback with error handling

### 3. Tile Class
```javascript
class Tile {
    constructor(id, symbol) {
        this.id = id;
        this.symbol = symbol;
        this.isFlipped = false;
        this.isMatched = false;
    }
    
    createElement() {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.innerHTML = `
            <div class="tile-inner">
                <div class="tile-face tile-back">?</div>
                <div class="tile-face tile-front">${this.symbol}</div>
            </div>
        `;
        return tile;
    }
    
    flip() {
        if (this.isFlipped || this.isMatched) return;
        this.isFlipped = true;
        this.element.classList.add('flipped');
    }
    
    unflip() {
        // Flip back
    }
    
    markMatched() {
        // Mark as matched
    }
}
```

**Purpose:** Represent individual tiles with state management

### 4. MemoryMatchGame Class
```javascript
class MemoryMatchGame {
    constructor() {
        this.state = new GameState();
        this.audioManager = new AudioManager();
        this.gameBoard = document.getElementById('gameBoard');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // All event binding
    }
    
    startGame() {
        // Initialize new game
    }
    
    handleTileClick(tile) {
        // Process tile click
    }
    
    checkForMatch() {
        // Validate if tiles match
    }
    
    winGame() {
        // Handle victory
    }
    
    showScreen(screenId) {
        // Screen state management
    }
}
```

**Purpose:** Main game controller - orchestrates all components

---

## 🔄 Game Flow

### 1. Initialize
```
Page Load
  ↓
Create MemoryMatchGame Instance
  ↓
Setup Event Listeners
  ↓
Show Title Screen
```

### 2. Start Game
```
User clicks "START GAME"
  ↓
startGame() called
  ↓
Reset GameState
  ↓
Create Tiles (based on difficulty)
  ↓
Show Game Screen
  ↓
Start Timer
```

### 3. Gameplay Loop
```
User clicks Tile
  ↓
handleTileClick()
  ↓
Flip Tile Animation
  ↓
Add to flipped array
  ↓
If 2 tiles flipped:
  ↓
  ├─→ checkForMatch()
  │    ├─→ Match Found: markMatched()
  │    └─→ No Match: unflip() after delay
  │
  ↓
Check for Win Condition
  ↓
Update Stats
```

### 4. Win
```
All Tiles Matched
  ↓
Stop Timer
  ↓
Calculate Stats
  ↓
Rate Performance
  ↓
Show Win Screen
```

---

## 🎯 Key Features Explained

### Tile Flip Animation
```javascript
// CSS handles the animation
// JavaScript only toggles the class
tile.flip() {
    this.element.classList.add('flipped');
}

// CSS does the 3D transform
.tile.flipped .tile-inner {
    transform: rotateY(180deg);
}
```

**Why:** Separates concerns - CSS for presentation, JS for logic

### Two-Tile Selection
```javascript
handleTileClick(tile) {
    // Ignore if already 2 tiles selected
    if (this.state.flipped.length >= 2) {
        return;
    }
    
    tile.flip();
    this.state.flipped.push(tile);
    
    if (this.state.flipped.length === 2) {
        this.checkForMatch();
    }
}
```

### Auto-Hide Non-Matching Tiles
```javascript
checkForMatch() {
    // Wait 600ms before checking/hiding
    setTimeout(() => {
        if (tile1.symbol === tile2.symbol) {
            // Match!
            tile1.markMatched();
            tile2.markMatched();
        } else {
            // No match - hide after delay
            tile1.unflip();
            tile2.unflip();
        }
    }, 600);
}
```

---

## 📱 Responsive Design Strategy

### Mobile-First Approach
```css
/* Base: Mobile (default) */
:root { --tile-size: 60px; }

/* Large Mobile */
@media (min-width: 480px) {
    :root { --tile-size: 70px; }
}

/* Tablet */
@media (min-width: 768px) {
    :root { --tile-size: 80px; }
}

/* Desktop */
@media (min-width: 1200px) {
    /* Keep defaults */
}
```

---

## 🔧 Customization Points

### Easy Customization (CSS Only)
1. Colors - Edit `--color-*` variables
2. Tile size - Edit `--tile-size`
3. Animation speed - Edit `--transition-speed`
4. Border radius - Edit `--border-radius`

### Medium Customization (HTML + CSS)
1. Add difficulty level
2. Change button labels
3. Modify screen layouts

### Advanced Customization (JavaScript)
1. Change game logic
2. Add new features
3. Implement multiplayer
4. Add power-ups

---

## ⚡ Performance Tips

### Already Optimized For:
- ✅ CSS transforms (GPU accelerated)
- ✅ Event delegation (single listener)
- ✅ Class-based animations (not inline styles)
- ✅ Minimal reflows/repaints
- ✅ Efficient DOM queries

### Further Optimization (if needed):
```javascript
// Cache selectors
const gameBoard = document.getElementById('gameBoard');

// Use event delegation
document.addEventListener('tileClicked', handler);

// Batch DOM updates
const fragment = document.createDocumentFragment();
```

---

## 🐛 Debugging Tips

### Check Game State
```javascript
// In browser console:
console.log(game.state);
```

### Check Tile State
```javascript
// In browser console:
console.log(game.state.tiles);
console.log(game.state.flipped);
```

### Watch Events
```javascript
// In browser console:
document.addEventListener('tileClicked', (e) => {
    console.log('Tile clicked:', e.detail.tile);
});
```

---

## 📊 Code Metrics

| Metric | Value |
|--------|-------|
| HTML lines | ~130 |
| CSS lines | 600+ |
| JavaScript lines | 500+ |
| Classes | 4 |
| Methods | 25+ |
| Event listeners | 8+ |
| CSS animations | 5+ |

---

## ✨ Best Practices Demonstrated

- ✅ Object-oriented design (classes)
- ✅ Event-driven architecture
- ✅ Separation of concerns (HTML/CSS/JS)
- ✅ DRY principle (Don't Repeat Yourself)
- ✅ Clear naming conventions
- ✅ Comprehensive comments
- ✅ Mobile-first responsive design
- ✅ Graceful degradation (works without sounds)
- ✅ Error handling
- ✅ Performance optimization

---

## 🎓 Learning Resources

This project teaches:
- HTML5 semantics
- CSS3 animations and transforms
- JavaScript ES6+ classes
- Event handling
- DOM manipulation
- State management
- Game loops
- Responsive design
- Web Audio API

---

**This architecture is clean, scalable, and easy to extend!**
