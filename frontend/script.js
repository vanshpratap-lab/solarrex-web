const imgSlider = document.querySelector('.img-slider');
const imgItems = document.querySelectorAll('.img-item');
const infoItems = document.querySelectorAll('.info-item');
const navItems = document.querySelectorAll('.nav-item');
const solutionsSection = document.querySelector('.solutions');
const navbar = document.querySelector('.navbar');

// Logo click → smooth scroll to top with pulse animation
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
    navLogo.style.cursor = 'pointer';
    navLogo.addEventListener('click', () => {
        // Flash pulse effect on logo
        navLogo.classList.add('logo-pulse');
        setTimeout(() => navLogo.classList.remove('logo-pulse'), 600);

        // Smooth scroll to very top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Header nav links & CTA → smooth scroll to sections
document.querySelectorAll('.header-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.target;
        if (target === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const section = document.getElementById(target);
            if (section) {
                const offset = 80; // account for fixed navbar height
                const top = section.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
        
        // Close mobile menu if active
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Footer nav links → smooth scroll to sections
document.querySelectorAll('.footer-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.target;
        if (target === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const section = document.getElementById(target);
            if (section) {
                const offset = 80; // account for fixed navbar height
                const top = section.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    });
});

// ── Secure Phone Dialer ──────────────────────────────────────────────────────
// The number is never stored as plain text; it is reconstructed at runtime.
// Only activates on touch-capable devices (phones, tablets) where calling is possible.
// Nothing is stored in the DOM — number is assembled in memory only on click.
(function () {
    // Obfuscated segments — split, reversed, rejoined at call-time only
    const _s = ['\x39', '\x31', '\x30', '\x39', '\x39', '\x32', '\x33', '\x30', '\x30', '\x31'];
    const _p = '\x39\x31'; // country code digits (no +)

    const isTouchDevice = () =>
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0) ||
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    const dial = () => {
        if (!isTouchDevice()) return; // desktop: do nothing
        const num = '\x74\x65\x6c\x3a\x2b' + _p + _s.join('');
        const a = document.createElement('a');
        a.href = num;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 500);
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.secure-phone-trigger').forEach(el => {
            el.addEventListener('click', (e) => { e.preventDefault(); dial(); });
            el.addEventListener('touchend', (e) => { e.preventDefault(); dial(); });
        });
    });
})();
// ────────────────────────────────────────────────────────────────────────────

let index = 0;
let isAnimating = false;

// Custom Terminal-themed Alert UI Controller
const terminalAlert = document.getElementById('terminal-alert');
const terminalMessage = document.getElementById('terminal-error-message');
const terminalCloseDot = document.getElementById('terminal-close-dot');
const terminalOkBtn = document.getElementById('terminal-ok-btn');
const terminalTitle = terminalAlert ? terminalAlert.querySelector('.terminal-title') : null;
const terminalErrorLabel = terminalAlert ? terminalAlert.querySelector('.terminal-error-label') : null;
const terminalBoxEl = terminalAlert ? terminalAlert.querySelector('.terminal-box') : null;

let terminalAutoCloseTimeout = null;

