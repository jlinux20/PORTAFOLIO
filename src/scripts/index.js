import visualEffects from './visual-effects-manager';
import animationLoader from './animation-loader';
import performanceManager from './performance-manager';

// Initialize visual effects with performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    // Start with reduced effects if needed
    if (performanceManager.isLowPowerMode) {
        visualEffects.setReducedEffects(true);
    }

    // Initialize animation loader
    animationLoader.initializeObserver();

    // Handle performance mode changes
    window.addEventListener('performanceModeChange', (event) => {
        visualEffects.setReducedEffects(event.detail.lowPowerMode);
    });

    // Initialize visual effects
    visualEffects.startAll();

    // Debug performance metrics in development
    if (process.env.NODE_ENV === 'development') {
        setInterval(() => {
            const metrics = performanceManager.getPerformanceMetrics();
            console.debug('Performance metrics:', metrics);
        }, 5000);
    }
});

// Export for use in other modules
export { visualEffects, animationLoader, performanceManager };