// Social Icons Lottie Animations
document.addEventListener('DOMContentLoaded', function() {
    // Check if Lottie is loaded
    if (typeof lottie === 'undefined') {
        console.warn('Lottie library not loaded');
        return;
    }

    // Configuration for each animated icon
    const iconConfigs = [
        {
            id: 'github-lottie',
            path: './assets/icons/github.json',
            className: 'github-icon'
        },
        {
            id: 'linkedin-lottie',
            path: './assets/icons/linkedin.json',
            className: 'linkedin-icon'
        },
        {
            id: 'dribbble-lottie',
            path: './assets/icons/dribbble.json',
            className: 'dribbble-icon'
        },
        {
            id: 'mail-lottie',
            path: './assets/icons/mail.json',
            className: 'mail-icon'
        }
    ];

    // Initialize each icon
    iconConfigs.forEach(config => {
        const container = document.getElementById(config.id);
        
        if (container) {
            // Load and initialize the Lottie animation
            const animation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: config.path
            });
            
            const iconLink = container.closest(`.${config.className}`);
            
            if (iconLink) {
                // Play animation on hover
                iconLink.addEventListener('mouseenter', () => {
                    animation.goToAndPlay(0, true);
                });
                
                // Reset on mouse leave
                iconLink.addEventListener('mouseleave', () => {
                    animation.goToAndStop(0, true);
                });
            }
        }
    });
});