const showTerminalAlert = (messages, isSuccess = false) => {
    if (!terminalAlert || !terminalMessage) return;

    // Clear any active timeouts
    if (terminalAutoCloseTimeout) clearTimeout(terminalAutoCloseTimeout);

    const escapeHTML = (str) => {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    // Format content as rows
    if (Array.isArray(messages)) {
        terminalMessage.innerHTML = messages.map(msg => `• ${escapeHTML(msg)}`).join('\n');
    } else {
        terminalMessage.innerHTML = escapeHTML(messages);
    }

    // Toggle Styles/Text based on Success or Error state
    if (isSuccess) {
        if (terminalTitle) terminalTitle.textContent = 'success_notification.sh';
        if (terminalErrorLabel) {
            terminalErrorLabel.textContent = '[SUCCESS] DATA TRANSMISSION COMPLETE';
            terminalErrorLabel.style.color = '#27c93f';
        }
        if (terminalBoxEl) {
            terminalBoxEl.style.borderColor = 'rgba(39, 201, 63, 0.5)';
            terminalBoxEl.style.boxShadow = '0 30px 70px rgba(0, 0, 0, 0.6), 0 0 40px rgba(39, 201, 63, 0.15)';
        }
        if (terminalOkBtn) {
            terminalOkBtn.textContent = 'CONFIRM & CLOSE';
            terminalOkBtn.style.color = '#27c93f';
            terminalOkBtn.style.borderColor = '#27c93f';
            // Hover styling dynamically managed by classes or css
        }
    } else {
        if (terminalTitle) terminalTitle.textContent = 'system_validation.sh';
        if (terminalErrorLabel) {
            terminalErrorLabel.textContent = '[ERROR] VALIDATION LAYER FAILED';
            terminalErrorLabel.style.color = '#ef4444';
        }
        if (terminalBoxEl) {
            terminalBoxEl.style.borderColor = 'rgba(0, 168, 255, 0.35)';
            terminalBoxEl.style.boxShadow = '0 30px 70px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 168, 255, 0.1)';
        }
        if (terminalOkBtn) {
            terminalOkBtn.textContent = 'EXECUTE RESOLUTION';
            terminalOkBtn.style.color = '#00a8ff';
            terminalOkBtn.style.borderColor = '#00a8ff';
        }
    }

    // Open Modal
    terminalAlert.classList.add('active');

    // Auto-close after 6 seconds
    terminalAutoCloseTimeout = setTimeout(closeTerminalAlert, 6000);
};

const closeTerminalAlert = () => {
    if (terminalAlert) terminalAlert.classList.remove('active');
    if (terminalAutoCloseTimeout) clearTimeout(terminalAutoCloseTimeout);
};

if (terminalCloseDot) terminalCloseDot.addEventListener('click', closeTerminalAlert);
if (terminalOkBtn) terminalOkBtn.addEventListener('click', closeTerminalAlert);

// Form Submission Handlers with 5 Layers of Validation
const modalForm = document.querySelector('.modal-form');
const miniForm = document.querySelector('.mini-form');
const mainForm = document.querySelector('.main-contact-form');

const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Determine category based on active section within main or modal form
    let formCategory = 'Mini Form';
    let formContainer = form;
    
    if (form.classList.contains('main-contact-form') || form.classList.contains('modal-form')) {
        const activeSection = form.querySelector('.form-group-section.active');
        if (activeSection) {
            formContainer = activeSection;
            if (activeSection.id.includes('residential')) {
                formCategory = 'Residential';
            } else if (activeSection.id.includes('housing')) {
                formCategory = 'Housing Society';
            } else if (activeSection.id.includes('commercial')) {
                formCategory = 'Commercial';
            }
        }
    }

    // --- 5 LAYERS OF VALIDATION CHECKS ---
    const errors = [];
    
    // Find all inputs within the active container block (to ignore inputs in inactive tab sheets)
    const inputs = formContainer.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        const val = input.value.trim();
        const labelEl = input.closest('.input-group, .mini-input-group')?.querySelector('label');
        const fieldName = labelEl ? labelEl.textContent.replace('*', '').trim() : input.placeholder || 'Field';

        // Layer 1: Completeness Check (Required fields must not be empty)
        if (input.hasAttribute('required') && !val) {
            errors.push(`${fieldName} is required.`);
            return;
        }

        if (val) {
            // Layer 2: Name Validation (Min 3 chars, letters and spaces only)
            if (input.name === 'name' || input.name === 'full_name') {
                if (val.length < 3) {
                    errors.push(`${fieldName} must be at least 3 characters long.`);
                } else if (!/^[a-zA-Z\s]+$/.test(val)) {
                    errors.push(`${fieldName} must contain only letters and spaces.`);
                }
            }

            // Layer 3: WhatsApp/Phone number (exactly 10 digits, numeric)
            if (input.name === 'whatsapp') {
                const cleanedPhone = val.replace(/\D/g, '');
                if (cleanedPhone.length !== 10) {
                    errors.push(`${fieldName} must be exactly 10 digits.`);
                }
            }

            // Layer 4: Pin Code (exactly 6 digits, numeric)
            if (input.name === 'pincode') {
                const cleanedPin = val.replace(/\D/g, '');
                if (cleanedPin.length !== 6) {
                    errors.push(`${fieldName} must be exactly 6 digits.`);
                }
            }

            // Layer 5: Email Syntax (Common email regex)
            if (input.type === 'email' || input.name === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(val)) {
                    errors.push(`Please enter a valid email address.`);
                }
            }
        }
    });

    // If there are validation failures, trigger the custom terminal alert modal
    if (errors.length > 0) {
        showTerminalAlert(errors, false);
        return;
    }

    // --- FORM DATA SERIALIZATION & TRANSMISSION ---
    const formData = new FormData(form);
    
    let rawBill = formData.get('monthly_bill_res') || 
                  formData.get('modal_bill_res') || 
                  formData.get('monthly_bill_housing') || 
                  formData.get('monthly_bill_commercial') || 
                  '';
    
    let formattedBill = rawBill;
    if (rawBill === 'less_2500') formattedBill = 'Less than ₹2500';
    else if (rawBill === '2500_3500') formattedBill = '₹2500 - ₹3500';
    else if (rawBill === '3500_4500') formattedBill = '₹3500 - ₹4500';
    else if (rawBill === '4500_5500') formattedBill = '₹4500 - ₹5500';
    else if (rawBill === 'more_8000') formattedBill = 'More than ₹8000';

    let rawDesignation = formData.get('designation_housing') || '';
    let formattedDesignation = rawDesignation;
    if (rawDesignation === 'committee') formattedDesignation = 'Management committee member';
    else if (rawDesignation === 'resident') formattedDesignation = 'Resident';
    else if (rawDesignation === 'builder') formattedDesignation = 'Builder';
    else if (rawDesignation === 'facility') formattedDesignation = 'Facility Manager';

    // Build the payload
    const data = {
        Timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        Category: formCategory,
        Name: formData.get('name') || formData.get('full_name') || '',
        Email: formData.get('email') || '',
        WhatsApp: formData.get('whatsapp') || '',
        Pincode: formData.get('pincode') || '',
        HousingSociety: formData.get('society_name') || '',
        CompanyName: formData.get('company_name') || '',
        City: formData.get('city') || '',
        Designation: formattedDesignation,
        AverageMonthlyBill: formattedBill
    };

    // Show loading state on submit button
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-submit-contact') || form.querySelector('.modal-submit');
    let spinner = null;
    let buttonTextSpan = null;
    let originalText = '';
    
    if (submitBtn) {
        buttonTextSpan = submitBtn.querySelector('span');
        submitBtn.disabled = true;
        originalText = buttonTextSpan ? buttonTextSpan.textContent : submitBtn.textContent;
        if (buttonTextSpan) {
            buttonTextSpan.textContent = 'Submitting...';
        } else {
            submitBtn.textContent = 'Submitting...';
        }
        spinner = document.createElement('i');
        spinner.className = 'bx bx-loader-alt bx-spin';
        spinner.style.marginLeft = '8px';
        submitBtn.appendChild(spinner);
    }

    try {
        // Post securely to local serverless proxy route `/api/submit-form`
        const response = await fetch('/api/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
            showTerminalAlert("Status: 200 OK\nPayload successfully securely logged to Sheet.\nThank you for reaching out to Solar Rex!", true);
            if (typeof closeQuickModal === 'function') closeQuickModal();
            form.reset();
            const activeRadioPills = form.querySelectorAll('.radio-pill-group');
            activeRadioPills.forEach(group => {
                const firstInput = group.querySelector('input[type="radio"]');
                if (firstInput) firstInput.checked = true;
            });
        } else {
            // Server responded but returned a non-success status
            console.error("Form submission error from server:", result);
            showTerminalAlert([
                "Submission failed — server returned an error.",
                result.message || "Please try again or contact us directly."
            ], false);
        }
    } catch (error) {
        console.error("Form submission failed — network error:", error);
        showTerminalAlert([
            "Network error — could not reach the server.",
            "Please check your internet connection and try again."
        ], false);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            if (buttonTextSpan) {
                buttonTextSpan.textContent = originalText;
            } else {
                submitBtn.textContent = originalText;
            }
            if (spinner && spinner.parentNode) {
                spinner.parentNode.removeChild(spinner);
            }
        }
    }
};

