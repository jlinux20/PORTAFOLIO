// hacker-effects.js - efectos visuales y de sonido

// Ejemplo: efecto de partículas flotantes usando Canvas
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
  }

  addParticle(particle) {
    this.particles.push(particle);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        this.particles.splice(index, 1);
      } else {
        particle.update();
        particle.draw(this.ctx);
      }
    });
  }

  start() {
    if (!this.animationId) {
      this.animate();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// Efecto de pantalla de carga futurista
function loadingScreen(container, text = 'LOADING...') {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    color: #00ff41;
    font-family: 'Courier New', Courier, monospace;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    user-select: none;
  `;
  overlay.textContent = text;
  container.appendChild(overlay);
  return {
    remove: () => {
      container.removeChild(overlay);
    }
  };
}

// Manejo del menú responsive
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.menu-overlay');

    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay?.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Efecto de escaneo
    const cards = document.querySelectorAll('.scan-effect');
    const startScanObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scanning');
                }
            });
        },
        { threshold: 0.5 }
    );

    cards.forEach(card => startScanObserver.observe(card));

    // Efecto Matrix
    const createMatrixRain = () => {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.05';
        document.body.prepend(canvas);

        const context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;

        const rainDrops = Array.from({ length: columns }).fill(1);

        const draw = () => {
            context.fillStyle = 'rgba(0, 0, 0, 0.05)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = '#0F8';
            context.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                context.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        setInterval(draw, 30);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    };

    createMatrixRain();

    // Efecto de typing
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        let i = 0;

        const typeWriter = () => {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        typeWriter();
    }

    // Efecto de glitch en hover
    const glitchElements = document.querySelectorAll('.glitch-hover');
    glitchElements.forEach(element => {
        element.addEventListener('mouseover', () => {
            element.classList.add('glitching');
            setTimeout(() => {
                element.classList.remove('glitching');
            }, 1000);
        });
    });
});

// Exportar para usar en otros módulos
export { Particle, ParticleSystem, loadingScreen };
