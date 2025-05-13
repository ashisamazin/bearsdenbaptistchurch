// Add animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('event-card')) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        }
        });
    }, {
        threshold: 0.1
    });

    // Observe elements
    document.querySelectorAll('.event-card, .info-box, .videos-container, .quick-link').forEach((el) => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add initial animations
    document.querySelector('.hero-content').classList.add('fade-in');
    document.querySelector('.navbar').classList.add('fade-in');
    });