if (modalForm) modalForm.addEventListener('submit', handleFormSubmit);
if (miniForm) miniForm.addEventListener('submit', handleFormSubmit);
if (mainForm) mainForm.addEventListener('submit', handleFormSubmit);

// Modal Interaction Logic
const overlay = document.getElementById('quick-modal-overlay');
const quickConnect = document.getElementById('quick-connect');
const headerTrigger = document.getElementById('quick-header-trigger');
const closeRed = document.getElementById('close-red');
const modalCloseMain = document.getElementById('modal-close-main');

const openQuickModal = () => {
    overlay.classList.add('active');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
};

const closeQuickModal = () => {
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
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

// Close menu when clicking outside of the navbar menu drawer
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && !navMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-active');
        if (navMenuBtn.querySelector('i')) {
            navMenuBtn.querySelector('i').classList.remove('bx-x');
        }
    }
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

// Auto-hide Floating Form when reaching Contact, Pricing, or Operations Sections
const contactSection = document.querySelector('.section-contact');
const pricingSection = document.querySelector('.section-pricing');
const operationsSection = document.querySelector('.section-operations');
const floatingPopup = document.getElementById('quick-connect');

if (floatingPopup) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target === contactSection) {
                if (entry.isIntersecting) {
                    floatingPopup.classList.add('hide-popup-contact');
                } else {
                    floatingPopup.classList.remove('hide-popup-contact');
                }
            } else if (entry.target === pricingSection) {
                if (entry.isIntersecting) {
                    floatingPopup.classList.add('hide-popup-pricing');
                } else {
                    floatingPopup.classList.remove('hide-popup-pricing');
                }
            } else if (entry.target === operationsSection) {
                if (entry.isIntersecting) {
                    floatingPopup.classList.add('hide-popup-operations');
                } else {
                    floatingPopup.classList.remove('hide-popup-operations');
                }
            }
        });
    }, {
        threshold: 0.15 // Triggers when 15% of the section is visible
    });

    if (contactSection) observer.observe(contactSection);
    if (pricingSection) observer.observe(pricingSection);
    if (operationsSection) observer.observe(operationsSection);

    // Auto-hide on Hero section (top of the page) for mobile/tablet to avoid overlapping badges
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    floatingPopup.classList.add('hide-on-hero');
                } else {
                    floatingPopup.classList.remove('hide-on-hero');
                }
            });
        }, {
            threshold: 0.05
        });
        heroObserver.observe(heroSection);
    }
}

