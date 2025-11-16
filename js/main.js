/**
 * Voskopojë Tourism Website - Main JavaScript
 * Handles navigation, smooth scrolling, animations, and user interactions
 */

'use strict';

// ===================================
// DOM Elements
// ===================================
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopButton = document.getElementById('back-to-top');
const sections = document.querySelectorAll('.section');

// ===================================
// Mobile Navigation Toggle
// ===================================
function initMobileNav() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ===================================
// Smooth Scrolling
// ===================================
function initSmoothScrolling() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Navbar Scroll Behavior
// ===================================
function initNavbarScroll() {
    if (!navbar) return;

    let lastScrollTop = 0;
    let scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add shadow when scrolled
        if (scrollTop > 10) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        } else {
            navbar.style.boxShadow = '';
        }

        // Hide/show navbar on scroll (optional - currently disabled for better UX)
        // Uncomment below to enable auto-hide navbar
        /*
        if (scrollTop > scrollThreshold) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
        }
        lastScrollTop = scrollTop;
        */
    }, { passive: true });
}

// ===================================
// Active Navigation Link
// ===================================
function initActiveNavLink() {
    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');

                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to corresponding link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// ===================================
// Back to Top Button
// ===================================
function initBackToTop() {
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }, { passive: true });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Intersection Observer for Animations
// ===================================
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.timeline-item, .church-card, .activity-card, .visit-card, .highlight-card');

    if (!animatedElements.length) return;

    const animationObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animationObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Optional: unobserve after animation to improve performance
                // observer.unobserve(entry.target);
            }
        });
    };

    const animationObserver = new IntersectionObserver(animationObserverCallback, animationObserverOptions);

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// ===================================
// Lazy Loading Images (if any are added later)
// ===================================
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (!lazyImages.length) return;

    const imageObserverOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
    };

    const imageObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    };

    const imageObserver = new IntersectionObserver(imageObserverCallback, imageObserverOptions);

    lazyImages.forEach(image => {
        imageObserver.observe(image);
    });
}

// ===================================
// Performance Optimization - Debounce
// ===================================
function debounce(func, wait = 10, immediate = false) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;

        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
}

// ===================================
// External Link Handling
// ===================================
function initExternalLinks() {
    // Add target="_blank" and rel="noopener noreferrer" to external links
    const links = document.querySelectorAll('a[href^="http"]');

    links.forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');

            // Add aria-label for accessibility
            const currentAriaLabel = link.getAttribute('aria-label') || link.textContent;
            link.setAttribute('aria-label', `${currentAriaLabel} (opens in new window)`);
        }
    });
}

// ===================================
// Keyboard Navigation Enhancement
// ===================================
function initKeyboardNavigation() {
    // Allow keyboard users to navigate the mobile menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        }
    });
}

// ===================================
// Print Optimization
// ===================================
function initPrintOptimization() {
    window.addEventListener('beforeprint', () => {
        // Expand all collapsed sections before printing
        const collapsedSections = document.querySelectorAll('[aria-expanded="false"]');
        collapsedSections.forEach(section => {
            section.setAttribute('data-was-collapsed', 'true');
            section.setAttribute('aria-expanded', 'true');
        });
    });

    window.addEventListener('afterprint', () => {
        // Restore collapsed state after printing
        const sectionsToCollapse = document.querySelectorAll('[data-was-collapsed="true"]');
        sectionsToCollapse.forEach(section => {
            section.setAttribute('aria-expanded', 'false');
            section.removeAttribute('data-was-collapsed');
        });
    });
}

// ===================================
// Analytics Tracking (Placeholder)
// ===================================
function initAnalytics() {
    // Track navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const sectionName = link.textContent.trim();
            // Placeholder for analytics
            console.log(`Navigation clicked: ${sectionName}`);

            // Example: Google Analytics
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'navigation_click', {
            //         'section_name': sectionName
            //     });
            // }
        });
    });

    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('CTA button clicked');

            // Example: Google Analytics
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'cta_click', {
            //         'button_text': button.textContent.trim()
            //     });
            // }
        });
    });
}

// ===================================
// Error Handling
// ===================================
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // In production, you might want to send this to an error tracking service
    });
}

// ===================================
// Page Load Performance
// ===================================
function logPerformanceMetrics() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;

                console.log(`Page Load Time: ${pageLoadTime}ms`);
                console.log(`Connect Time: ${connectTime}ms`);
                console.log(`Render Time: ${renderTime}ms`);

                // Send to analytics if needed
            }, 0);
        });
    }
}

