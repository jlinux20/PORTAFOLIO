class AnimationLoader {
    constructor() {
        this.loadedEffects = new Set();
        this.observer = this.createObserver();
        this.initializeObserver();
    }

    createObserver() {
        return new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );
    }

    initializeObserver() {
        // Observe elements with animation classes
        document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .terminal, .card, .project-card'
        ).forEach(element => {
            this.observer.observe(element);
            // Add GPU acceleration class
            element.classList.add('gpu-accelerated');
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.loadedEffects.has(entry.target)) {
                this.loadedEffects.add(entry.target);
                this.applyEffects(entry.target);
            }
        });
    }

    applyEffects(element) {
        // Add visible class for scroll animations
        element.classList.add('visible');

        // Apply specific effects based on element type
        if (element.classList.contains('terminal')) {
            this.loadTerminalEffect(element);
        } else if (element.classList.contains('card') || element.classList.contains('project-card')) {
            this.loadCardEffect(element);
        }

        // Handle lazy-loaded images
        const lazyImages = element.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            const src = img.dataset.src;
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
            }
        });
    }

    loadTerminalEffect(terminal) {
        // Add typing animation
        const content = terminal.querySelector('.terminal-content');
        if (content) {
            content.style.opacity = '0';
            requestAnimationFrame(() => {
                content.style.transition = 'opacity 0.5s ease';
                content.style.opacity = '1';
            });
        }

        // Add scan line effect
        const scanLine = document.createElement('div');
        scanLine.classList.add('scan-line');
        terminal.appendChild(scanLine);
        
        // Trigger scan animation
        requestAnimationFrame(() => {
            scanLine.classList.add('scanning');
        });
    }

    loadCardEffect(card) {
        // Add hover state handler with performance optimization
        let rafId;
        
        card.addEventListener('mouseenter', () => {
            if (rafId) cancelAnimationFrame(rafId);
            
            rafId = requestAnimationFrame(() => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 255, 136, 0.2)';
            });
        });

        card.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            
            rafId = requestAnimationFrame(() => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });
    }

    // Método para descargar y cargar efectos bajo demanda
    async loadEffect(effectName) {
        if (this.loadedEffects.has(effectName)) return;

        try {
            const module = await import(`./effects/${effectName}.js`);
            this.loadedEffects.add(effectName);
            return module.default;
        } catch (error) {
            console.error(`Error loading effect ${effectName}:`, error);
        }
    }
}

export default new AnimationLoader();