// --- Official Pricing Data (from price list) ---
// D = daily units, M = monthly units, P = panels, Area in SqFt, dim = dimensions
const pricingData = [
    { kw: 3,  dcr: '₹78,000', dcrStrike: '₹1,90,000', ndcr: '₹1,70,000', savings: '₹3,600 - ₹4,800', gen: '360-480 Units/Mo', daily: '12-16 Units/Day',  area: '180 SqFt', dim: '12×15 Ft',  panels: '6 Panels',     watt: '540-630W' },
    { kw: 4,  dcr: '₹78,000', dcrStrike: '₹2,30,000', ndcr: '₹1,90,000', savings: '₹4K - ₹5K',       gen: '480-600 Units/Mo', daily: '16-20 Units/Day',  area: '240 SqFt', dim: '16×15 Ft',  panels: '7 Panels',     watt: '540-630W' },
    { kw: 5,  dcr: '₹78,000', dcrStrike: '₹2,80,000', ndcr: '₹2,25,000', savings: '₹6K - ₹7K',       gen: '600-720 Units/Mo', daily: '20-24 Units/Day',  area: '276 SqFt', dim: '12×23 Ft',  panels: '9 Panels',     watt: '540-630W' },
    { kw: 6,  dcr: '₹78,000', dcrStrike: '₹3,30,000', ndcr: '₹2,50,000', savings: '₹7K - ₹8K',       gen: '720-840 Units/Mo', daily: '24-28 Units/Day',  area: '368 SqFt', dim: '16×23 Ft',  panels: '11 Panels',    watt: '540-630W' },
    { kw: 7,  dcr: '₹78,000', dcrStrike: '₹3,70,000', ndcr: '₹2,85,000', savings: '₹8K - ₹9K',       gen: '840-960 Units/Mo', daily: '28-32 Units/Day',  area: '460 SqFt', dim: '20×23 Ft',  panels: '13 Panels',    watt: '540-630W' },
    { kw: 8,  dcr: '₹78,000', dcrStrike: '₹4,20,000', ndcr: '₹3,20,000', savings: '₹9K - ₹10K',      gen: '960-1080 Units/Mo',daily: '32-36 Units/Day',  area: '480 SqFt', dim: '16×30 Ft',  panels: '15 Panels',    watt: '540-630W' },
    { kw: 9,  dcr: '₹78,000', dcrStrike: '₹4,60,000', ndcr: '₹3,50,000', savings: '₹10K - ₹12K',     gen: '1080-1200 Units/Mo',daily:'36-40 Units/Day',  area: '480 SqFt', dim: '16×30 Ft',  panels: '16-17 Panels', watt: '540-630W' },
    { kw: 10, dcr: '₹78,000', dcrStrike: '₹5,10,000', ndcr: '₹3,80,000', savings: '₹11K - ₹13K',     gen: '1200-1320 Units/Mo',daily:'40-44 Units/Day',  area: '600 SqFt', dim: '20×30 Ft',  panels: '17-18 Panels', watt: '540-630W' },
    { kw: 11, dcr: '₹78,000', dcrStrike: '',           ndcr: '₹4,20,000', savings: '₹12K - ₹13K',     gen: '1320-1440 Units/Mo',daily:'44-48 Units/Day',  area: '600 SqFt', dim: '20×30 Ft',  panels: '20 Panels',    watt: '540-630W' },
    { kw: 12, dcr: '₹78,000', dcrStrike: '',           ndcr: '₹4,50,000', savings: '₹13K - ₹15K',     gen: '1440-1560 Units/Mo',daily:'48-52 Units/Day',  area: '720 SqFt', dim: '24×30 Ft',  panels: '22 Panels',    watt: '540-630W' },
    { kw: 15, dcr: '₹78,000', dcrStrike: '',           ndcr: '₹5,10,000', savings: '₹15K - ₹18K',     gen: '1800-1950 Units/Mo',daily:'60-65 Units/Day',  area: '912 SqFt', dim: '24×38 Ft',  panels: '28 Panels',    watt: '540-630W' }
];

