// matrix-rain.js - vanilla JS matrix rain effect

class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resizeCanvas();
        this.setupCharacters();
        this.setupColumns();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.setupColumns();
    }

    setupCharacters() {
        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        this.characters = katakana + latin + nums + symbols;
    }

    setupColumns() {
        const fontSize = 16;
        const columns = Math.ceil(this.canvas.width / fontSize);
        this.drops = new Array(columns).fill(1);
        this.fontSize = fontSize;
    }

    getRandomChar() {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    }

    draw() {
        // Semi-transparent black background for trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Green text
        this.ctx.fillStyle = '#0F8';
        this.ctx.font = this.fontSize + 'px monospace';

        // Draw each character
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.getRandomChar();
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            // Add random brightness effect
            const brightness = Math.random();
            this.ctx.fillStyle = `rgba(0, 255, ${Math.floor(brightness * 100) + 100}, ${brightness})`;
            
            this.ctx.fillText(text, x, y);

            // Reset drop when it reaches bottom or randomly
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }
    }

    start() {
        if (!this._animationFrame) {
            const animate = () => {
                this.draw();
                this._animationFrame = requestAnimationFrame(animate);
            };
            animate();
        }
    }

    stop() {
        if (this._animationFrame) {
            cancelAnimationFrame(this._animationFrame);
            this._animationFrame = null;
        }
    }

    setOpacity(opacity) {
        this.canvas.style.opacity = opacity;
    }
}

// Export the MatrixRain class
export default MatrixRain;
