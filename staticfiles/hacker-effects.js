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

// Exportar para usar en otros módulos
export { Particle, ParticleSystem, loadingScreen };