// --- Update Slider Fill ---
function updateSliderBackground(slider) {
    if (!slider) return;
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #ffb703 0%, #ffb703 ${pct}%, #e9ecef ${pct}%, #e9ecef 100%)`;
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
                receiptDetails.innerHTML = '';
                const table = document.createElement('table');
                
                const addRow = (label, val, isBold = false, isGreen = false, isRed = false, hasBorderTop = false) => {
                    const tr = document.createElement('tr');
                    if (hasBorderTop) {
                        tr.style.borderTop = '1px dashed #ccc';
                    }
                    if (isGreen) {
                        tr.style.color = '#27ae60';
                        tr.style.fontWeight = '900';
                    }
                    
                    const tdLabel = document.createElement('td');
                    tdLabel.textContent = label;
                    if (hasBorderTop) {
                        tdLabel.style.paddingTop = '6px';
                    }
                    if (isBold && !isGreen) {
                        tdLabel.style.fontWeight = '700';
                    }
                    
                    const tdVal = document.createElement('td');
                    if (hasBorderTop) {
                        tdVal.style.paddingTop = '6px';
                    }
                    if (isBold && !isGreen) {
                        tdVal.style.fontWeight = '800';
                    }
                    
                    if (isRed) {
                        const span = document.createElement('span');
                        span.style.color = '#e74c3c';
                        span.textContent = val;
                        tdVal.appendChild(span);
                    } else {
                        tdVal.textContent = val;
                    }
                    
                    tr.appendChild(tdLabel);
                    tr.appendChild(tdVal);
                    table.appendChild(tr);
                };

                addRow('System Size:', `${d.kw} KW`);
                addRow('Solar Panels:', d.panels.toString());
                addRow('Panel Spec:', d.watt);
                addRow('Gen (Monthly):', d.gen);
                addRow('Gen (Daily):', d.daily);
                addRow('Roof Space:', `${d.area} (${d.dim})`);
                addRow('Standard Price:', d.ndcr, true, false, false, true);
                if (d.dcr === 'N/A') {
                    addRow('Subsidized Price:', 'N/A', false, false, true, false);
                } else {
                    addRow('Subsidized Price:', d.dcr, false, true, false, false);
                }
                addRow('Est. Savings:', d.savings, true, false, false, true);
                
                receiptDetails.appendChild(table);
            }
        }, 150);
    }

    // --- Slider ---
    kwSlider.addEventListener('input', (e) => {
        updateSliderBackground(e.target);
        updatePricingCard(parseInt(e.target.value));
    });

    // Init
    kwSlider.value = 10;
    updateSliderBackground(kwSlider);
    updatePricingCard(10);

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

