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

// 3D Book Portfolio Logic
const pageTurnBtn = document.querySelectorAll('.nextprev-btn');

pageTurnBtn.forEach((el, index) => {
    el.onclick = () => {
        const pageTurnId = el.getAttribute('data-page');
        const pageTurn = document.getElementById(pageTurnId);

        if (pageTurn.classList.contains('turn')) {
            pageTurn.classList.remove('turn');
            setTimeout(() => {
                pageTurn.style.zIndex = 20 - index;
            }, 500);
        } else {
            pageTurn.classList.add('turn');
            setTimeout(() => {
                pageTurn.style.zIndex = 20 + index;
            }, 500);
        }
    }
});

const bookPages = document.querySelectorAll('.book-page.page-right');
const bookContactBtn = document.querySelector('.btn.contact-me');

if (bookContactBtn) {
    bookContactBtn.onclick = () => {
        bookPages.forEach((page, index) => {
            setTimeout(() => {
                page.classList.add('turn');
                setTimeout(() => {
                    page.style.zIndex = 20 + index;
                }, 500);
            }, (index + 1) * 200 + 100);
        });
    }
}

let bookTotalPages = bookPages.length;
let bookPageNumber = 0;

function reverseBookIndex() {
    bookPageNumber--;
    if (bookPageNumber < 0) {
        bookPageNumber = bookTotalPages - 1;
    }
}

const backProfileBtn = document.querySelector('.back-profile');
if (backProfileBtn) {
    backProfileBtn.onclick = () => {
        bookPages.forEach((_, index) => {
            setTimeout(() => {
                reverseBookIndex();
                bookPages[bookPageNumber].classList.remove('turn');
                setTimeout(() => {
                    reverseBookIndex();
                    bookPages[bookPageNumber].style.zIndex = 10 + index;
                }, 500);
            }, (index + 1) * 200 + 100);
        });
    }
}

const coverRight = document.querySelector('.cover.cover-right');
if (coverRight) {
    // Initial opening animation when section is in view? 
    // For now, let's keep it manual or triggered by a scroll observer for best performance.
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

// Operations Interactive Showcase (Section 4) Tab Logic
const opMenuItems = document.querySelectorAll('.operations-menu li');
const opContents = document.querySelectorAll('.op-content');

if (opMenuItems.length > 0 && opContents.length > 0) {
    opMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all menu items
            opMenuItems.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked menu item
            item.classList.add('active');
            
            // Get the target content ID
            const targetId = 'content-' + item.getAttribute('data-target');
            
            // Hide all content blocks
            opContents.forEach(content => content.classList.remove('active'));
            
            // Show the target content block
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Contact Section Form Type Selector
const typeBtns = document.querySelectorAll('.type-btn');

if (typeBtns.length > 0) {
    typeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Scope changes to either the main form or the modal form
            const wrapper = this.closest('.contact-form-wrapper') || this.closest('.quick-modal-content');
            const localBtns = wrapper.querySelectorAll('.type-btn');
            const localSections = wrapper.querySelectorAll('.form-group-section');

            // Remove active from all local buttons
            localBtns.forEach(b => {
                b.classList.remove('active');
                const icon = b.querySelector('i');
                if (icon) icon.remove();
            });
            
            // Add active to clicked
            this.classList.add('active');
            this.insertAdjacentHTML('afterbegin', "<i class='bx bx-radio-circle-marked'></i> ");

            // Switch the form section
            const target = this.getAttribute('data-target');
            localSections.forEach(section => {
                section.classList.remove('active');
            });
            const targetSection = document.getElementById('form-' + target);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Case Studies Filter Logic
const csTabs = document.querySelectorAll('.cs-tab');
const csCards = document.querySelectorAll('.cs-card');

if (csTabs.length > 0) {
    csTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            csTabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            // Filter cards
            csCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}

// Auto-hide Floating Form when reaching Contact Section
const contactSection = document.querySelector('.section-contact');
// Re-select quickConnect globally just to be safe if not available
const floatingPopup = document.getElementById('quick-connect');

if (contactSection && floatingPopup) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Hide popup
                floatingPopup.classList.add('hide-popup');
            } else {
                // Show popup again
                floatingPopup.classList.remove('hide-popup');
            }
        });
    }, {
        threshold: 0.15 // Triggers when 15% of the contact section is visible
    });

    observer.observe(contactSection);
}

