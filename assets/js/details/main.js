// Add fade-in animation to sections as they become visible
document.addEventListener("DOMContentLoaded", function () {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = "translateY(0)";
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll(".section").forEach((section) => {
        observer.observe(section);
    });
});

const closeButton = document.querySelector(".close-button");
if (closeButton) {
    closeButton.addEventListener("click", function () {
        window.history.back();
    });
}

/* Improved image loading script */
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function () {
                img.classList.add('loaded');
            });
            // Handle loading errors
            img.addEventListener('error', function () {
                console.log('Image failed to load:', img.src);
            });
        }
    });
});