// ===================================
// Church Gallery Pagination
// ===================================
function initChurchPagination() {
    const churchCards = document.querySelectorAll('.church-card');
    const prevBtn = document.getElementById('prev-churches');
    const nextBtn = document.getElementById('next-churches');
    const paginationDots = document.getElementById('pagination-dots');

    if (!churchCards.length || !prevBtn || !nextBtn) return;

    const cardsPerPage = 3;
    const totalPages = Math.ceil(churchCards.length / cardsPerPage);
    let currentPage = 0;

    // Create pagination dots
    function createPaginationDots() {
        paginationDots.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('pagination-dot');
            dot.setAttribute('aria-label', `Go to page ${i + 1}`);
            if (i === currentPage) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => goToPage(i));
            paginationDots.appendChild(dot);
        }
    }

    // Show cards for current page
    function showPage(pageIndex) {
        const start = pageIndex * cardsPerPage;
        const end = start + cardsPerPage;

        churchCards.forEach((card, index) => {
            card.style.display = 'none';
            card.classList.remove('fade-in');

            if (index >= start && index < end) {
                card.style.display = 'block';
                // Trigger animation
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, 50 * (index - start));
            }
        });

        // Update pagination dots
        document.querySelectorAll('.pagination-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === pageIndex);
        });

        // Update button states
        prevBtn.disabled = pageIndex === 0;
        nextBtn.disabled = pageIndex === totalPages - 1;

        // Update ARIA labels
        prevBtn.setAttribute('aria-disabled', pageIndex === 0);
        nextBtn.setAttribute('aria-disabled', pageIndex === totalPages - 1);
    }

    // Navigate to specific page
    function goToPage(pageIndex) {
        currentPage = pageIndex;
        showPage(currentPage);

        // Scroll to churches section smoothly
        const heritageSection = document.getElementById('heritage');
        if (heritageSection) {
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = heritageSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Event listeners
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            goToPage(currentPage - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
        }
    });

    // Keyboard navigation for pagination
    document.addEventListener('keydown', (e) => {
        const paginationActive = document.activeElement.classList.contains('pagination-btn') ||
                                 document.activeElement.classList.contains('pagination-dot');

        if (paginationActive) {
            if (e.key === 'ArrowLeft' && currentPage > 0) {
                e.preventDefault();
                goToPage(currentPage - 1);
            } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
                e.preventDefault();
                goToPage(currentPage + 1);
            }
        }
    });

    // Initialize
    createPaginationDots();
    showPage(currentPage);
}

// ===================================
// Parallax Effect for Hero Section
// ===================================
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.hero-content');

        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    }, { passive: true });
}

// ===================================
// Enhanced Card Hover Effects
// ===================================
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.church-card, .activity-card, .visit-card, .highlight-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===================================
// Scroll Progress Indicator
// ===================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Page scroll progress');
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
        progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
    }, { passive: true });
}

// ===================================
// Animated Counter for Stats
// ===================================
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');

    const animateValue = (element, start, end, duration) => {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        const isElevation = element.textContent.includes('m');
        const isCentury = element.textContent.includes('th');

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }

            if (isElevation) {
                element.textContent = Math.round(current) + 'm';
            } else if (isCentury) {
                element.textContent = Math.round(current) + 'th';
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    };

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const text = entry.target.textContent;
                const numberMatch = text.match(/[\d,]+/);

                if (numberMatch) {
                    const finalValue = parseInt(numberMatch[0].replace(/,/g, ''));
                    animateValue(entry.target, 0, finalValue, 2000);
                }
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

// ===================================
// Initialize All Features
// ===================================
function init() {
    // Core functionality
    initMobileNav();
    initSmoothScrolling();
    initNavbarScroll();
    initActiveNavLink();
    initBackToTop();

    // Enhancements
    initScrollAnimations();
    initLazyLoading();
    initExternalLinks();
    initKeyboardNavigation();
    initPrintOptimization();

    // New features
    initChurchPagination();
    initParallaxEffect();
    initCardHoverEffects();
    initScrollProgress();
    initStatsCounter();

    // Analytics and monitoring
    initAnalytics();
    initErrorHandling();
    logPerformanceMetrics();

    console.log('Voskopojë Tourism Website initialized successfully');
}

// ===================================
// DOM Ready
// ===================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM is already ready
    init();
}

// ===================================
// Service Worker Registration (for PWA - optional)
// ===================================
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('ServiceWorker registered:', registration))
        //     .catch(error => console.log('ServiceWorker registration failed:', error));
    });
}

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileNav,
        initSmoothScrolling,
        initBackToTop,
        debounce
    };
}
