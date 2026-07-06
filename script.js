const imgSlider = document.querySelector('.img-slider');
const imgItems = document.querySelectorAll('.img-item');
const infoItems = document.querySelectorAll('.info-item');
const navItems = document.querySelectorAll('.nav-item');
const solutionsSection = document.querySelector('.solutions');

let index = 0;
let isAnimating = false;

const slider = () => {
    // --- Image Slider ---
    const prevImg = document.querySelector('.img-item.active');
    // Remove active from previous, add exit animation
    if (prevImg && prevImg !== imgItems[index]) {
        prevImg.classList.remove('active');
        prevImg.classList.add('exit');
        setTimeout(() => { prevImg.classList.remove('exit'); }, 800);
    }
    // Activate new image
    imgItems[index].classList.remove('exit');
    imgItems[index].classList.add('active');

    // --- Info Content Slider ---
    const prevInfo = document.querySelector('.info-item.active');
    // Remove active from previous, add exit animation
    if (prevInfo && prevInfo !== infoItems[index]) {
        prevInfo.classList.remove('active');
        prevInfo.classList.add('exit');
        setTimeout(() => { prevInfo.classList.remove('exit'); }, 800);
    }
    // Activate new info panel
    infoItems[index].classList.remove('exit');
    infoItems[index].classList.add('active');

    // --- Bottom Nav ---
    const activeNavItem = document.querySelector('.nav-item.active');
    if (activeNavItem) activeNavItem.classList.remove('active');
    navItems[index].classList.add('active');
}

// Auto-play the slideshow every 8.5 seconds
let autoplayTimer = setInterval(() => {
    index++;
    if (index > imgItems.length - 1) {
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
        if (i === index) return; // Already on this slide
        stopAutoplay();
        index = i;
        slider();
    });
});

// Scroll intercept logic for Desktop (Mouse Wheel)
solutionsSection.addEventListener('wheel', (e) => {
    const rect = solutionsSection.getBoundingClientRect();

    // Only lock and intercept if the section is near the top of the viewport
    const isAligned = Math.abs(rect.top) < 80;

    if (!isAligned) {
        return; // Section not in view — allow normal page scroll
    }

    // If animating, block extra inputs
    if (isAnimating) {
        e.preventDefault();
        return;
    }

    const delta = e.deltaY;

    if (delta > 0) {
        // Scroll Down -> Next slide
        if (index < imgItems.length - 1) {
            // Still have slides to show — intercept
            e.preventDefault();
            if (Math.abs(rect.top) > 5) {
                window.scrollTo({ top: window.scrollY + rect.top, behavior: 'instant' });
            }
            stopAutoplay();
            isAnimating = true;
            index++;
            slider();
            setTimeout(() => { isAnimating = false; }, 850);
        }
        // else: last slide — let page scroll continue naturally
    } else if (delta < 0) {
        // Scroll Up -> Previous slide
        if (index > 0) {
            // Still have slides to go back to — intercept
            e.preventDefault();
            if (Math.abs(rect.top) > 5) {
                window.scrollTo({ top: window.scrollY + rect.top, behavior: 'instant' });
            }
            stopAutoplay();
            isAnimating = true;
            index--;
            slider();
            setTimeout(() => { isAnimating = false; }, 850);
        }
        // else: first slide — let page scroll continue naturally
    }
}, { passive: false });

// Touch swipe intercept logic for Mobile devices
// Only intercept vertical swipes within the solutions section when it's in view
let touchStartY = 0;
let touchStartX = 0;
let isTouchScrolling = false;

solutionsSection.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    isTouchScrolling = false;
}, { passive: true });

solutionsSection.addEventListener('touchmove', (e) => {
    // Mark as scrolling so touchend knows it was a scroll not a tap
    if (!isTouchScrolling) {
        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        // Only flag as scrolling if mostly vertical movement (not horizontal)
        if (dy > dx && dy > 5) {
            isTouchScrolling = true;
        }
    }
    // NEVER call preventDefault here — always let native scroll work freely
}, { passive: true });

solutionsSection.addEventListener('touchend', (e) => {
    if (!isTouchScrolling) return; // Was a tap, not a swipe

    const rect = solutionsSection.getBoundingClientRect();
    // Only intercept slides when section fills viewport (user is on that section)
    const sectionVisible = rect.top >= -50 && rect.top <= 50;

    if (!sectionVisible) {
        return; // Allow normal swipe-scrolling
    }

    if (isAnimating) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;

    // Threshold of 60px for intentional swipe gesture
    if (Math.abs(diffY) > 60) {
        if (diffY > 0) {
            // Swiped Up (scroll down) -> Next slide
            if (index < imgItems.length - 1) {
                stopAutoplay();
                isAnimating = true;
                index++;
                slider();
                setTimeout(() => { isAnimating = false; }, 850);
            }
        } else {
            // Swiped Down (scroll up) -> Previous slide
            if (index > 0) {
                stopAutoplay();
                isAnimating = true;
                index--;
                slider();
                setTimeout(() => { isAnimating = false; }, 850);
            }
        }
    }

    isTouchScrolling = false;
}, { passive: true });

// Navbar mobile menu toggle
const navMenuBtn = document.querySelector('.nav-menu-btn');
const navLinks = document.querySelector('.nav-links');

navMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navMenuBtn.querySelector('i').classList.toggle('bx-x');
    // Lock/unlock body scroll when mobile menu is open
    document.body.classList.toggle('menu-open');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navMenuBtn.querySelector('i').classList.remove('bx-x');
        document.body.classList.remove('menu-open');
    });
});