// --- Solar Info Hub Logic ---
const infoHubOverlay = document.getElementById('info-hub-overlay');
const infoHubContent = document.getElementById('info-hub-content');
const infoHubTitle = document.getElementById('info-hub-title');
const infoHubCloseDot = document.getElementById('info-hub-close-dot');
const infoHubCloseMain = document.getElementById('info-hub-close-main');
const infoHubTriggers = document.querySelectorAll('.info-hub-trigger');
const hubSections = document.querySelectorAll('.hub-section');

// Tab titles
const tabTitles = {
    tech: "Premium Panels: Solar Tech & Hardware",
    savings: "Government Subsidies & DCR Savings",
    roi: "Maximum ROI & Yield Analysis"
};

const openInfoHub = (tabName) => {
    if (!infoHubOverlay) return;

    // Set header title
    if (infoHubTitle && tabTitles[tabName]) {
        infoHubTitle.textContent = tabTitles[tabName];
    }

    // Toggle active section
    hubSections.forEach(section => {
        if (section.id === `hub-section-${tabName}`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Open overlay
    infoHubOverlay.classList.add('active');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Trigger initial calculator updates if opening calculator tabs
    if (tabName === 'savings') {
        if (subsidySlider) updateSliderBackground(subsidySlider);
        updateSubsidyCalculator();
    } else if (tabName === 'roi') {
        if (roiBillInput) updateSliderBackground(roiBillInput);
        if (roiTariffInput) updateSliderBackground(roiTariffInput);
        updateRoiCalculator();
    }
};

const closeInfoHub = () => {
    if (!infoHubOverlay) return;
    infoHubOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
};

// Bind trigger events
infoHubTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = trigger.getAttribute('data-hub-tab');
        openInfoHub(tabName);
    });
});

// Bind close events
if (infoHubCloseDot) infoHubCloseDot.addEventListener('click', closeInfoHub);
if (infoHubCloseMain) infoHubCloseMain.addEventListener('click', closeInfoHub);
if (infoHubOverlay) {
    infoHubOverlay.addEventListener('click', (e) => {
        if (e.target === infoHubOverlay) closeInfoHub();
    });
}

// --- Subsidy Calculator Logic ---
const subsidySlider = document.getElementById('subsidy-kw-slider');
const subsidyKwVal = document.getElementById('subsidy-kw-val');
const calcCost = document.getElementById('calc-cost');
const calcSubsidy = document.getElementById('calc-subsidy');
const calcNet = document.getElementById('calc-net');

const formatINR = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
};

const updateSubsidyCalculator = () => {
    if (!subsidySlider) return;
    const index = parseInt(subsidySlider.value);
    const d = pricingData[index];
    
    // Update label
    if (subsidyKwVal) subsidyKwVal.textContent = `${d.kw} kW`;
    
    // Calculation based on official price list (pricingData)
    let cost = 0;
    let subsidy = 0;
    
    if (d.dcr === 'N/A') {
        cost = parseInt(d.ndcr.replace(/[^0-9]/g, '')) || 0;
        subsidy = 0;
    } else {
        const costStr = d.dcrStrike || d.ndcr;
        cost = parseInt(costStr.replace(/[^0-9]/g, '')) || 0;
        subsidy = parseInt(d.dcr.replace(/[^0-9]/g, '')) || 0;
    }
    const net = cost - subsidy;
    
    // Update texts
    if (calcCost) calcCost.textContent = formatINR(cost);
    if (calcSubsidy) calcSubsidy.textContent = formatINR(subsidy);
    if (calcNet) calcNet.textContent = formatINR(net);
};

