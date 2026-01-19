/* ===================================================
   SOLID SNEKKER & MALINGSERVICE OLAH
   Main JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initScrollAnimations();
    initContactForm();
    initProjectFilters();
});

/* ===================================================
   MOBILE MENU
   =================================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/* ===================================================
   STICKY HEADER
   =================================================== */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ===================================================
   SMOOTH SCROLL
   =================================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================================
   SCROLL ANIMATIONS
   =================================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/* ===================================================
   CONTACT FORM
   =================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const formMessage = document.getElementById('form-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn?.querySelector('.btn-text');
    const submitBtnSpinner = submitBtn?.querySelector('.spinner');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm(form)) {
            return;
        }

        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            if (submitBtnText) submitBtnText.textContent = 'Sender...';
            if (submitBtnSpinner) submitBtnSpinner.style.display = 'inline-block';
        }

        // Collect form data
        const formData = {
            name: form.querySelector('[name="name"]')?.value || '',
            email: form.querySelector('[name="email"]')?.value || '',
            phone: form.querySelector('[name="phone"]')?.value || '',
            address: form.querySelector('[name="address"]')?.value || '',
            jobType: form.querySelector('[name="jobType"]')?.value || '',
            description: form.querySelector('[name="description"]')?.value || '',
            wantSiteVisit: form.querySelector('[name="siteVisit"]')?.checked || false
        };

        try {
            // Simulate form submission (replace with actual API call)
            await simulateFormSubmission(formData);

            // Show success message
            if (formMessage) {
                formMessage.textContent = 'Takk for din henvendelse! Jeg vil kontakte deg så snart som mulig, vanligvis innen én arbeidsdag.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
            }

            // Reset form
            form.reset();

            // Scroll to message
            formMessage?.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            console.error('Form submission error:', error);

            // Show error message
            if (formMessage) {
                formMessage.textContent = 'Beklager, noe gikk galt. Vennligst prøv igjen eller ring oss direkte.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                if (submitBtnText) submitBtnText.textContent = 'Send Henvendelse';
                if (submitBtnSpinner) submitBtnSpinner.style.display = 'none';
            }
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    removeFieldError(field);

    // Check if empty (required)
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Dette feltet er obligatorisk';
    }
    // Validate email
    else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Vennligst oppgi en gyldig e-postadresse';
        }
    }
    // Validate phone
    else if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Vennligst oppgi et gyldig telefonnummer';
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.style.borderColor = 'var(--color-error)';

    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.style.cssText = 'color: var(--color-error); font-size: 0.875rem; margin-top: 0.25rem; display: block;';

    field.parentNode.appendChild(errorEl);
}

function removeFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';

    const errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) {
        errorEl.remove();
    }
}

async function simulateFormSubmission(data) {
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data submitted:', data);
            resolve({ success: true });
        }, 1500);
    });
}

/* ===================================================
   PROJECT FILTERS
   =================================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.category-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            // Filter projects
            projectCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            });
        });
    });
}

/* ===================================================
   UTILITY FUNCTIONS
   =================================================== */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Format phone number
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) {
        return cleaned.replace(/(\d{3})(\d{2})(\d{3})/, '$1 $2 $3');
    }
    return phone;
}

/* ===================================================
   LAZY LOADING IMAGES
   =================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});

/* ===================================================
   CLICK-TO-CALL ON MOBILE
   =================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track phone click (for analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Click'
                });
            }
        });
    });
});

/* ===================================================
   ACTIVE NAV LINK
   =================================================== */
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Check if current path matches the link
        if (currentPath.endsWith(href) ||
            (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
            link.classList.add('active');
        }
    });
});
