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

// Form Submission Handlers
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

    // --- FORM DATA SERIALIZATION & TRANSMISSION ---
    const data = {
        Timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        Category: formCategory,
        Name: '', Email: '', WhatsApp: '', Pincode: '', HousingSociety: '', CompanyName: '', City: '', Designation: '', AverageMonthlyBill: ''
    };

    const inputs = formContainer.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'radio' && !input.checked) return;
        
        const val = input.value.trim();
        if (!val) return;

        if (input.name === 'name' || input.name === 'full_name') data.Name = val;
        else if (input.name === 'email') data.Email = val;
        else if (input.name === 'whatsapp') data.WhatsApp = val;
        else if (input.name === 'pincode') data.Pincode = val;
        else if (input.name === 'society_name') data.HousingSociety = val;
        else if (input.name === 'company_name') data.CompanyName = val;
        else if (input.name === 'city') data.City = val;
        else if (input.name.includes('monthly_bill')) data.AverageMonthlyBill = val;
        else if (input.name === 'designation_housing') data.Designation = val;
    });

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
        const scriptURL = '/api/submit-form';
        
        const params = new URLSearchParams();
        for (const key in data) {
            params.append(key, data[key]);
        }

        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        if (!response.ok) {
            let errorMsg = `Server returned status: ${response.status}`;
            try {
                const errData = await response.json();
                if (errData.message) errorMsg = errData.message;
            } catch (e) { }
            throw new Error(errorMsg);
        }

        // --- BEAUTIFUL SUCCESS MESSAGE ---
        let msgDiv = form.querySelector('.form-submit-message');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.className = 'form-submit-message';
            // Styling for a premium, highly visible success alert
            msgDiv.style.marginTop = '15px';
            msgDiv.style.marginBottom = '15px';
            msgDiv.style.padding = '16px';
            msgDiv.style.borderRadius = '12px';
            msgDiv.style.textAlign = 'center';
            msgDiv.style.fontWeight = '600';
            msgDiv.style.fontSize = '1.1rem';
            msgDiv.style.boxShadow = '0 4px 15px rgba(52, 211, 153, 0.2)';
            msgDiv.style.display = 'flex';
            msgDiv.style.alignItems = 'center';
            msgDiv.style.justifyContent = 'center';
            msgDiv.style.gap = '10px';
            msgDiv.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            msgDiv.style.transform = 'translateY(10px)';
            msgDiv.style.opacity = '0';
            
            // Insert the message right BEFORE the submit button so it's easily seen
            if (submitBtn) {
                submitBtn.parentNode.insertBefore(msgDiv, submitBtn);
            } else {
                form.appendChild(msgDiv);
            }
        }
        
        // Animated icon and text
        msgDiv.innerHTML = `<i class='bx bxs-check-circle' style='font-size: 1.5rem;'></i> <span>Done! Your details have been submitted.</span>`;
        msgDiv.style.backgroundColor = '#ecfdf5';
        msgDiv.style.color = '#065f46';
        msgDiv.style.border = '2px solid #34d399';
        msgDiv.style.display = 'flex';
        
        // Trigger animation
        requestAnimationFrame(() => {
            msgDiv.style.transform = 'translateY(0)';
            msgDiv.style.opacity = '1';
        });

        // Hide after 5 seconds
        setTimeout(() => {
            msgDiv.style.transform = 'translateY(-10px)';
            msgDiv.style.opacity = '0';
            setTimeout(() => { msgDiv.style.display = 'none'; }, 400);
        }, 5000);
        
        // Update submit button to show success
        if (submitBtn) {
            if (buttonTextSpan) buttonTextSpan.textContent = "Done! ✅";
            else submitBtn.textContent = "Done! ✅";
            submitBtn.style.backgroundColor = "#10b981"; // Emerald green
            submitBtn.style.color = "#ffffff";
            submitBtn.style.borderColor = "#10b981";
            submitBtn.style.transform = "scale(1.02)";
        }

        if (typeof closeQuickModal === 'function') {
            setTimeout(closeQuickModal, 2500); // Close modal automatically after 2.5s
        }
        
        // Reset form fields
        setTimeout(() => {
            form.reset();
            const activeRadioPills = form.querySelectorAll('.radio-pill-group');
            activeRadioPills.forEach(group => {
                const firstInput = group.querySelector('input[type="radio"]');
                if (firstInput) firstInput.checked = true;
            });
            // Revert button styling
            if (submitBtn) {
                if (buttonTextSpan) buttonTextSpan.textContent = originalText;
                else submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = "";
                submitBtn.style.color = "";
                submitBtn.style.borderColor = "";
                submitBtn.style.transform = "";
                submitBtn.disabled = false;
            }
        }, 3000);

    } catch (error) {
        console.error("Form submission failed:", error);
        
        let msgDiv = form.querySelector('.form-submit-message');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.className = 'form-submit-message';
            msgDiv.style.marginTop = '15px';
            msgDiv.style.marginBottom = '15px';
            msgDiv.style.padding = '16px';
            msgDiv.style.borderRadius = '12px';
            msgDiv.style.textAlign = 'center';
            msgDiv.style.fontWeight = '600';
            msgDiv.style.fontSize = '1.1rem';
            msgDiv.style.transition = 'all 0.4s ease';
            msgDiv.style.opacity = '0';
            
            if (submitBtn) {
                submitBtn.parentNode.insertBefore(msgDiv, submitBtn);
            } else {
                form.appendChild(msgDiv);
            }
        }
        
        let displayError = error.message;
        if (!displayError || displayError.includes('Failed to fetch')) {
            displayError = 'Connection Error. Please try again.';
        }
        
        msgDiv.innerHTML = `<i class='bx bxs-error-circle' style='font-size: 1.5rem;'></i> <span>${displayError}</span>`;
        msgDiv.style.backgroundColor = '#fef2f2';
        msgDiv.style.color = '#991b1b';
        msgDiv.style.border = '2px solid #f87171';
        msgDiv.style.display = 'flex';
        msgDiv.style.alignItems = 'center';
        msgDiv.style.justifyContent = 'center';
        msgDiv.style.gap = '10px';
        
        requestAnimationFrame(() => {
            msgDiv.style.opacity = '1';
        });

        setTimeout(() => {
            msgDiv.style.opacity = '0';
            setTimeout(() => { msgDiv.style.display = 'none'; }, 400);
        }, 5000);

        if (submitBtn) {
            submitBtn.disabled = false;
            if (buttonTextSpan) buttonTextSpan.textContent = originalText;
            else submitBtn.textContent = originalText;
        }
    } finally {
        if (submitBtn && spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
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

let bodyScrollPosition = 0;

const lockBodyScroll = () => {
    bodyScrollPosition = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${bodyScrollPosition}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
};

const unlockBodyScroll = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    window.scrollTo(0, bodyScrollPosition);
};

const openQuickModal = () => {
    overlay.classList.add('active');
    lockBodyScroll();
};

const closeQuickModal = () => {
    if (overlay && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        unlockBodyScroll();
    }
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

// Click outside overlay disabled to trap user activity inside the popup

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
        // Block scroll intercept for 850ms so a trackpad click-scroll can't override the selection
        isAnimating = true;
        setTimeout(() => { isAnimating = false; }, 850);
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
        e.preventDefault();
        if (diff > 0 && index < imgItems.length - 1) {
            if (!isAnimating) {
                stopAutoplay();
                isAnimating = true;
                index++;
                slider();
                setTimeout(() => { isAnimating = false; }, 850);
            }
        } else if (diff < 0 && index > 0) {
            if (!isAnimating) {
                stopAutoplay();
                isAnimating = true;
                index--;
                slider();
                setTimeout(() => { isAnimating = false; }, 850);
            }
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
                const inputs = section.querySelectorAll('input, select, textarea');
                inputs.forEach(input => input.disabled = true);
            });
            const targetSection = document.getElementById('form-' + target);
            if (targetSection) {
                targetSection.classList.add('active');
                const inputs = targetSection.querySelectorAll('input, select, textarea');
                inputs.forEach(input => input.disabled = false);
            }
        });
    });

    // Initialize form inputs disabled state based on active section
    document.querySelectorAll('.contact-form-wrapper, .quick-modal-content').forEach(wrapper => {
        const sections = wrapper.querySelectorAll('.form-group-section');
        sections.forEach(section => {
            const isActive = section.classList.contains('active');
            const inputs = section.querySelectorAll('input, select, textarea');
            inputs.forEach(input => input.disabled = !isActive);
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
    { kw: 3,  dcr: '₹78,000', dcrStrike: '₹1,90,000', ndcr: '₹1,70,000', savings: '₹3,600 - ₹4,800', gen: '360-480 Units/Mo', daily: '12-16 Units/Day',  area: '180 SqFt', dim: '12×15 Ft',  panels: '6 Panels',     watt: '580-680W TOPCon' },
    { kw: 4,  dcr: '₹78,000', dcrStrike: '₹2,30,000', ndcr: '₹1,90,000', savings: '₹4K - ₹5K',       gen: '480-600 Units/Mo', daily: '16-20 Units/Day',  area: '240 SqFt', dim: '16×15 Ft',  panels: '7 Panels',     watt: '580-680W TOPCon' },
    { kw: 5,  dcr: '₹78,000', dcrStrike: '₹2,80,000', ndcr: '₹2,25,000', savings: '₹6K - ₹7K',       gen: '600-720 Units/Mo', daily: '20-24 Units/Day',  area: '276 SqFt', dim: '12×23 Ft',  panels: '9 Panels',     watt: '580-680W TOPCon' },
    { kw: 6,  dcr: '₹78,000', dcrStrike: '₹3,30,000', ndcr: '₹2,50,000', savings: '₹7K - ₹8K',       gen: '720-840 Units/Mo', daily: '24-28 Units/Day',  area: '368 SqFt', dim: '16×23 Ft',  panels: '11 Panels',    watt: '580-680W TOPCon' },
    { kw: 7,  dcr: '₹78,000', dcrStrike: '₹3,70,000', ndcr: '₹2,85,000', savings: '₹8K - ₹9K',       gen: '840-960 Units/Mo', daily: '28-32 Units/Day',  area: '460 SqFt', dim: '20×23 Ft',  panels: '13 Panels',    watt: '580-680W TOPCon' },
    { kw: 8,  dcr: '₹78,000', dcrStrike: '₹4,20,000', ndcr: '₹3,20,000', savings: '₹9K - ₹10K',      gen: '960-1080 Units/Mo',daily: '32-36 Units/Day',  area: '480 SqFt', dim: '16×30 Ft',  panels: '15 Panels',    watt: '580-680W TOPCon' },
    { kw: 9,  dcr: '₹78,000', dcrStrike: '₹4,60,000', ndcr: '₹3,50,000', savings: '₹10K - ₹12K',     gen: '1080-1200 Units/Mo',daily:'36-40 Units/Day',  area: '480 SqFt', dim: '16×30 Ft',  panels: '16-17 Panels', watt: '580-680W TOPCon' },
    { kw: 10, dcr: '₹78,000', dcrStrike: '₹5,10,000', ndcr: '₹3,80,000', savings: '₹11K - ₹13K',     gen: '1200-1320 Units/Mo',daily:'40-44 Units/Day',  area: '600 SqFt', dim: '20×30 Ft',  panels: '17-18 Panels', watt: '580-680W TOPCon' },
    { kw: 11, dcr: '₹78,000', dcrStrike: '',           ndcr: '₹4,20,000', savings: '₹12K - ₹13K',     gen: '1320-1440 Units/Mo',daily:'44-48 Units/Day',  area: '600 SqFt', dim: '20×30 Ft',  panels: '20 Panels',    watt: '580-680W TOPCon' },
    { kw: 12, dcr: '₹78,000', dcrStrike: '',           ndcr: '₹4,50,000', savings: '₹13K - ₹15K',     gen: '1440-1560 Units/Mo',daily:'48-52 Units/Day',  area: '720 SqFt', dim: '24×30 Ft',  panels: '22 Panels',    watt: '580-680W TOPCon' },
    { kw: 15, dcr: '₹78,000', dcrStrike: '',           ndcr: '₹5,10,000', savings: '₹15K - ₹18K',     gen: '1800-1950 Units/Mo',daily:'60-65 Units/Day',  area: '912 SqFt', dim: '24×38 Ft',  panels: '28 Panels',    watt: '580-680W TOPCon' }
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
                addRow('Standard Price:', d.ndcr + ' (Approx.)', true, false, false, true);
                if (d.dcr === 'N/A') {
                    addRow('Subsidized Price:', 'N/A', false, false, true, false);
                } else {
                    addRow('Subsidized Price:', d.dcr + ' (Approx.)', false, true, false, false);
                }
                addRow('Est. Savings/Mo:', d.savings + ' (Approx.)', true, false, false, true);
                
                receiptDetails.appendChild(table);
            }
        }, 150);
    }

    // --- Slider End Labels Highlight ---
    const rangeLabels = document.querySelector('.range-labels');
    const updateRangeEnds = (val) => {
        if (!rangeLabels) return;
        const v = parseInt(val);
        const spans = rangeLabels.querySelectorAll('span');
        if (spans.length >= 2) {
            spans[0].classList.toggle('range-end-active', v === 0);
            spans[1].classList.toggle('range-end-active', v === 10);
        }
    };

    kwSlider.addEventListener('input', (e) => {
        updateSliderBackground(e.target);
        updatePricingCard(parseInt(e.target.value));
        updateRangeEnds(e.target.value);
    });

    // Init — default 6 KW (index 3)
    kwSlider.value = 3;
    updateSliderBackground(kwSlider);
    updatePricingCard(3);
    updateRangeEnds(3);

    // --- GET DETAILED QUOTE ---
    const getQuoteBtn = document.querySelector('.get-quote-btn-new');
    if (getQuoteBtn) {
        console.log("BUTTON FOUND");
        getQuoteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("BUTTON CLICKED");

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
    lockBodyScroll();

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
    unlockBodyScroll();
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

// Click outside overlay disabled to trap user activity inside the popup

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
    const subsidyLabels = subsidySlider.closest('.calc-input-group')?.querySelector('.range-labels');
    const updateSubsidyEnds = (val) => {
        if (!subsidyLabels) return;
        const v = parseInt(val);
        const spans = subsidyLabels.querySelectorAll('span');
        if (spans.length >= 2) {
            spans[0].classList.toggle('range-end-active', v === 0);
            spans[1].classList.toggle('range-end-active', v === 10);
        }
    };
    subsidySlider.value = 3;
    subsidySlider.addEventListener('input', (e) => {
        updateSliderBackground(e.target);
        updateSubsidyCalculator();
        updateSubsidyEnds(e.target.value);
    });
    updateSliderBackground(subsidySlider);
    updateSubsidyCalculator();
    updateSubsidyEnds(3);
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


// Hero Background Video Autoplay and Setup
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('hero-video');

    if (heroVideo) {
        // Prevent right-click context menu on video
        heroVideo.addEventListener('contextmenu', e => e.preventDefault());

        // List of possible relative and absolute paths for the video
        const videoPaths = [
            'video/hero.mp4',
            '/video/hero.mp4',
            'public/video/hero.mp4',
            'frontend/public/video/hero.mp4',
            'dist/video/hero.mp4',
            '../video/hero.mp4'
        ];
        let currentPathIndex = 0;
        let videoLoaded = false;

        const tryNextPath = () => {
            if (videoLoaded) return;
            if (currentPathIndex < videoPaths.length) {
                const path = videoPaths[currentPathIndex];
                console.log(`Testing hero video path: ${path}`);
                currentPathIndex++;
                
                // Set the src attribute and trigger load
                heroVideo.src = path;
                heroVideo.load();
            } else {
                console.error('All fallback video paths failed to load. Please check the video file configuration.');
            }
        };

        // Try next path if the current one triggers an error
        heroVideo.addEventListener('error', () => {
            console.warn(`Video path failed: ${heroVideo.src}`);
            tryNextPath();
        });

        // Mark as loaded when the browser has successfully pre-resolved the source
        heroVideo.addEventListener('loadedmetadata', () => {
            videoLoaded = true;
            console.log(`Successfully resolved hero video at: ${heroVideo.src}`);
            forcePlay();
        });

        // Fail-safe to force play (bypasses some browser restrictions)
        const forcePlay = () => {
            if (heroVideo.paused) {
                heroVideo.play().then(() => {
                    console.log('Hero video playback started successfully.');
                }).catch(err => {
                    console.warn('Autoplay blocked by browser. Awaiting user interaction:', err);
                });
            }
        };

        // Start testing the video paths
        tryNextPath();

        // If blocked, play on first user interaction
        document.addEventListener('click', forcePlay, { once: true });
        document.addEventListener('touchstart', forcePlay, { once: true });
    }
});

