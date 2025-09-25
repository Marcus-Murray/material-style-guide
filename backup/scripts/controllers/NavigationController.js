class NavigationController {
    constructor() {
        this.drawer = document.getElementById('nav-drawer');
        this.drawerToggle = document.getElementById('drawer-toggle');
        this.mainContent = document.getElementById('main-content');
        this.overlay = null;
        this.isOpen = false;
        this.isMobile = window.innerWidth <= 768;
        this.scrollPosition = 0;
        this.activeSection = null;
        this.init();
    }

    init() {
        this.createOverlay();
        this.bindEvents();
        this.setupScrollSpy();
        this.setupSmoothScrolling();
        this.updateMobileState();
        this.initializeEnhancedFeatures();
    }

    createOverlay() {
        this.overlay = Utils.createElement('div', 'drawer-overlay');
        this.overlay.addEventListener('click', () => this.closeDrawer());
        document.body.appendChild(this.overlay);
    }

    bindEvents() {
        // Drawer toggle
        this.drawerToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDrawer();
        });

        // Escape key to close drawer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDrawer();
            }
        });

        // Window resize handling
        window.addEventListener('resize', Utils.throttle(() => {
            this.updateMobileState();
        }, 250));

        // Prevent drawer close when clicking inside drawer
        this.drawer?.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Smooth scrolling for navigation links
        this.setupNavigationLinks();

        // FAB scroll to top
        this.setupScrollToTop();

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.scrollToSection(e.state.section, false);
            }
        });
    }

    setupNavigationLinks() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);

                if (this.isMobile) {
                    this.closeDrawer();
                }
            });
        });
    }

    setupScrollToTop() {
        const scrollBtn = document.getElementById('scroll-to-top-btn');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', () => {
                this.scrollToTop();
            });

            // Show/hide FAB based on scroll position
            window.addEventListener('scroll', Utils.throttle(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > 300) {
                    scrollBtn.classList.add('visible');
                } else {
                    scrollBtn.classList.remove('visible');
                }
            }, 100));
        }
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('[id*="-section"]');

        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    this.setActiveSection(entry.target.id);
                }
            });
        }, {
            threshold: [0.1, 0.5, 0.9],
            rootMargin: '-20% 0px -70% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    setActiveSection(sectionId) {
        if (this.activeSection === sectionId) return;

        this.activeSection = sectionId;

        // Update navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });

        // Update URL without triggering navigation
        if (history.replaceState) {
            history.replaceState({ section: sectionId }, '', `#${sectionId}`);
        }

        // Announce section change for screen readers
        this.announceSection(sectionId);
    }

    announceSection(sectionId) {
        const sectionNames = {
            'colors-section': 'Color Palette',
            'typography-section': 'Typography',
            'playground-section': 'Component Playground'
        };

        const sectionName = sectionNames[sectionId] || sectionId;

        const announcement = Utils.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = `Now viewing ${sectionName} section`;

        document.body.appendChild(announcement);

        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling is handled by scrollToSection method
    }

    scrollToSection(targetId, updateHistory = true) {
        const target = document.getElementById(targetId);
        if (!target) return;

        // Use native smooth scrolling
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        if (updateHistory && history.pushState) {
            history.pushState({ section: targetId }, '', `#${targetId}`);
        }

        // Track navigation event
        this.trackNavigation(targetId);
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Update active section
        this.setActiveSection('');

        // Clear URL hash
        if (history.replaceState) {
            history.replaceState({}, '', window.location.pathname);
        }
    }

    toggleDrawer() {
        if (this.isOpen) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    openDrawer() {
        if (this.isOpen) return;

        this.isOpen = true;
        this.drawer?.classList.add('open');
        this.overlay?.classList.add('show');

        // Handle body scroll and content shift
        if (!this.isMobile) {
            this.mainContent?.classList.add('drawer-open');
        } else {
            // Prevent body scroll on mobile
            this.scrollPosition = window.pageYOffset;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${this.scrollPosition}px`;
            document.body.style.width = '100%';
        }

        // Update toggle button
        this.updateToggleButton();

        // Focus management
        this.focusDrawer();

        // Announce to screen readers
        this.announceDrawerState('opened');
    }

    closeDrawer() {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.drawer?.classList.remove('open');
        this.overlay?.classList.remove('show');
        this.mainContent?.classList.remove('drawer-open');

        // Restore body scroll on mobile
        if (this.isMobile) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, this.scrollPosition);
        }

        // Update toggle button
        this.updateToggleButton();

        // Return focus to toggle button
        this.drawerToggle?.focus();

        // Announce to screen readers
        this.announceDrawerState('closed');
    }

    updateToggleButton() {
        if (!this.drawerToggle) return;

        const icon = this.drawerToggle.querySelector('.material-icons-outlined');
        const isOpen = this.isOpen;

        if (icon) {
            icon.textContent = isOpen ? 'close' : 'menu';
        }

        this.drawerToggle.setAttribute('aria-expanded', isOpen.toString());
        this.drawerToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        this.drawerToggle.title = isOpen ? 'Close menu' : 'Open menu';
    }

    focusDrawer() {
        if (!this.drawer) return;

        // Focus first focusable element in drawer
        const focusableElements = this.drawer.querySelectorAll(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    announceDrawerState(state) {
        const announcement = Utils.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = `Navigation menu ${state}`;

        document.body.appendChild(announcement);

        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    updateMobileState() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        // Handle mobile/desktop transition
        if (wasMobile !== this.isMobile && this.isOpen) {
            if (this.isMobile) {
                // Switched to mobile - ensure proper mobile behavior
                this.mainContent?.classList.remove('drawer-open');
                this.scrollPosition = window.pageYOffset;
                document.body.style.position = 'fixed';
                document.body.style.top = `-${this.scrollPosition}px`;
                document.body.style.width = '100%';
            } else {
                // Switched to desktop - ensure proper desktop behavior
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                this.mainContent?.classList.add('drawer-open');
            }
        }

        // Auto-close drawer on mobile when switching to desktop
        if (!this.isMobile && wasMobile && this.isOpen) {
            this.closeDrawer();
        }
    }

    trackNavigation(sectionId) {
        // Analytics tracking for navigation events
        if (typeof gtag !== 'undefined') {
            gtag('event', 'navigation', {
                event_category: 'User Interaction',
                event_label: sectionId,
                value: 1
            });
        }

        // Custom tracking
        if (window.styleGuideAnalytics) {
            window.styleGuideAnalytics.trackNavigation(sectionId);
        }
    }

    setupKeyboardNavigation() {
        // Add keyboard shortcuts for navigation
        document.addEventListener('keydown', (e) => {
            // Don't interfere with form inputs
            if (e.target.matches('input, textarea, [contenteditable]')) {
                return;
            }

            // Navigation shortcuts (Alt + number)
            if (e.altKey && !e.ctrlKey && !e.shiftKey) {
                const keyMap = {
                    '1': 'colors-section',
                    '2': 'typography-section',
                    '3': 'playground-section'
                };

                const sectionId = keyMap[e.key];
                if (sectionId) {
                    e.preventDefault();
                    this.scrollToSection(sectionId);
                    if (typeof SnackbarController !== 'undefined') {
                        SnackbarController.info(`Navigated to ${sectionId.replace('-section', '').replace('-', ' ')}`);
                    }
                }
            }

            // Menu toggle shortcut (Alt + M)
            if (e.altKey && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                this.toggleDrawer();
            }
        });
    }

    handleInitialHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            // Delay to ensure page is fully loaded
            setTimeout(() => {
                this.scrollToSection(hash, false);
            }, 100);
        }
    }

    initializeEnhancedFeatures() {
        this.setupKeyboardNavigation();
        this.handleInitialHash();
    }

    // Public API methods
    getCurrentSection() {
        return this.activeSection;
    }

    isDrawerOpen() {
        return this.isOpen;
    }

    isMobileView() {
        return this.isMobile;
    }

    // Cleanup method
    destroy() {
        // Remove event listeners and cleanup
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}
