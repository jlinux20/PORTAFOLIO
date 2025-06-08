const firebaseConfig = {
  apiKey: "AIzaSyAbx66G2mENP5ENb9mhiW720VjFbvhgXXg",
  authDomain: "portfolio-web-dee85.firebaseapp.com",
  projectId: "portfolio-web-dee85",
  storageBucket: "portfolio-web-dee85.firebasestorage.app",
  messagingSenderId: "115579020873",
  appId: "1:115579020873:web:dc2c5ff23a3786235a4198",
  measurementId: "G-K4CYKZPQ4N"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>?';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        
        this.resizeCanvas();
        this.initDrops();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.initDrops();
    }
    
    initDrops() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * this.canvas.height;
        }
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.ctx.fillText(char, i * this.fontSize, this.drops[i]);
            
            if (this.drops[i] > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i] += this.fontSize;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Terminal Typing Effect
class TerminalTyping {
    constructor() {
        this.terminalOutput = document.getElementById('terminal-output');
        this.currentIndex = 0;
        this.commands = [
            {
                command: 'whoami',
                output: 'Juan Mamani - Ethical Hacker & Network Security Specialist'
            },
            {
                command: 'ls -la /skills/',
                output: 'drwxr-xr-x  ethical_hacking\ndrwxr-xr-x  network_security\ndrwxr-xr-x  cisco_certified\ndrwxr-xr-x  penetration_testing'
            },
            {
                command: 'cat /etc/motd',
                output: '=== BIENVENIDO AL PORTAFOLIO DE JUAN MAMANI ===\n\n🔐 Especialista en Ciberseguridad\n🌐 Administrador de Redes CCNA\n🐧 Linux Systems Expert\n📡 VoIP Implementation\n\n[SISTEMA LISTO PARA NAVEGACIÓN]'
            }
        ];
        
        this.startTyping();
    }
    
    async startTyping() {
        await this.delay(2000);
        
        for (const cmd of this.commands) {
            await this.typeCommand(cmd.command);
            await this.delay(1000);
            await this.typeOutput(cmd.output);
            await this.delay(2000);
        }
        
        this.showNavigationMessage();
    }
    
    async typeCommand(command) {
        const promptDiv = document.createElement('div');
        promptDiv.className = 'terminal-output';
        promptDiv.innerHTML = '<span class="terminal-prompt">juan@cybersec:~$</span> <span class="terminal-command"></span><span class="typing-cursor">|</span>';
        
        this.terminalOutput.appendChild(promptDiv);
        const commandSpan = promptDiv.querySelector('.terminal-command');
        
        for (let i = 0; i < command.length; i++) {
            commandSpan.textContent += command[i];
            await this.delay(100);
        }
        
        promptDiv.querySelector('.typing-cursor').remove();
    }
    
    async typeOutput(output) {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'terminal-output terminal-text';
        
        this.terminalOutput.appendChild(outputDiv);
        
        const lines = output.split('\n');
        for (const line of lines) {
            if (line.trim()) {
                let outputText = '';
                for (let i = 0; i < line.length; i++) {
                    outputText += line[i];
                    await this.delay(50);
                }
                outputDiv.innerHTML += outputText + '<br>';
            }
            await this.delay(300);
        }
    }
    
