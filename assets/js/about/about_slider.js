document.addEventListener('DOMContentLoaded', function() {
    // Variables for expertise carousel
    const expertiseSlides = document.querySelectorAll('.expertise-slide');
    const expertiseDots = document.querySelectorAll('.expertise-dot');
    let currentSlideIndex = 0;
    let expertiseInterval;
    let isAnimating = false; // Flag to prevent animation overlap

    // Function to show a specific slide with improved fade animation
    function showExpertiseSlide(index) {
        // Don't change slide if animation is in progress
        if (isAnimating) return;
        isAnimating = true;
        
        // Handle index bounds
        if (index >= expertiseSlides.length) {
            index = 0;
        } else if (index < 0) {
            index = expertiseSlides.length - 1;
        }
        
        // Don't animate if it's already the current slide
        if (index === currentSlideIndex) {
            isAnimating = false;
            return;
        }
        
        // Store the previous slide index
        const prevSlideIndex = currentSlideIndex;
        currentSlideIndex = index;
        
        // Update the active dot
        expertiseDots.forEach(dot => dot.classList.remove('active'));
        expertiseDots[currentSlideIndex].classList.add('active');

        // Fade out the current slide
        expertiseSlides[prevSlideIndex].style.opacity = '0';
        
        // After fade out is complete, set up the new slide
        setTimeout(() => {
            expertiseSlides.forEach((slide, i) => {
                if (i === currentSlideIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            // Fade in the new slide
            setTimeout(() => {
                expertiseSlides[currentSlideIndex].style.opacity = '1';
                isAnimating = false; // Animation complete
            }, 50); // Small delay to ensure DOM updates before fade in
            
        }, 400); // Wait for fade out to complete (should match CSS transition time)
    }

    // Add click event for expertise dots
    expertiseDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showExpertiseSlide(index);
            // Reset the interval when user clicks
            clearInterval(expertiseInterval);
            startExpertiseCarousel();
        });
    });

    // Function to move to the next slide
    function nextExpertiseSlide() {
        showExpertiseSlide(currentSlideIndex + 1);
    }

    // Start the automatic carousel
    function startExpertiseCarousel() {
        clearInterval(expertiseInterval); // Clear any existing interval
        expertiseInterval = setInterval(nextExpertiseSlide, 4000); // Change slide every 4 seconds
    }

    // Add swipe functionality for mobile
    const expertiseCarousel = document.querySelector('.expertise-carousel');
    let touchStartX = 0;
    let touchEndX = 0;

    expertiseCarousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    expertiseCarousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchEndX < touchStartX) {
            // Swipe left, go to next slide
            showExpertiseSlide(currentSlideIndex + 1);
        } else if (touchEndX > touchStartX) {
            // Swipe right, go to previous slide
            showExpertiseSlide(currentSlideIndex - 1);
        }
        clearInterval(expertiseInterval);
        startExpertiseCarousel();
    }

    // Initialize the carousel
    expertiseSlides.forEach((slide, i) => {
        if (i === 0) {
            slide.classList.add('active');
            slide.style.opacity = '1';
        } else {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        }
    });
    
    expertiseDots[0].classList.add('active');
    startExpertiseCarousel();
});