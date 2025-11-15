/**
 * MEMORY MATCH - PUZZLE GAME
 * Complete game logic and interaction handling
 * 
 * Features:
 * - Memory matching game with tile flipping
 * - Multiple difficulty levels
 * - Sound effects and animations
 * - Win condition tracking
 * - Responsive design for all devices
 */

// ============================================
// Game Configuration
// ============================================

const DIFFICULTIES = {
    easy: {
        rows: 4,
        cols: 4,
        pairs: 8,
        name: 'Easy'
    },
    medium: {
        rows: 5,
        cols: 5,
        pairs: 12,
        name: 'Medium'
    },
    hard: {
        rows: 6,
        cols: 6,
        pairs: 18,
        name: 'Hard'
    }
};

// Symbols for tiles (emojis work great for cross-browser compatibility)
const SYMBOLS = ['🍎', '🍌', '🍒', '🍕', '🎁', '🎈', '🎲', '🎸',
                  '⭐', '🌙', '🌻', '🦋', '🐠', '🦅', '🐢', '🐙',
                  '⚡', '🔥', '💎', '🎯'];

// ============================================
// Game State Management
// ============================================

class GameState {
    constructor() {
        this.difficulty = 'medium';
        this.tiles = [];
        this.flipped = [];
        this.matched = 0;
        this.moves = 0;
        this.gameStartTime = null;
        this.gameActive = false;
        this.isChecking = false;
    }

    /**
     * Reset game state to initial values
     */
    reset() {
        this.tiles = [];
        this.flipped = [];
        this.matched = 0;
        this.moves = 0;
        this.gameStartTime = null;
        this.gameActive = false;
        this.isChecking = false;
    }

    /**
     * Calculate elapsed time in seconds
     */
    getElapsedTime() {
        if (!this.gameStartTime) return 0;
        return Math.floor((Date.now() - this.gameStartTime) / 1000);
    }
}

// ============================================
// Audio Manager
// ============================================

class AudioManager {
    constructor() {
        this.clickSound = document.getElementById('clickSound');
        this.matchSound = document.getElementById('matchSound');
        this.winSound = document.getElementById('winSound');
        this.soundEnabled = true;
    }

    /**
     * Play click sound effect
     */
    playClick() {
        if (!this.soundEnabled || !this.clickSound) return;
        try {
            this.clickSound.currentTime = 0;
            this.clickSound.play().catch(e => {
                // Audio playback might fail due to browser policies
                console.log('Audio playback failed:', e);
            });
        } catch (e) {
            console.log('Error playing click sound:', e);
        }
    }

    /**
     * Play match sound effect
     */
    playMatch() {
        if (!this.soundEnabled || !this.matchSound) return;
        try {
            this.matchSound.currentTime = 0;
            this.matchSound.play().catch(e => {
                console.log('Audio playback failed:', e);
            });
        } catch (e) {
            console.log('Error playing match sound:', e);
        }
    }

    /**
     * Play win sound effect
     */
    playWin() {
        if (!this.soundEnabled || !this.winSound) return;
        try {
            this.winSound.currentTime = 0;
            this.winSound.play().catch(e => {
                console.log('Audio playback failed:', e);
            });
        } catch (e) {
            console.log('Error playing win sound:', e);
        }
    }

    /**
     * Toggle sound on/off
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
    }
}

// ============================================
// Tile Class
// ============================================

class Tile {
    constructor(id, symbol) {
        this.id = id;
        this.symbol = symbol;
        this.isFlipped = false;
        this.isMatched = false;
        this.element = null;
    }

    /**
     * Create the DOM element for this tile
     */
    createElement() {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.innerHTML = `
            <div class="tile-inner">
                <div class="tile-face tile-back">?</div>
                <div class="tile-face tile-front">${this.symbol}</div>
            </div>
        `;
        tile.addEventListener('click', () => this.onClick());
        this.element = tile;
        return tile;
    }

    /**
     * Handle tile click event
     */
    onClick() {
        const event = new CustomEvent('tileClicked', { detail: { tile: this } });
        document.dispatchEvent(event);
    }

    /**
     * Flip the tile with animation
     */
    flip() {
        if (this.isFlipped || this.isMatched) return;
        this.isFlipped = true;
        this.element.classList.add('flipped');
    }

    /**
     * Unflip the tile (flip back)
     */
    unflip() {
        if (!this.isFlipped || this.isMatched) return;
        this.isFlipped = false;
        this.element.classList.remove('flipped');
    }

    /**
     * Mark tile as matched
     */
    markMatched() {
        this.isMatched = true;
        this.element.classList.add('matched');
    }

    /**
     * Reset tile state
     */
    reset() {
        this.isFlipped = false;
        this.isMatched = false;
        if (this.element) {
            this.element.classList.remove('flipped', 'matched');
        }
    }
}

// ============================================
// Main Game Class
// ============================================

class MemoryMatchGame {
    constructor() {
        this.state = new GameState();
        this.audioManager = new AudioManager();
        this.gameBoard = document.getElementById('gameBoard');
        this.timerInterval = null;

        this.setupEventListeners();
    }

    /**
     * Setup all event listeners for UI interactions
     */
    setupEventListeners() {
        // Screen navigation
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('quitBtn').addEventListener('click', () => this.goToTitle());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.startGame());
        document.getElementById('homeBtn').addEventListener('click', () => this.goToTitle());

        // Game events
        document.addEventListener('tileClicked', (e) => this.handleTileClick(e.detail.tile));

