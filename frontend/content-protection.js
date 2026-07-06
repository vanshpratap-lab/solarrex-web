/* Global Content Protection System */

(function () {
    // 1. Create and inject toast container into DOM
    const toast = document.createElement('div');
    toast.className = 'protected-toast-container';
    
    const header = document.createElement('div');
    header.className = 'protected-toast-header';
    header.innerHTML = '<span>🔒</span> Content Protected';
    
    const desc = document.createElement('div');
    desc.className = 'protected-toast-desc';
    desc.textContent = 'This content is protected by Solar Rex.';
    
    toast.appendChild(header);
    toast.appendChild(desc);
    document.body.appendChild(toast);
    
    let hideTimeout = null;

    // 2. Function to show toast at mouse coordinates
    const showToast = (e) => {
        // Clear any existing timeout
        clearTimeout(hideTimeout);

        // Get coordinates
        let x = e.clientX;
        let y = e.clientY;

        // Viewport bounds checking (prevent toast overflowing the screen)
        const toastWidth = 280; // approximate width
        const toastHeight = 70; // approximate height
        const margin = 15;

        // Check horizontal boundary
        if (x + toastWidth + margin > window.innerWidth) {
            x = window.innerWidth - toastWidth - margin;
        } else {
            x = x + margin;
        }

        // Check vertical boundary
        if (y + toastHeight + margin > window.innerHeight) {
            y = window.innerHeight - toastHeight - margin;
        } else {
            y = y + margin;
        }

        // Set position and show toast
        toast.style.left = `${x}px`;
        toast.style.top = `${y}px`;
        toast.classList.add('active');

        // Hide after 2 seconds
        hideTimeout = setTimeout(() => {
            toast.classList.remove('active');
        }, 2000);
    };

    // 3. Disable right-click globally
    document.addEventListener('contextmenu', (e) => {
        // Do not disable right click on text input fields or textareas
        const target = e.target;
        if (
            target.tagName === 'INPUT' || 
            target.tagName === 'TEXTAREA' || 
            target.isContentEditable
        ) {
            return;
        }
        
        e.preventDefault();
        showToast(e);
    });

    // 4. Disable image and video dragging
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
            e.preventDefault();
        }
    });
})();