if (subsidySlider) {
    subsidySlider.value = 10;
    subsidySlider.addEventListener('input', (e) => {
        updateSliderBackground(e.target);
        updateSubsidyCalculator();
    });
    updateSliderBackground(subsidySlider);
    updateSubsidyCalculator();
}

// --- ROI Calculator Logic ---
const roiBillInput = document.getElementById('roi-bill-input');
const roiBillVal = document.getElementById('roi-bill-val');
const roiTariffInput = document.getElementById('roi-tariff-input');
const roiTariffVal = document.getElementById('roi-tariff-val');
const roiSize = document.getElementById('roi-size');
const roiPayback = document.getElementById('roi-payback');
const roiAnnual = document.getElementById('roi-annual');
const roiLifetime = document.getElementById('roi-lifetime');
const envTrees = document.getElementById('env-trees');
const envCo2 = document.getElementById('env-co2');
const envMiles = document.getElementById('env-miles');

const updateRoiCalculator = () => {
    if (!roiBillInput || !roiTariffInput) return;
    
    const monthlyBill = parseInt(roiBillInput.value);
    const tariff = parseFloat(roiTariffInput.value);
    
    // Update labels
    if (roiBillVal) roiBillVal.textContent = monthlyBill.toLocaleString('en-IN');
    if (roiTariffVal) roiTariffVal.textContent = tariff;
    
    // Calculations
    const monthlyUnits = monthlyBill / tariff;
    const dailyUnits = monthlyUnits / 30;
    
    // Recommended size: 1 kW generates ~4 units/day on average
    let targetSize = dailyUnits / 4;
    if (targetSize < 3) targetSize = 3;
    
    // Find closest size in official pricingData list
    let closestIdx = 0;
    let minDiff = Infinity;
    pricingData.forEach((d, idx) => {
        const diff = Math.abs(d.kw - targetSize);
        if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
        }
    });
    const d = pricingData[closestIdx];
    
    // Update recommended size label
    if (roiSize) roiSize.textContent = `${d.kw} kW`;
    
    // Annual Savings (approx 90% bill reduction)
    const annualSavings = Math.round(monthlyBill * 0.9 * 12);
    if (roiAnnual) roiAnnual.textContent = formatINR(annualSavings);
    
    // Payback Period from pricingData
    let cost = 0;
    let subsidy = 0;
    if (d.dcr === 'N/A') {
        cost = parseInt(d.ndcr.replace(/[^0-9]/g, '')) || 0;
        subsidy = 0;
    } else {
        const costStr = d.dcrStrike || d.ndcr;
        cost = parseInt(costStr.replace(/[^0-9]/g, '')) || 0;
        subsidy = parseInt(d.dcr.replace(/[^0-9]/g, '')) || 0;
    }
    const netInvestment = cost - subsidy;
    const paybackYears = netInvestment / annualSavings;
    if (roiPayback) roiPayback.textContent = `${paybackYears.toFixed(1)} Years`;
    
    // Lifetime Savings (25-Year cumulative savings with 5% tariff inflation/yr)
    let lifetimeSavings = 0;
    let annual = annualSavings;
    for (let i = 0; i < 25; i++) {
        lifetimeSavings += annual;
        annual *= 1.05;
    }
    if (roiLifetime) roiLifetime.textContent = formatINR(Math.round(lifetimeSavings));
    
    // Environmental Impact
    if (envTrees) envTrees.textContent = `${Math.round(d.kw * 19.2)} Trees`;
    if (envCo2) envCo2.textContent = `${(d.kw * 1.2).toFixed(1)} Tons`;
    if (envMiles) envMiles.textContent = `${(d.kw * 3000).toLocaleString('en-IN')} km`;
};

