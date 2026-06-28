const imgSlider = document.querySelector('.img-slider');
const imgItems = document.querySelectorAll('.img-item');
const infoItems = document.querySelectorAll('.info-item');
const navItems = document.querySelectorAll('.nav-item');
const solutionsSection = document.querySelector('.solutions');

let index = 0;
let isAnimating = false;

const slider = () => {
    // Update Active Image with Exit Animation
    const activeImg = document.querySelector('.img-item.active');
    if (activeImg) {
        activeImg.classList.remove('active');
        activeImg.classList.add('exit');
        const oldImg = activeImg;
        setTimeout(() => {
            oldImg.classList.remove('exit');
        }, 800);
    }
    imgItems[index].classList.add('active');

    // Update Active Content with Exit Animation
    const activeInfo = document.querySelector('.info-item.active');
    if (activeInfo) {
        activeInfo.classList.remove('active');
        activeInfo.classList.add('exit');
        const oldInfo = activeInfo;
        setTimeout(() => {
            oldInfo.classList.remove('exit');
        }, 800);
    }
    infoItems[index].classList.add('active');

    // Update Active Nav Item
    document.querySelector('.nav-item.active').classList.remove('active');
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

// Scroll intercept logic for Desktop (Mouse Wheel)
solutionsSection.addEventListener('wheel', (e) => {
    const rect = solutionsSection.getBoundingClientRect();
    
    // Only lock and intercept if the section is aligned with the top of the viewport
    const isAligned = Math.abs(rect.top) < 80;

    if (!isAligned) {
        return; // Allow normal page scroll
    }

    // If aligned and we are currently transitioning, block the wheel inputs
    if (isAnimating) {
        e.preventDefault();
        return;
    }

    const delta = e.deltaY;

    if (delta > 0) {
        // Scroll Down -> Next Product
        if (index < imgItems.length - 1) {
            e.preventDefault();
            // Align the section perfectly to keep it locked
            if (Math.abs(rect.top) > 5) {
                window.scrollTo(0, window.scrollY + rect.top);
            }
            stopAutoplay();
            isAnimating = true;
            index++;
            slider();
            setTimeout(() => { isAnimating = false; }, 850); // Cooldown matching animation transition (850ms)
        }
    } else if (delta < 0) {
        // Scroll Up -> Previous Product
        if (index > 0) {
            e.preventDefault();
            // Align the section perfectly to keep it locked
            if (Math.abs(rect.top) > 5) {
                window.scrollTo(0, window.scrollY + rect.top);
            }
            stopAutoplay();
            isAnimating = true;
            index--;
            slider();
            setTimeout(() => { isAnimating = false; }, 850);
        }
    }
}, { passive: false });

// Touch swipe intercept logic for Mobile devices
let touchStartY = 0;
solutionsSection.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

solutionsSection.addEventListener('touchend', (e) => {
    const rect = solutionsSection.getBoundingClientRect();
    const isAligned = Math.abs(rect.top) < 80;

    if (!isAligned) {
        return; // Allow normal swipe-scrolling
    }

    if (isAnimating) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;

    // Threshold of 50px for swipe gesture
    if (Math.abs(diffY) > 50) {
        if (diffY > 0) {
            // Swiped Up (scroll down) -> Next Product
            if (index < imgItems.length - 1) {
                if (Math.abs(rect.top) > 5) {
                    window.scrollTo(0, window.scrollY + rect.top);
                }
                stopAutoplay();
                isAnimating = true;
                index++;
                slider();
                setTimeout(() => { isAnimating = false; }, 850);
            }
        } else {
            // Swiped Down (scroll up) -> Previous Product
            if (index > 0) {
                if (Math.abs(rect.top) > 5) {
                    window.scrollTo(0, window.scrollY + rect.top);
                }
                stopAutoplay();
                isAnimating = true;
                index--;
                slider();
                setTimeout(() => { isAnimating = false; }, 850);
            }
        }
    }
}, { passive: true });

// Navbar mobile menu toggle
const navMenuBtn = document.querySelector('.nav-menu-btn');
const navLinks = document.querySelector('.nav-links');

navMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navMenuBtn.querySelector('i').classList.toggle('bx-x');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navMenuBtn.querySelector('i').classList.remove('bx-x');
    });
});