// --- Pincode API Verification & WhatsApp formatting ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. WhatsApp Input Validation (digits only, max 10)
    document.querySelectorAll('input[name="whatsapp"]').forEach(input => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            e.target.value = val.replace(/[^\d]/g, '').slice(0, 10);
        });
    });

    // 2. Pincode API Auto-Verification
    document.querySelectorAll('input[name="pincode"]').forEach(input => {
        let infoSpan = input.parentNode.querySelector('.pincode-info');
        if (!infoSpan) {
            infoSpan = document.createElement('span');
            infoSpan.className = 'pincode-info';
            infoSpan.style.fontSize = '0.85rem';
            infoSpan.style.marginTop = '6px';
            infoSpan.style.display = 'block';
            infoSpan.style.fontWeight = '500';
            input.parentNode.appendChild(infoSpan);
        }

        input.addEventListener('input', async (e) => {
            const val = e.target.value.trim();
            e.target.value = val.replace(/[^\d]/g, '').slice(0, 6); // force 6 digits only
            const pincode = e.target.value;
            
            if (pincode.length === 6) {
                infoSpan.style.color = '#6b7280';
                infoSpan.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Verifying area...';
                input.setCustomValidity('Verifying...');
                
                try {
                    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                    const data = await res.json();
                    if (data && data[0] && data[0].Status === 'Success') {
                        const postOffice = data[0].PostOffice[0];
                        const areaName = postOffice.District; // Use short form (e.g. 'Indore')
                        infoSpan.style.color = '#10b981';
                        infoSpan.innerHTML = `<i class='bx bxs-check-circle'></i> ${areaName}`;
                        input.setCustomValidity(''); // Mark as valid
                        
                        // Auto-fill City field, or create a hidden one if it doesn't exist
                        const formSection = input.closest('.form-group-section') || input.closest('form');
                        if (formSection) {
                            let cityInput = formSection.querySelector('input[name="city"]');
                            if (!cityInput) {
                                cityInput = document.createElement('input');
                                cityInput.type = 'hidden';
                                cityInput.name = 'city';
                                formSection.appendChild(cityInput);
                            }
                            cityInput.value = postOffice.District;
                        }
                    } else {
                        infoSpan.style.color = '#ef4444';
                        infoSpan.innerHTML = `<i class='bx bxs-error-circle'></i> Invalid PIN code`;
                        input.setCustomValidity('Invalid Indian PIN code');
                    }
                } catch (err) {
                    infoSpan.textContent = '';
                    input.setCustomValidity('');
                }
            } else {
                infoSpan.textContent = '';
                input.setCustomValidity(''); // Reset custom validity if less than 6 digits (HTML5 pattern="\d{6}" handles the required 6 length)
            }
        });
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(el => {
            if (el !== item) {
                el.classList.remove('active');
                el.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            }
        });
        if (isActive) {
            item.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        } else {
            item.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

