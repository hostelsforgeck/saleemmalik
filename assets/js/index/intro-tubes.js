// Intro Card Tubes Effect
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('intro-canvas');
    const introCard = document.querySelector('.intro-card');
    
    if (!canvas || !introCard) return;
    
    let app = null;
    let isHovering = false;

    // Tube colors matching your design
    const tubeColors = ['#c5c5c5', '#808080', '#4a4a4a'];
    const lightColors = ['#ffffff', '#c5c5c5', '#808080', '#5a5a5a'];

    // Initialize and start the effect when hovering
    introCard.addEventListener('mouseenter', async () => {
        isHovering = true;
        if (!app) {
            try {
                const TubesCursor = (await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js')).default;
                
                app = TubesCursor(canvas, {
                    tubes: {
                        colors: tubeColors,
                        lights: {
                            intensity: 160,
                            colors: lightColors
                        }
                    }
                });
            } catch (error) {
                console.error('Failed to load tubes effect:', error);
            }
        } else {
            // Resume animation if it was paused
            if (app.renderer && app.renderer.setAnimationLoop) {
                app.renderer.setAnimationLoop(() => {
                    if (isHovering && app.render) {
                        app.render();
                    }
                });
            }
        }
    });

    // Pause the effect when not hovering
    introCard.addEventListener('mouseleave', () => {
        isHovering = false;
        if (app && app.renderer && app.renderer.setAnimationLoop) {
            app.renderer.setAnimationLoop(null);
        }
    });
});