// Interactive Pricing Calculator Logic
const kwSlider = document.getElementById('kw-slider');
if (kwSlider) {
    // --- DOM Elements ---
    const currentKwEl   = document.getElementById('current-kw');
    const valDcr        = document.getElementById('val-dcr');
    const valDcrStrike  = document.getElementById('val-dcr-strike');
    const valNdcr       = document.getElementById('val-ndcr');
    const valSavings    = document.getElementById('val-savings');
    const valGen        = document.getElementById('val-gen');
    const valDaily      = document.getElementById('val-daily');
    const valArea       = document.getElementById('val-area');
    const valDim        = document.getElementById('val-dim');
    const valPanels     = document.getElementById('val-panels');
    const valWatt       = document.getElementById('val-watt');
    const receiptDate   = document.getElementById('receipt-date');
    const receiptDetails = document.getElementById('receipt-details');
    const pricingReceipt = document.getElementById('pricing-receipt-wrapper');

    // --- Official Pricing Data (from price list) ---
    // D = daily units, M = monthly units, P = panels, Area in SqFt, dim = dimensions
    const pricingData = [
        { kw: 3,  dcr: '₹78,000', dcrStrike: '₹1,90,000', ndcr: '₹1,70,000', savings: '₹3,600 - ₹4,800', gen: '360-480 Units/Mo', daily: '12-16 Units/Day',  area: '180 SqFt', dim: '12×15 Ft',  panels: '6 Panels',     watt: '540-630W' },
        { kw: 4,  dcr: '₹1,52,000', dcrStrike: '₹2,30,000', ndcr: '₹1,90,000', savings: '₹4K - ₹5K',       gen: '480-600 Units/Mo', daily: '16-20 Units/Day',  area: '240 SqFt', dim: '16×15 Ft',  panels: '7 Panels',     watt: '540-630W' },
        { kw: 5,  dcr: '₹2,02,000', dcrStrike: '₹2,80,000', ndcr: '₹2,25,000', savings: '₹6K - ₹7K',       gen: '600-720 Units/Mo', daily: '20-24 Units/Day',  area: '276 SqFt', dim: '12×23 Ft',  panels: '9 Panels',     watt: '540-630W' },
        { kw: 6,  dcr: '₹2,52,000', dcrStrike: '₹3,30,000', ndcr: '₹2,50,000', savings: '₹7K - ₹8K',       gen: '720-840 Units/Mo', daily: '24-28 Units/Day',  area: '368 SqFt', dim: '16×23 Ft',  panels: '11 Panels',    watt: '540-630W' },
        { kw: 7,  dcr: '₹2,92,000', dcrStrike: '₹3,70,000', ndcr: '₹2,85,000', savings: '₹8K - ₹9K',       gen: '840-960 Units/Mo', daily: '28-32 Units/Day',  area: '460 SqFt', dim: '20×23 Ft',  panels: '13 Panels',    watt: '540-630W' },
        { kw: 8,  dcr: '₹3,42,000', dcrStrike: '₹4,20,000', ndcr: '₹3,20,000', savings: '₹9K - ₹10K',      gen: '960-1080 Units/Mo',daily: '32-36 Units/Day',  area: '480 SqFt', dim: '16×30 Ft',  panels: '15 Panels',    watt: '540-630W' },
        { kw: 9,  dcr: '₹3,82,000', dcrStrike: '₹4,60,000', ndcr: '₹3,50,000', savings: '₹10K - ₹12K',     gen: '1080-1200 Units/Mo',daily:'36-40 Units/Day',  area: '480 SqFt', dim: '16×30 Ft',  panels: '16-17 Panels', watt: '540-630W' },
        { kw: 10, dcr: '₹3,80,000', dcrStrike: '₹5,10,000', ndcr: '₹3,80,000', savings: '₹11K - ₹13K',     gen: '1200-1320 Units/Mo',daily:'40-44 Units/Day',  area: '600 SqFt', dim: '20×30 Ft',  panels: '17-18 Panels', watt: '540-630W' },
        { kw: 11, dcr: 'N/A',        dcrStrike: '',           ndcr: '₹4,20,000', savings: '₹12K - ₹13K',     gen: '1320-1440 Units/Mo',daily:'44-48 Units/Day',  area: '600 SqFt', dim: '20×30 Ft',  panels: '20 Panels',    watt: '540-630W' },
        { kw: 12, dcr: 'N/A',        dcrStrike: '',           ndcr: '₹4,50,000', savings: '₹13K - ₹15K',     gen: '1440-1560 Units/Mo',daily:'48-52 Units/Day',  area: '720 SqFt', dim: '24×30 Ft',  panels: '22 Panels',    watt: '540-630W' },
        { kw: 15, dcr: 'N/A',        dcrStrike: '',           ndcr: '₹5,10,000', savings: '₹15K - ₹18K',     gen: '1800-1950 Units/Mo',daily:'60-65 Units/Day',  area: '912 SqFt', dim: '24×38 Ft',  panels: '28 Panels',    watt: '540-630W' }
    ];

    // --- Update Slider Fill ---
    function updateSliderBackground(slider) {
        const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, #ffb703 0%, #ffb703 ${pct}%, #e9ecef ${pct}%, #e9ecef 100%)`;
    }

    // --- Update Pricing Card & Receipt ---
    function updatePricingCard(index) {
        const d = pricingData[index];
        const grid = document.querySelector('.results-grid-new');

        if (currentKwEl) currentKwEl.textContent = `${d.kw} KW`;
        if (grid) grid.style.opacity = '0.4';

        setTimeout(() => {
            if (valDcr) {
                if (d.dcr === 'N/A') {
                    valDcr.textContent = 'Not Eligible';
                    if (valDcrStrike) valDcrStrike.innerHTML = '<span style="font-size:10px;color:#e74c3c">No Subsidy Above 10KW</span>';
                } else {
                    valDcr.textContent = d.dcr;
                    if (valDcrStrike) valDcrStrike.innerHTML = `<del>${d.dcrStrike}</del>`;
                }
            }
            if (valNdcr)    valNdcr.textContent    = d.ndcr;
            if (valSavings) valSavings.textContent  = d.savings;
            if (valGen)     valGen.textContent      = d.gen;
            if (valDaily)   valDaily.textContent    = d.daily;
            if (valArea)    valArea.textContent      = d.area + ' Area';
            if (valDim)     valDim.textContent       = d.dim + ' Required';
            if (valPanels)  valPanels.textContent    = d.panels;
            if (valWatt)    valWatt.textContent      = d.watt + ' Panel';
            if (grid) grid.style.opacity = '1';

            // Live-update the receipt content
            const now = new Date();
            if (receiptDate) receiptDate.textContent = `Date: ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;

            if (receiptDetails) {
                receiptDetails.innerHTML = `
                    <table>
                        <tr><td>System Size:</td><td>${d.kw} KW</td></tr>
                        <tr><td>Solar Panels:</td><td>${d.panels}</td></tr>
                        <tr><td>Panel Spec:</td><td>${d.watt}</td></tr>
                        <tr><td>Gen (Monthly):</td><td>${d.gen}</td></tr>
                        <tr><td>Gen (Daily):</td><td>${d.daily}</td></tr>
                        <tr><td>Roof Space:</td><td>${d.area} (${d.dim})</td></tr>
                        <tr style="border-top:1px dashed #ccc;">
                            <td style="padding-top:6px; font-weight:700;">Standard Price:</td>
                            <td style="padding-top:6px;">${d.ndcr}</td>
                        </tr>
                        <tr style="color:#27ae60; font-weight:900;">
                            <td>Subsidized Price:</td>
                            <td>${d.dcr === 'N/A' ? '<span style="color:#e74c3c">N/A</span>' : d.dcr}</td>
                        </tr>
                        <tr style="border-top:1px dashed #ccc;">
                            <td style="padding-top:6px;">Est. Savings:</td>
                            <td style="padding-top:6px; font-weight:800;">${d.savings}</td>
                        </tr>
                    </table>
                `;
            }
        }, 150);
    }

    // --- Slider ---
    kwSlider.addEventListener('input', (e) => {
        updateSliderBackground(e.target);
        updatePricingCard(parseInt(e.target.value));
    });

    // Init
    updateSliderBackground(kwSlider);
    updatePricingCard(0);

    // --- GET DETAILED QUOTE ---
    const getQuoteBtn = document.querySelector('.get-quote-btn-new');
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const mainCard = document.querySelector('.calculator-main-card');
            if (!mainCard || !pricingReceipt) return;

            // Slide card left, and slide out the receipt
            mainCard.classList.add('slide-left');
            pricingReceipt.classList.add('slide-left');
        });
    }
}
