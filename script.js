// ============================================
// ONLYFORU CREATOR MARKETING SITE - JAVASCRIPT
// Interactive Features & Animations
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });

    // ============================================
    // REVENUE CALCULATOR
    // ============================================
    const queriesSlider = document.getElementById('queries-per-month');
    const queriesValue = document.getElementById('queries-value');
    const packageMix = document.getElementById('package-mix');
    const grossRevenue = document.getElementById('gross-revenue');
    const creatorEarnings = document.getElementById('creator-earnings');
    const timeInvestment = document.getElementById('time-investment');
    const hourlyRate = document.getElementById('hourly-rate');
    const annualProjection = document.getElementById('annual-projection');

    // Package pricing (average values)
    const packagePricing = {
        quick: 700,      // ₹399-999 avg
        mixed: 3100,     // Weighted avg: (50×700 + 25×3500 + 5×27000) / 80 = ₹3,100
        deep: 3500,      // ₹2000-5000 avg
        premium: 27000   // ₹14,999-39,000 avg
    };

    // Time per query based on package type (in minutes)
    const packageTime = {
        quick: 4,        // Quick Resolve: 3-5 min avg
        mixed: 22,       // Weighted avg: (50×4 + 25×30 + 5×150) / 80 = 22 min
        deep: 30,        // Deep Resolve: 10-15 min + 3 follow-ups (5 min each)
        premium: 150     // Premium Mentoring: 3-4 sessions × 40-45 min each
    };

    function calculateRevenue() {
        const queries = parseInt(queriesSlider.value);
        const packageType = packageMix.value;
        const avgPrice = packagePricing[packageType];
        const timePerQuery = packageTime[packageType];

        // Calculate gross revenue
        const gross = queries * avgPrice;

        // Calculate creator earnings (85% split - but don't emphasize this)
        const earnings = Math.round(gross * 0.85);

        // Calculate time investment based on package type
        const totalMinutes = queries * timePerQuery;
        const hours = Math.round(totalMinutes / 60); // Round to whole hours
        const timeStr = `${hours}h/month`;

        // Calculate hourly rate
        const hourlyRateValue = totalMinutes > 0 ? Math.round(earnings / (totalMinutes / 60)) : 0;

        // Calculate annual projection
        const annual = earnings * 12;

        // Update UI
        queriesValue.textContent = queries;
        grossRevenue.textContent = `₹${gross.toLocaleString('en-IN')}`;
        creatorEarnings.textContent = `₹${earnings.toLocaleString('en-IN')}`;

        // Update boost text (removed split emphasis)
        const boostText = document.querySelector('.result-boost');
        if (boostText) {
            boostText.textContent = `💎 Premium creator earnings`;
        }

        timeInvestment.textContent = timeStr;
        hourlyRate.textContent = `₹${hourlyRateValue.toLocaleString('en-IN')}/hour`;

        // Format annual projection
        const lakhs = (annual / 100000).toFixed(2);
        annualProjection.textContent = `₹${lakhs} Lakhs/year`;

        // Update dropdown text dynamically based on package mix ratio
        if (packageType === 'mixed') {
            // Ratio: 50:25:5 = 62.5% Quick, 31.25% Deep, 6.25% Premium
            const quickCount = Math.round(queries * 0.625);
            const deepCount = Math.round(queries * 0.3125);
            const premiumCount = Math.round(queries * 0.0625);

            // Update the selected option text
            const selectedOption = packageMix.querySelector('option[value="mixed"]');
            if (selectedOption) {
                selectedOption.textContent = `Mixed (${quickCount} Quick + ${deepCount} Deep + ${premiumCount} Premium)`;
            }
        }
    }

    // Initialize calculator
    if (queriesSlider && packageMix) {
        calculateRevenue();

        queriesSlider.addEventListener('input', calculateRevenue);
        packageMix.addEventListener('change', calculateRevenue);
    }

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.comparison-card, .workflow-step, .workflow-node, .sla-card, ' +
        '.ai-feature, .testimonial-card, .perk-card, .roi-example'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add animate-in class styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // SIGNUP FORM HANDLING
    // ============================================
    const signupForm = document.getElementById('creator-signup-form');
    const platformSelect = document.getElementById('creator-platform');
    const followersLabel = document.getElementById('followers-label');

    // Update label based on platform selection
    if (platformSelect && followersLabel) {
        platformSelect.addEventListener('change', function () {
            if (this.value === 'youtube') {
                followersLabel.textContent = 'Subscriber Count *';
            } else {
                followersLabel.textContent = 'Follower Count *';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(signupForm);
            try {
                // Send to Formspree
                const response = await fetch('https://formspree.io/f/xbdjobql', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('🎉 Thank you! We\'ll be in touch within 24 hours to get you started.');
                    signupForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Thank you for signing up! We\'ll contact you soon.');
                signupForm.reset();
            }
        });
    }

    // ============================================
    // NAVBAR BACKGROUND ON SCROLL
    // ============================================
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(15, 15, 30, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 15, 30, 0.8)';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // FLOATING CARDS PARALLAX EFFECT
    // ============================================
    const floatingCards = document.querySelectorAll('.floating-card');

    window.addEventListener('mousemove', function (e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 10;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;

            card.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ============================================
    // ANALYTICS TRACKING (Ready for integration)
    // ============================================
    function trackEvent(eventName, eventData = {}) {
        // TODO: Integrate with Google Analytics, Mixpanel, etc.
        console.log('Event tracked:', eventName, eventData);

        // Example: gtag('event', eventName, eventData);
    }

    // Track CTA clicks
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function () {
            trackEvent('cta_click', {
                button_text: this.textContent.trim(),
                button_location: this.closest('section')?.className || 'unknown'
            });
        });
    });

    // Track calculator interactions
    if (queriesSlider) {
        queriesSlider.addEventListener('change', function () {
            trackEvent('calculator_interaction', {
                queries: this.value,
                package_mix: packageMix.value
            });
        });
    }

    // Track form start
    const formInputs = signupForm?.querySelectorAll('input, select, textarea');
    let formStarted = false;

    formInputs?.forEach(input => {
        input.addEventListener('focus', function () {
            if (!formStarted) {
                trackEvent('signup_form_started');
                formStarted = true;
            }
        });
    });

    // ============================================
    // EASTER EGG: Konami Code
    // ============================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function (e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Easter egg activated!
                document.body.style.animation = 'rainbow 2s linear infinite';
                setTimeout(() => {
                    alert('🎉 Secret creator mode activated! You get 95% split! (Just kidding... or are we? 😉)');
                    document.body.style.animation = '';
                }, 100);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Rainbow animation for easter egg
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================

    // Lazy load images (if any are added later)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // CONSOLE EASTER EGG
    // ============================================
    console.log('%c👋 Hey Creator!', 'font-size: 24px; font-weight: bold; color: #8B5CF6;');
    console.log('%cLooking under the hood? We like your style! 🚀', 'font-size: 14px; color: #EC4899;');
    console.log('%cJoin OnlyForU and turn your expertise into income: https://onlyforu.com', 'font-size: 12px; color: #4facfe;');

});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format currency
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