    showNavigationMessage() {
        const navDiv = document.createElement('div');
        navDiv.className = 'terminal-output';
        navDiv.innerHTML = '<br><span style="color: var(--cyan-blue);">💡 Usa la navegación superior para explorar el portafolio</span>';
        this.terminalOutput.appendChild(navDiv);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Navigation System
class Navigation {
    constructor() {
        this.currentSection = 'home';
        this.initEventListeners();
    }
    
    initEventListeners() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.switchSection(section);
            });
        });
    }
    
    switchSection(sectionName) {
        // Hide current section
        const currentSection = document.getElementById(this.currentSection);
        if (currentSection) {
            currentSection.classList.remove('active');
        }
        
        // Show new section
        const newSection = document.getElementById(sectionName);
        if (newSection) {
            newSection.classList.add('active');
        }
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        this.currentSection = sectionName;
        
        // Log navigation to Firebase
        this.logNavigation(sectionName);
    }
    
    async logNavigation(section) {
        try {
            await db.collection('analytics').add({
                page: section,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            });
        } catch (error) {
            console.log('Analytics logging failed:', error);
        }
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.initEventListeners();
        this.loadRecentMessages();
    }
    
    initEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    async handleSubmit() {
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            company: document.getElementById('contact-company').value,
            type: document.getElementById('contact-type').value,
            message: document.getElementById('contact-message').value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            read: false
        };
        
        try {
            const btn = this.form.querySelector('.btn');
            btn.textContent = 'ENVIANDO...';
            btn.disabled = true;
            
            await db.collection('messages').add(formData);
            
            this.showSuccessMessage();
            this.form.reset();
            this.loadRecentMessages();
            
        } catch (error) {
            this.showErrorMessage();
            console.error('Error:', error);
        } finally {
            const btn = this.form.querySelector('.btn');
            btn.textContent = 'ENVIAR_MENSAJE.EXE';
            btn.disabled = false;
        }
    }
    
    showSuccessMessage() {
        const success = document.createElement('div');
        success.style.cssText = `
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid var(--primary-green);
            color: var(--primary-green);
            padding: 1rem;
            border-radius: 4px;
            margin-top: 1rem;
        `;
        success.textContent = '✅ Mensaje enviado correctamente. Te contactaré pronto.';
        
        this.form.appendChild(success);
        setTimeout(() => success.remove(), 5000);
    }
    
    showErrorMessage() {
        const error = document.createElement('div');
        error.style.cssText = `
            background: rgba(255, 0, 64, 0.1);
            border: 1px solid var(--danger-red);
            color: var(--danger-red);
            padding: 1rem;
            border-radius: 4px;
            margin-top: 1rem;
        `;
        error.textContent = '❌ Error al enviar el mensaje. Inténtalo de nuevo.';
        
        this.form.appendChild(error);
        setTimeout(() => error.remove(), 5000);
    }
    
    async loadRecentMessages() {
        try {
            const snapshot = await db.collection('messages')
                .orderBy('timestamp', 'desc')
                .limit(5)
                .get();
            
            const messagesDiv = document.getElementById('recent-messages');
            
            if (snapshot.empty) {
                messagesDiv.innerHTML = '<p style="color: var(--text-muted);">No hay mensajes recientes.</p>';
                return;
            }
            
            let html = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString() : 'Fecha no disponible';
                
                html += `
                    <div style="border-left: 2px solid var(--primary-green); padding-left: 1rem; margin-bottom: 1rem;">
                        <strong>${data.name}</strong> - ${data.company || 'Sin empresa'}
                        <br><small style="color: var(--text-muted);">${date} | ${data.type || 'General'}</small>
                        <br><span style="color: var(--text-secondary);">${data.message.substring(0, 100)}...</span>
                    </div>
                `;
            });
            
            messagesDiv.innerHTML = html;
            
        } catch (error) {
            console.error('Error loading messages:', error);
            document.getElementById('recent-messages').innerHTML = 
                '<p style="color: var(--danger-red);">Error al cargar mensajes.</p>';
        }
    }
}

import { Particle, ParticleSystem, loadingScreen } from './hacker-effects.js';

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    new MatrixRain();
    new TerminalTyping();
    new Navigation();
    new ContactForm();

    // Initialize Particle System background effect
    const particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'particle-canvas';
    particleCanvas.style.position = 'fixed';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.zIndex = '0';
    particleCanvas.style.pointerEvents = 'none';
    document.body.appendChild(particleCanvas);

    const particleSystem = new ParticleSystem(particleCanvas);
    // Add some particles initially
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * particleCanvas.width;
        const y = Math.random() * particleCanvas.height;
        const radius = Math.random() * 2 + 1;
        const color = 'rgba(0, 255, 65, 0.7)';
        const velocity = { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 };
        particleSystem.addParticle(new Particle(x, y, radius, color, velocity));
    }
    particleSystem.start();

    // Add some interactive effects
    // document.querySelectorAll('.card').forEach(card => {
    //     card.addEventListener('mouseenter', () => {
    //         card.style.transform = 'translateY(-5px) scale(1.02)';
    //     });
        
    //     card.addEventListener('mouseleave', () => {
    //         card.style.transform = 'translateY(0) scale(1)';
    //     });
    // });
});

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}