if (roiBillInput) {
    roiBillInput.addEventListener('input', (e) => {
        updateSliderBackground(e.target);
        updateRoiCalculator();
    });
    updateSliderBackground(roiBillInput);
}
if (roiTariffInput) {
    roiTariffInput.addEventListener('input', (e) => {
        updateSliderBackground(e.target);
        updateRoiCalculator();
    });
    updateSliderBackground(roiTariffInput);
}

// Performant Reveal-on-Scroll Observer (animates once to prevent CLS)
const revealElements = document.querySelectorAll('.reveal-on-scroll');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05, // Trigger as soon as 5% of the element enters the viewport
        rootMargin: '0px 0px -50px 0px' // Offset trigger for smoother visual timing
    });
    revealElements.forEach(el => revealObserver.observe(el));
}

// --- Magic Button Premium Click & Page Transition ---
document.addEventListener('DOMContentLoaded', () => {
    const magicButtons = document.querySelectorAll('.magic-button');
    const curtain = document.getElementById('page-curtain');
    
    magicButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Only intercept standard clicks (no Cmd/Ctrl clicks)
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.startsWith('javascript:')) return;
            
            e.preventDefault();
            
            // Cursor coordinates relative to viewport
            const clickX = e.clientX;
            const clickY = e.clientY;
            
            // 1. Spawning Sparkle/Star Explosion Particles
            const particleTypes = ['circle', 'star', 'diamond'];
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
                particle.className = `click-particle ${type}`;
                document.body.appendChild(particle);
                
                // Position at cursor
                particle.style.left = `${clickX}px`;
                particle.style.top = `${clickY}px`;
                
                // Random motion vectors
                const angle = Math.random() * Math.PI * 2;
                const speed = 50 + Math.random() * 100;
                const destX = Math.cos(angle) * speed;
                const destY = Math.sin(angle) * speed;
                const rotate = (Math.random() - 0.5) * 360;
                
                // Web Animations API for smooth hardware-accelerated movement
                const animation = particle.animate([
                    { 
                        transform: `translate(-50%, -50%) rotate(0deg) scale(1) translate(0, 0)`, 
                        opacity: 1 
                    },
                    { 
                        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(0) translate(${destX}px, ${destY}px)`, 
                        opacity: 0 
                    }
                ], {
                    duration: 500 + Math.random() * 400,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
                });
                
                animation.onfinish = () => particle.remove();
            }
            
            // 2. Active Shrink Click Effect on Button
            this.animate([
                { transform: 'scale(1.1) rotate(-4deg)' },
                { transform: 'scale(0.92) rotate(-4deg)' },
                { transform: 'scale(1.1) rotate(-4deg)' }
            ], {
                duration: 200,
                easing: 'ease'
            });
            
            // 3. Circular Expanding Screen Curtain Transition
            if (curtain) {
                curtain.style.left = `${clickX}px`;
                curtain.style.top = `${clickY}px`;
                curtain.classList.add('active');
            }
            
            // 4. Redirect after transition curtain has fully covered screen
            setTimeout(() => {
                window.location.href = href;
            }, 800);
        });
    });
});


// Hero Video: click/tap anywhere on hero to pause & play
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo     = document.getElementById('hero-video');
    const heroTap       = document.getElementById('hero-video-tap');
    const indicator     = document.getElementById('hero-video-indicator');
    const indicatorIcon = document.getElementById('video-indicator-bx');

    if (heroVideo) {
        // Prevent right-click context menu on video
        heroVideo.addEventListener('contextmenu', e => e.preventDefault());
    }

    if (heroTap && heroVideo && indicator && indicatorIcon) {
        let indicatorTimer = null;

        const flashIndicator = (isPaused) => {
            indicatorIcon.className = isPaused ? 'bx bx-play' : 'bx bx-pause';
            indicator.classList.add('show');
            clearTimeout(indicatorTimer);
            indicatorTimer = setTimeout(() => {
                indicator.classList.remove('show');
            }, 1200);
        };

        heroTap.addEventListener('click', () => {
            if (heroVideo.paused) {
                heroVideo.play().catch(() => {});
                flashIndicator(false);
            } else {
                heroVideo.pause();
                flashIndicator(true);
            }
        });
    }
});

