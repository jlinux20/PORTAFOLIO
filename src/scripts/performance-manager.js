class PerformanceManager {
    constructor() {
        this.isLowPowerMode = false;
        this.fpsThreshold = 30;
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.currentFps = 60;
        
        this.checkDeviceCapabilities();
        this.initializeMonitoring();
    }

    checkDeviceCapabilities() {
        // Check device memory
        const memory = navigator.deviceMemory;
        if (memory && memory < 4) {
            this.isLowPowerMode = true;
        }

        // Check for battery status
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.charging === false && battery.level < 0.2) {
                    this.isLowPowerMode = true;
                }
            });
        }

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.isLowPowerMode = true;
        }
    }

    initializeMonitoring() {
        // Monitor FPS
        const measureFps = () => {
            const now = performance.now();
            const delta = now - this.lastFrameTime;
            
            this.frameCount++;
            
            if (delta >= 1000) {
                this.currentFps = (this.frameCount * 1000) / delta;
                this.frameCount = 0;
                this.lastFrameTime = now;
                
                if (this.currentFps < this.fpsThreshold) {
                    this.enableLowPowerMode();
                }
            }
            
            requestAnimationFrame(measureFps);
        };
        
        requestAnimationFrame(measureFps);

        // Monitor memory usage if available
        if ('memory' in performance) {
            setInterval(() => {
                const memoryInfo = performance.memory;
                if (memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.8) {
                    this.enableLowPowerMode();
                }
            }, 5000);
        }
    }

    enableLowPowerMode() {
        if (this.isLowPowerMode) return;
        
        this.isLowPowerMode = true;
        
        // Reduce particle effects
        document.querySelectorAll('.particle').forEach(particle => {
            particle.style.animation = 'none';
        });

        // Disable or reduce matrix rain effect
        const matrixCanvas = document.querySelector('.matrix-background');
        if (matrixCanvas) {
            matrixCanvas.style.opacity = '0.02';
        }

        // Simplify animations
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            element.style.transition = 'none';
            element.classList.add('visible');
        });

        // Reduce blur effects
        document.querySelectorAll('[style*="backdrop-filter"]').forEach(element => {
            element.style.backdropFilter = 'none';
        });

        // Emit performance mode change event
        window.dispatchEvent(new CustomEvent('performanceModeChange', {
            detail: { lowPowerMode: true }
        }));
    }

    disableLowPowerMode() {
        if (!this.isLowPowerMode) return;
        
        this.isLowPowerMode = false;
        
        // Restore particle effects
        document.querySelectorAll('.particle').forEach(particle => {
            particle.style.animation = '';
        });

        // Restore matrix rain effect
        const matrixCanvas = document.querySelector('.matrix-background');
        if (matrixCanvas) {
            matrixCanvas.style.opacity = '0.05';
        }

        // Restore animations
        document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(element => {
            element.style.transition = '';
        });

        // Restore blur effects
        document.querySelectorAll('[style*="backdrop-filter"]').forEach(element => {
            element.style.backdropFilter = '';
        });

        // Emit performance mode change event
        window.dispatchEvent(new CustomEvent('performanceModeChange', {
            detail: { lowPowerMode: false }
        }));
    }

    getPerformanceMetrics() {
        return {
            fps: this.currentFps,
            lowPowerMode: this.isLowPowerMode,
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null
        };
    }
}

// Export singleton instance
export default new PerformanceManager();