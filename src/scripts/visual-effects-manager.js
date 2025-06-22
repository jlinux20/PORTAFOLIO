import MatrixRain from './matrix-rain';
import TerminalEffects from './terminal-effects';

class VisualEffectsManager {
    constructor() {
        this.effects = new Map();
        this.initializeEffects();
    }

    initializeEffects() {
        // Initialize Matrix Rain
        const matrixCanvas = document.createElement('canvas');
        matrixCanvas.classList.add('matrix-background');
        document.body.prepend(matrixCanvas);
        const matrixRain = new MatrixRain(matrixCanvas);
        matrixRain.setOpacity(0.05);
        this.effects.set('matrix', matrixRain);

        // Initialize Terminal Effects for all terminals
        document.querySelectorAll('.terminal').forEach((terminal, index) => {
            const terminalContent = terminal.querySelector('.terminal-content');
            if (terminalContent) {
                // Add cursor
                TerminalEffects.createCursor(terminalContent);

                // Add scan effect
                const scanEffect = TerminalEffects.scanEffect(terminal);
                this.effects.set(`terminal-scan-${index}`, scanEffect);

                // Add noise overlay
                const noiseOverlay = TerminalEffects.createNoiseOverlay(terminal);
                noiseOverlay.setIntensity(0.05);
            }
        });

        // Initialize glitch effects for glitch-hover elements
        document.querySelectorAll('.glitch-hover').forEach((element, index) => {
            const glitchEffect = TerminalEffects.glitchText(element);
            this.effects.set(`glitch-${index}`, glitchEffect);

            element.addEventListener('mouseenter', () => glitchEffect.start());
            element.addEventListener('mouseleave', () => glitchEffect.stop());
        });

        // Initialize typing effects
        document.querySelectorAll('[data-typewriter]').forEach((element, index) => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typewriterSpeed) || 50;
            
            this.effects.set(`typewriter-${index}`, {
                start: () => TerminalEffects.typeWriter(element, text, speed),
                stop: () => element.textContent = text
            });
        });
    }

    startAll() {
        this.effects.get('matrix')?.start();
        
        // Start scan effects on terminals
        this.effects.forEach((effect, key) => {
            if (key.startsWith('terminal-scan-')) {
                effect.start();
            }
        });

        // Start typewriter effects
        this.effects.forEach((effect, key) => {
            if (key.startsWith('typewriter-')) {
                effect.start();
            }
        });
    }

    stopAll() {
        this.effects.get('matrix')?.stop();
        
        this.effects.forEach((effect, key) => {
            if (key.startsWith('terminal-scan-') || key.startsWith('glitch-') || key.startsWith('typewriter-')) {
                effect.stop();
            }
        });
    }

    // Helper method to trigger scan effect on specific elements
    scanElement(element) {
        if (element) {
            const scanEffect = TerminalEffects.scanEffect(element);
            scanEffect.start();
            
            // Auto-remove after animation
            setTimeout(() => {
                scanEffect.stop();
                element.querySelector('.scan-line')?.remove();
            }, 3000);
        }
    }

    // Helper method to trigger glitch effect on specific elements
    glitchElement(element, duration = 1000) {
        if (element) {
            const glitchEffect = TerminalEffects.glitchText(element);
            glitchEffect.start();
            
            setTimeout(() => {
                glitchEffect.stop();
            }, duration);
        }
    }
}

// Create and export singleton instance
const visualEffects = new VisualEffectsManager();
export default visualEffects;