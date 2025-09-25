class AnimationController {
    constructor() {
        this.observers = [];
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.animationQueue = [];
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.initializeScrollReveal();
        this.initializeRippleEffects();
        this.initializeFontControls();
        this.initializeHoverEffects();
        this.setupMotionPreferences();
    }

    setupMotionPreferences() {
        // Listen for changes in motion preferences
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            this.updateAnimationSettings();
        });
    }

    updateAnimationSettings() {
        const root = document.documentElement;

        if (this.reducedMotion) {
            root.style.setProperty('--motion-duration-short1', '0ms');
            root.style.setProperty('--motion-duration-short2', '0ms');
            root.style.setProperty('--motion-duration-medium1', '0ms');
            root.style.setProperty('--motion-duration-medium2', '0ms');
            root.style.setProperty('--motion-duration-long1', '0ms');

            // Disable particle system
            if (window.particleSystem) {
                window.particleSystem.destroy();
            }
        } else {
            // Restore original durations
            root.style.removeProperty('--motion-duration-short1');
            root.style.removeProperty('--motion-duration-short2');
            root.style.removeProperty('--motion-duration-medium1');
            root.style.removeProperty('--motion-duration-medium2');
            root.style.removeProperty('--motion-duration-long1');
        }
    }

    initializeScrollReveal() {
        if (this.reducedMotion) return;

        const observerOptions = {
            threshold: [0.1, 0.3, 0.5],
            rootMargin: '0px 0px -10% 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                    this.animateReveal(entry.target);
                }
            });
        }, observerOptions);

        // Observe existing reveal elements
        this.observeRevealElements(revealObserver);

        // Store observer for cleanup
        this.observers.push(revealObserver);
    }

    observeRevealElements(observer) {
        // Wait for DOM to be ready
        setTimeout(() => {
            const revealElements = document.querySelectorAll('.reveal');
            revealElements.forEach((element, index) => {
                // Add staggered animation delay
                element.style.setProperty('--reveal-delay', `${index * 100}ms`);
                observer.observe(element);
            });
        }, 100);
    }

    animateReveal(element) {
        if (element.classList.contains('active')) return;

        const delay = parseInt(element.style.getPropertyValue('--reveal-delay')) || 0;

        setTimeout(() => {
            element.classList.add('active');

            // Trigger custom reveal event
            element.dispatchEvent(new CustomEvent('revealed', {
                bubbles: true,
                detail: { element }
            }));
        }, delay);
    }

    initializeRippleEffects() {
        // Enhanced ripple effects with better performance
        this.ripplePool = [];
        this.maxRipples = 10;

        // Pre-create ripple elements for performance
        this.createRipplePool();

        // Add ripple listeners with delegation
        document.addEventListener('click', this.handleRippleClick.bind(this), true);
    }

    createRipplePool() {
        for (let i = 0; i < this.maxRipples; i++) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                transform: scale(0);
                opacity: 0;
            `;
            this.ripplePool.push(ripple);
        }
    }

    handleRippleClick(e) {
        const rippleTarget = e.target.closest('.material-card, .font-card, .color-item, .btn-primary, .btn-secondary');

        if (!rippleTarget || this.reducedMotion) return;

        // Prevent ripples on disabled elements
        if (rippleTarget.disabled || rippleTarget.classList.contains('disabled')) return;

        this.createRipple(e, rippleTarget);
    }

    createRipple(e, target) {
        const ripple = this.getRippleFromPool();
        if (!ripple) return;

        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        // Get theme-appropriate color
        const rippleColor = this.getRippleColor(target);

        ripple.style.cssText += `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: ${rippleColor};
            transform: scale(0);
            opacity: 0.6;
            animation: ripple-animation 0.6s ease-out;
        `;

        // Ensure target can contain the ripple
        if (getComputedStyle(target).position === 'static') {
            target.style.position = 'relative';
        }
        target.style.overflow = 'hidden';

        target.appendChild(ripple);

        // Return ripple to pool after animation
        setTimeout(() => {
            this.returnRippleToPool(ripple, target);
        }, 600);
    }

    getRippleFromPool() {
        return this.ripplePool.pop();
    }

    returnRippleToPool(ripple, target) {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }

        // Reset ripple styles
        ripple.style.transform = 'scale(0)';
        ripple.style.opacity = '0';
        ripple.style.animation = '';

        this.ripplePool.push(ripple);
    }

    getRippleColor(target) {
        // Use appropriate ripple color based on target type
        if (target.classList.contains('btn-primary')) {
            return 'rgba(255, 255, 255, 0.3)';
        } else if (target.classList.contains('btn-secondary')) {
            return 'rgba(103, 80, 164, 0.25)';
        } else {
            return 'rgba(103, 80, 164, 0.3)';
        }
    }

    initializeFontControls() {
        // Wait for DOM elements to be available
        setTimeout(() => {
            const fontControls = document.querySelectorAll('.weight-slider input[type="range"]');

            fontControls.forEach(slider => {
                this.enhanceRangeSlider(slider);
            });
        }, 100);
    }

    enhanceRangeSlider(slider) {
        if (slider.dataset.enhanced) return;

        slider.dataset.enhanced = 'true';

        // Add visual feedback
        slider.addEventListener('input', () => {
            this.animateSliderThumb(slider);
        });

        // Add keyboard support
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                setTimeout(() => this.animateSliderThumb(slider), 0);
            }
        });
    }

    animateSliderThumb(slider) {
        if (this.reducedMotion) return;

        const thumb = slider.parentNode.querySelector('.slider-thumb');
        if (thumb) {
            thumb.style.transform = 'scale(1.2)';
            setTimeout(() => {
                thumb.style.transform = 'scale(1)';
            }, 150);
        }
    }

    initializeHoverEffects() {
        // Enhanced hover effects with better performance
        setTimeout(() => {
            const hoverElements = document.querySelectorAll('.material-card, .font-card, .color-item');

            hoverElements.forEach(element => {
                this.addHoverAnimation(element);
            });
        }, 100);
    }

    addHoverAnimation(element) {
        if (element.dataset.hoverEnhanced) return;

        element.dataset.hoverEnhanced = 'true';

        let hoverTimeout;

        element.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            this.animateHoverEnter(element);
        });

        element.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                this.animateHoverLeave(element);
            }, 50); // Small delay to prevent flicker
        });
    }

    animateHoverEnter(element) {
        if (this.reducedMotion) return;

        element.style.transition = 'transform 0.2s ease, box-shadow 0.3s ease';

        if (element.classList.contains('color-item')) {
            element.style.transform = 'translateY(-8px) rotateY(5deg)';
        } else {
            element.style.transform = 'translateY(-4px) scale(1.02)';
        }
    }

    animateHoverLeave(element) {
        if (this.reducedMotion) return;

        element.style.transform = '';
    }

    // Cleanup methods
    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];

        // Clean up event listeners
        document.removeEventListener('click', this.handleRippleClick);

        // Return ripples to pool
        this.ripplePool.forEach(ripple => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        });
        this.ripplePool = [];

        // Cancel any queued animations
        this.animationQueue = [];
        this.isProcessing = false;
    }

    // Public API methods
    isReducedMotion() {
        return this.reducedMotion;
    }
}
