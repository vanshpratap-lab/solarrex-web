document.addEventListener('DOMContentLoaded', () => {
    try {
        const navEntries = performance.getEntriesByType('navigation');
        const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';
        const loaderHasRun = sessionStorage.getItem('loaderHasRun');
        
        const overlay = document.getElementById('loader-overlay');
        
        if (loaderHasRun === 'true' && !isReload) {
            // Return visit: Skip the welcome animation
            if (overlay) {
                overlay.style.display = 'none';
            }
            document.body.style.overflow = '';
        } else {
            // First load or manual refresh: Play the animation
            sessionStorage.setItem('loaderHasRun', 'true');
            
            // Disable body scrolling initially
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                if (overlay) {
                    overlay.classList.add('fade-out');
                    // Restore body scrolling
                    document.body.style.overflow = '';
                }
            }, 1300); // 1.3 seconds allows fast drawing and ensures page is fully ready under 3 seconds
        }
    } catch(e) {
        // Fallback safety
        document.body.style.overflow = '';
    }
});
