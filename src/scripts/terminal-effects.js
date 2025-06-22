class TerminalEffects {
    static typeWriter(element, text, speed = 50, callback = null) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        
        type();
    }

    static createCursor(element) {
        const cursor = document.createElement('span');
        cursor.classList.add('terminal-cursor');
        cursor.textContent = '█';
        element.appendChild(cursor);
        return cursor;
    }

    static glitchText(element, intensity = 1) {
        const originalText = element.textContent;
        const glitchChars = '@#$%&/{([)]}=+*^?!';
        let isGlitching = false;
        
        function glitch() {
            if (!isGlitching) return;
            
            const text = element.textContent;
            const glitchedText = text
                .split('')
                .map(char => {
                    if (Math.random() < 0.1 * intensity) {
                        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    }
                    return char;
                })
                .join('');
            
            element.textContent = glitchedText;
            
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if (isGlitching) {
                        element.textContent = originalText;
                        requestAnimationFrame(glitch);
                    }
                }, 50);
            });
        }

        return {
            start: () => {
                isGlitching = true;
                glitch();
            },
            stop: () => {
                isGlitching = false;
                element.textContent = originalText;
            }
        };
    }

    static scanEffect(element) {
        const scanLine = document.createElement('div');
        scanLine.classList.add('scan-line');
        element.appendChild(scanLine);
        
        return {
            start: () => scanLine.classList.add('scanning'),
            stop: () => scanLine.classList.remove('scanning')
        };
    }

    static async terminalBoot(element, commands = [], speed = 50) {
        for (const command of commands) {
            // Simulate command typing
            await new Promise(resolve => {
                this.typeWriter(element, '> ' + command.input, speed, resolve);
            });
            
            // Wait a bit after command is typed
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Show command output if any
            if (command.output) {
                const outputElement = document.createElement('div');
                outputElement.classList.add('terminal-output');
                element.appendChild(outputElement);
                
                await new Promise(resolve => {
                    this.typeWriter(outputElement, command.output, speed / 2, resolve);
                });
            }
            
            // Add new line
            element.appendChild(document.createElement('br'));
        }
    }

    static createNoiseOverlay(element) {
        const noise = document.createElement('div');
        noise.classList.add('noise-overlay');
        element.appendChild(noise);
        
        return {
            setIntensity: (intensity) => {
                noise.style.opacity = intensity;
            }
        };
    }
}

// CSS classes needed for the effects
const styles = `
    .terminal-cursor {
        animation: blink 1s step-end infinite;
    }

    @keyframes blink {
        50% { opacity: 0; }
    }

    .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: rgba(0, 255, 157, 0.2);
        opacity: 0;
    }

    .scan-line.scanning {
        animation: scan 3s linear infinite;
    }

    @keyframes scan {
        0% {
            top: 0;
            opacity: 0;
        }
        5% {
            opacity: 0.8;
        }
        95% {
            opacity: 0.8;
        }
        100% {
            top: 100%;
            opacity: 0;
        }
    }

    .noise-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0K+sGAAAACHRSTlMzMzMzMzMzM85JBgUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAwSURBVDjLY2AYBaNg8AGRE4PlCxSA2MHBwRVwyczBAZnkwMAAk4SyRwF+MApGAQ4AAExGRPlU4Sf5AAAAAElFTkSuQmCC');
        mix-blend-mode: overlay;
        opacity: 0.05;
        pointer-events: none;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default TerminalEffects;