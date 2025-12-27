// Intro Card Tubes Effect - Optimized
const canvas = document.getElementById('intro-canvas');
const introCard = document.querySelector('.intro-card');

if (canvas && introCard) {
    let app = null;
    let isHovering = false;
    let modulePromise = null;

    // Tube colors matching your design
    const tubeColors = ['#c5c5c5', '#808080', '#4a4a4a'];
    const lightColors = ['#ffffff', '#c5c5c5', '#808080', '#5a5a5a'];

    // Preload the module immediately (don't wait for hover)
    const preloadModule = () => {
        if (!modulePromise) {
            modulePromise = import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js')
                .then(module => module.default)
                .catch(error => {
                    console.error('Failed to preload tubes effect:', error);
                    return null;
                });
        }
        return modulePromise;
    };

    // Start preloading after a short delay or on user interaction
    const initPreload = () => {
        preloadModule();
        // Remove listeners after first trigger
        document.removeEventListener('mousemove', initPreload);
        document.removeEventListener('scroll', initPreload);
    };

    // Preload on first user interaction
    document.addEventListener('mousemove', initPreload, { once: true, passive: true });
    document.addEventListener('scroll', initPreload, { once: true, passive: true });
    
    // Also preload after 1 second as fallback
    setTimeout(initPreload, 1000);

    // Initialize and start the effect when hovering
    introCard.addEventListener('mouseenter', async () => {
        isHovering = true;
        
        if (!app) {
            const TubesCursor = await preloadModule();
            if (!TubesCursor) return;
            
            app = TubesCursor(canvas, {
                tubes: {
                    colors: tubeColors,
                    lights: {
                        intensity: 160,
                        colors: lightColors
                    }
                }
            });
        }
        
        // Resume animation
        if (app?.renderer?.setAnimationLoop) {
            app.renderer.setAnimationLoop(() => {
                if (isHovering && app.render) {
                    app.render();
                }
            });
        }
    });

    // Pause the effect when not hovering
    introCard.addEventListener('mouseleave', () => {
        isHovering = false;
        if (app?.renderer?.setAnimationLoop) {
            app.renderer.setAnimationLoop(null);
        }
    });
}