/**
 * Sound Generator for Web Games
 * Creates simple sound effects and saves them as data URIs or files
 * 
 * This script can be run in Node.js or the browser to generate sound files
 */

// ============================================
// Audio Context Sound Generation
// ============================================

/**
 * Generate a simple beep sound using Web Audio API
 * Returns a Blob that can be played or saved
 */
function generateClickSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 0.1; // 100ms
    const sampleRate = audioContext.sampleRate;
    const frequency = 800; // Hz
    
    // Create oscillator and gain nodes
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // Create envelope (fade in/out)
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    return audioContext;
}

/**
 * Generate a match sound (ascending tones)
 */
function generateMatchSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    const frequencies = [440, 550, 660];
    const duration = 0.15;
    
    frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = freq;
        
        gain.gain.setValueAtTime(0.2, now + index * duration);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * duration + duration);
        
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        
        oscillator.start(now + index * duration);
        oscillator.stop(now + index * duration + duration);
    });
    
    return audioContext;
}

/**
 * Generate a win sound (ascending scale)
 */
function generateWinSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
    const duration = 0.2;
    
    frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = freq;
        
        gain.gain.setValueAtTime(0.25, now + index * duration);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * duration + duration);
        
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        
        oscillator.start(now + index * duration);
        oscillator.stop(now + index * duration + duration);
    });
    
    return audioContext;
}

console.log('Sound generator loaded. Functions available: generateClickSound(), generateMatchSound(), generateWinSound()');
