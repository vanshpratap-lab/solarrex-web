const imgSlider = document.querySelector('.img-slider');
const imgItems = document.querySelectorAll('.img-item');
const infoItems = document.querySelectorAll('.info-item');
const navItems = document.querySelectorAll('.nav-item');
const solutionsSection = document.querySelector('.solutions');
const navbar = document.querySelector('.navbar');

let index = 0;
let isAnimating = false;

// Alert Notification Logic
const smartAlert = document.getElementById('smart-alert');
const alertCloseBtn = document.getElementById('alert-close-btn');

const showSuccessAlert = () => {
    smartAlert.classList.add('active');
    setTimeout(() => {
        smartAlert.classList.remove('active');
    }, 5000); // Auto-hide after 5 seconds
};

if (alertCloseBtn) {
    alertCloseBtn.addEventListener('click', () => {
        smartAlert.classList.remove('active');
    });
}

// Form Submission Handlers
const modalForm = document.querySelector('.modal-form');
const miniForm = document.querySelector('.mini-form');

const handleFormSubmit = (e) => {
    e.preventDefault();
    closeQuickModal(); // Close modal if it was open
    showSuccessAlert(); // Show the renamed success alert
    e.target.reset(); // Clear form fields
};

if (modalForm) modalForm.addEventListener('submit', handleFormSubmit);
if (miniForm) miniForm.addEventListener('submit', handleFormSubmit);

// Modal Interaction Logic
const overlay = document.getElementById('quick-modal-overlay');
const quickConnect = document.getElementById('quick-connect');
const headerTrigger = document.getElementById('quick-header-trigger');
const closeRed = document.getElementById('close-red');
const modalCloseMain = document.getElementById('modal-close-main');

const openQuickModal = () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeQuickModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
};

// Check if device is desktop
const isDesktop = () => window.innerWidth > 1024;

if (quickConnect) {
    // Desktop Hover Interaction
    quickConnect.addEventListener('mouseenter', () => {
        if (isDesktop()) openQuickModal();
    });

    // Mobile Click Interaction
    quickConnect.addEventListener('click', () => {
        if (!isDesktop()) openQuickModal();
    });
}

if (headerTrigger) {
    headerTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        openQuickModal();
    });
}

if (modalCloseMain) {
    modalCloseMain.addEventListener('click', (e) => {
        e.stopPropagation();
        closeQuickModal();
    });
}

if (closeRed) {
    closeRed.addEventListener('click', (e) => {
        e.stopPropagation();
        closeQuickModal();
    });
}

if (overlay) {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeQuickModal();
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const slider = () => {
    // Update Active Image with Exit Animation
    const activeImg = document.querySelector('.img-item.active');
    if (activeImg) {
        activeImg.classList.remove('active');
        activeImg.classList.add('exit');
        setTimeout(() => {
            activeImg.classList.remove('exit');
        }, 800);
    }
    imgItems[index].classList.add('active');

    // Update Active Content with Exit Animation
    const activeInfo = document.querySelector('.info-item.active');
    if (activeInfo) {
        activeInfo.classList.remove('active');
        activeInfo.classList.add('exit');
        setTimeout(() => {
            activeInfo.classList.remove('exit');
        }, 800);
    }
    infoItems[index].classList.add('active');

    // Update Active Nav Item
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav) activeNav.classList.remove('active');
    navItems[index].classList.add('active');
}

// Auto-play the slideshow every 8.5 seconds
let autoplayTimer = setInterval(() => {
    index++;
    if(index > imgItems.length - 1)
    {
        index = 0;
    }
    slider();
}, 8500);

// Function to stop autoplay permanently upon manual interaction
const stopAutoplay = () => {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
}

// Bottom Nav Click Handlers
navItems.forEach((item, i) => {
    item.addEventListener('click', () => {
        stopAutoplay();
        index = i;
        slider();
    });
});

// Scroll intercept logic for Section 02 (Product Slider)
solutionsSection.addEventListener('wheel', (e) => {
    const rect = solutionsSection.getBoundingClientRect();
    
    // Check if the section is perfectly aligned with the top
    const isAligned = Math.abs(rect.top) < 10;
    
    // If not aligned, don't intercept yet, let normal scroll happen
    if (!isAligned) return;

    const delta = e.deltaY;

    if (delta > 0) {
        // Scrolling Down
        if (index < imgItems.length - 1) {
            // If we are not at the last item, lock scroll and change item
            if (!isAnimating) {
                stopAutoplay();
                isAnimating = true;
                index++;
                slider();
                setTimeout(() => { isAnimating = false; }, 850);
            }
            e.preventDefault();
        } 
        // If at the last item, allow normal scroll to continue to Section 03
    } else if (delta < 0) {
        // Scrolling Up
        if (index > 0) {
            // If we are not at the first item, lock scroll and go back
            if (!isAnimating) {
                stopAutoplay();
                isAnimating = true;
                index--;
                slider();
                setTimeout(() => { isAnimating = false; }, 850);
            }
            e.preventDefault();
        }
        // If at the first item, allow normal scroll back to Section 01
    }
}, { passive: false });

// Support for Touch Devices
let touchStartVal = 0;
solutionsSection.addEventListener('touchstart', (e) => {
    touchStartVal = e.touches[0].clientY;
}, { passive: true });

solutionsSection.addEventListener('touchmove', (e) => {
    const rect = solutionsSection.getBoundingClientRect();
    const isAligned = Math.abs(rect.top) < 10;
    if (!isAligned) return;

    const touchEndVal = e.touches[0].clientY;
    const diff = touchStartVal - touchEndVal;

    if (Math.abs(diff) > 30) { // Gesture threshold
        if (diff > 0 && index < imgItems.length - 1) {
            if (!isAnimating) {
                stopAutoplay();
                isAnimating = true;
                index++;
                slider();
                setTimeout(() => { isAnimating = false; }, 850);
            }
            e.preventDefault();
        } else if (diff < 0 && index > 0) {
            if (!isAnimating) {
                stopAutoplay();
                isAnimating = true;
                index--;
                slider();
                setTimeout(() => { isAnimating = false; }, 850);
            }
            e.preventDefault();
        }
    }
}, { passive: false });

// Navbar mobile menu toggle
const navMenuBtn = document.querySelector('.nav-menu-btn');
const navLinks = document.querySelector('.nav-links');

navMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-active'); // For coordinated popup shift
    navMenuBtn.querySelector('i').classList.toggle('bx-x');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-active');
        navMenuBtn.querySelector('i').classList.remove('bx-x');
    });
});