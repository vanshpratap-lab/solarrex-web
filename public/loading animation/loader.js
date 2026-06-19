document.addEventListener('DOMContentLoaded', () => {
    // Disable body scrolling initially
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        const overlay = document.getElementById('loader-overlay');
        if (overlay) {
            overlay.classList.add('fade-out');
            // Restore body scrolling
            document.body.style.overflow = '';
        }
    }, 2800); // 2.8 seconds loading time allows the cursive Welcome drawing animation to complete beautifully
});