        // Difficulty selector
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.state.difficulty = e.target.value;
        });
    }

    /**
     * Start a new game
     */
    startGame() {
        this.state.reset();
        const difficulty = DIFFICULTIES[this.state.difficulty];
        
        // Create tiles
        this.createTiles(difficulty);
        
        // Update UI
        this.updateStats();
        this.showScreen('gameScreen');
        
        // Start timer
        this.state.gameStartTime = Date.now();
        this.state.gameActive = true;
        this.startTimer();
    }

    /**
     * Create game tiles based on difficulty
     */
    createTiles(difficulty) {
        this.gameBoard.innerHTML = '';
        this.gameBoard.style.gridTemplateColumns = `repeat(${difficulty.cols}, var(--tile-size))`;
        
        // Create array of symbols (each appears twice for matching)
        const symbols = [];
        for (let i = 0; i < difficulty.pairs; i++) {
            symbols.push(SYMBOLS[i], SYMBOLS[i]);
        }
        
        // Shuffle symbols
        symbols.sort(() => Math.random() - 0.5);
        
        // Create tile objects
        this.state.tiles = symbols.map((symbol, index) => {
            const tile = new Tile(index, symbol);
            const element = tile.createElement();
            this.gameBoard.appendChild(element);
            return tile;
        });

        // Update pair count display
        const pairDisplay = document.getElementById('pairCount');
        pairDisplay.textContent = `0 / ${difficulty.pairs}`;
    }

    /**
     * Handle tile click
     */
    handleTileClick(tile) {
        // Ignore clicks if:
        // - Game is not active
        // - Tile is already flipped or matched
        // - We're checking for a match
        // - We already have 2 tiles flipped
        if (!this.state.gameActive || tile.isFlipped || tile.isMatched || 
            this.state.isChecking || this.state.flipped.length >= 2) {
            return;
        }

        // Flip the tile
        tile.flip();
        this.state.flipped.push(tile);
        this.audioManager.playClick();

        // If we have 2 tiles flipped, check for match
        if (this.state.flipped.length === 2) {
            this.state.moves++;
            this.checkForMatch();
        }

        this.updateStats();
    }

    /**
     * Check if the two flipped tiles match
     */
    checkForMatch() {
        this.state.isChecking = true;
        const [tile1, tile2] = this.state.flipped;

        // Delay to let user see both tiles
        setTimeout(() => {
            if (tile1.symbol === tile2.symbol) {
                // Match found!
                this.audioManager.playMatch();
                tile1.markMatched();
                tile2.markMatched();
                this.state.matched++;

                this.state.flipped = [];
                this.state.isChecking = false;

                // Check for win
                if (this.state.matched === DIFFICULTIES[this.state.difficulty].pairs) {
                    this.winGame();
                }
            } else {
                // No match
                tile1.unflip();
                tile2.unflip();
                this.state.flipped = [];
                this.state.isChecking = false;
            }

            this.updateStats();
        }, 600);
    }

    /**
     * Start the game timer
     */
    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            const elapsed = this.state.getElapsedTime();
            document.getElementById('timeCount').textContent = `${elapsed}s`;
        }, 1000);
    }

    /**
     * Stop the game timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Update UI stats display
     */
    updateStats() {
        document.getElementById('moveCount').textContent = this.state.moves;
        document.getElementById('pairCount').textContent = 
            `${this.state.matched} / ${DIFFICULTIES[this.state.difficulty].pairs}`;
    }

    /**
     * Handle game win
     */
    winGame() {
        this.state.gameActive = false;
        this.stopTimer();
        this.audioManager.playWin();

        const elapsed = this.state.getElapsedTime();
        const difficulty = DIFFICULTIES[this.state.difficulty];

        // Display win stats
        document.getElementById('finalMoves').textContent = this.state.moves;
        document.getElementById('finalTime').textContent = `${elapsed}s`;
        document.getElementById('finalPairs').textContent = `${difficulty.pairs}`;

        // Calculate and display performance rating
        this.displayPerformanceRating(this.state.moves, elapsed, difficulty.pairs);

        // Show win screen
        this.showScreen('winScreen');
    }

    /**
     * Display performance rating based on stats
     */
    displayPerformanceRating(moves, time, totalPairs) {
        let rating = '';
        let message = '';

        // Calculate optimal moves (minimum is totalPairs, one per pair)
        const optimalMoves = totalPairs;
        const moveRatio = moves / optimalMoves;

        if (moveRatio <= 1.2) {
            rating = '⭐⭐⭐';
            message = 'Outstanding! Near perfect!';
        } else if (moveRatio <= 1.5) {
            rating = '⭐⭐';
            message = 'Great job! Well played!';
        } else if (moveRatio <= 2) {
            rating = '⭐';
            message = 'Good effort! Keep practicing!';
        } else {
            rating = '';
            message = 'Nice try! Play again to improve!';
        }

        const ratingElement = document.getElementById('performanceRating');
        ratingElement.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 10px;">${rating}</div>
            <div style="font-size: 18px; color: #2c3e50;">${message}</div>
        `;
    }

    /**
     * Show a specific screen
     */
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(screenId).classList.add('active');
    }

    /**
     * Go back to title screen
     */
    goToTitle() {
        this.state.gameActive = false;
        this.stopTimer();
        this.showScreen('titleScreen');
    }
}

// ============================================
// Initialize Game
// ============================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    const game = new MemoryMatchGame();
    
    console.log('🎮 Memory Match Game Initialized');
    console.log('Ready to play! Click "Start Game" to begin.');
});
