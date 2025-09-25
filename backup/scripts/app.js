// Enhanced Main Application Controller
class EnhancedStyleGuideApp {
    constructor() {
        this.components = {};
        this.controllers = {};
        this.isInitialized = false;
        this.performanceMetrics = {
            startTime: performance.now(),
            initTime: null,
            renderTime: null
        };
        this.init();
    }

    async init() {
        try {
            console.log('🎨 Initializing Enhanced Material Design Style Guide...');

            // Initialize core controllers first
            await this.initializeControllers();

            // Initialize components
            await this.initializeComponents();

            // Setup global event handlers
            this.setupGlobalEventHandlers();

            // Render all components
            await this.render();

            // Finalize initialization
            this.finalizeInitialization();

            this.performanceMetrics.initTime = performance.now() - this.performanceMetrics.startTime;
            console.log(`✅ Style guide initialized in ${Math.round(this.performanceMetrics.initTime)}ms`);

        } catch (error) {
            console.error('❌ Failed to initialize style guide:', error);
            this.handleInitializationError(error);
        }
    }

    async initializeControllers() {
        const controllerStartTime = performance.now();

        try {
            // Theme controller (highest priority)
            this.controllers.theme = new ThemeController();

            // Particle system (with reduced motion check)
            this.controllers.particles = new ParticleSystem();

            // Navigation controller
            this.controllers.navigation = new NavigationController();

            // Animation controller
            this.controllers.animation = new AnimationController();

            // Search controller (will be initialized after components)
            // Export controller (will be initialized after components)

            console.log(`🎛️ Controllers initialized in ${Math.round(performance.now() - controllerStartTime)}ms`);

        } catch (error) {
            console.error('Failed to initialize controllers:', error);
            throw error;
        }
    }

    async initializeComponents() {
        const componentStartTime = performance.now();

        try {
            // Initialize data-driven components
            this.components.colorPalette = new ColorPalette('color-grid', ENHANCED_STYLE_GUIDE_DATA.colors);
            this.components.fontShowcase = new FontShowcase('font-grid', ENHANCED_STYLE_GUIDE_DATA.fonts);
            this.components.typographyShowcase = new TypographyShowcase('typography-showcase', ENHANCED_STYLE_GUIDE_DATA.typographyExamples);

            // Initialize dependent controllers
            this.controllers.search = new SearchController(this.components.colorPalette, this.components.fontShowcase);
            this.controllers.export = new ExportController(this.components.colorPalette, this.components.fontShowcase);

            // Store global references for other controllers
            window.fontShowcase = this.components.fontShowcase;
            window.searchController = this.controllers.search;

            console.log(`🧩 Components initialized in ${Math.round(performance.now() - componentStartTime)}ms`);

        } catch (error) {
            console.error('Failed to initialize components:', error);
            throw error;
        }
    }

    setupGlobalEventHandlers() {
        // Global error handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.handleGlobalError(e.error);
        });

        // Global unhandled promise rejection handling
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.handleGlobalError(e.reason);
        });

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });

        // Before unload handling
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });

        // Custom color addition
        document.getElementById('add-color-btn')?.addEventListener('click', () => {
            this.addCustomColor();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });
    }

    async render() {
        const renderStartTime = performance.now();

        try {
            // Render components in order of importance
            const renderPromises = [
                this.components.colorPalette.render(),
                this.components.fontShowcase.render(),
                this.components.typographyShowcase.render()
            ];

            await Promise.all(renderPromises);

            this.performanceMetrics.renderTime = performance.now() - renderStartTime;
            console.log(`🎨 Components rendered in ${Math.round(this.performanceMetrics.renderTime)}ms`);

        } catch (error) {
            console.error('Failed to render components:', error);
            throw error;
        }
    }

    finalizeInitialization() {
        // Mark as initialized
        this.isInitialized = true;

        // Add loaded class to body for CSS transitions
        document.body.classList.add('app-loaded');

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('styleGuideReady', {
            detail: {
                app: this,
                metrics: this.performanceMetrics
            }
        }));

        // Initialize analytics if available
        this.initializeAnalytics();

        // Show welcome message
        setTimeout(() => {
            SnackbarController.success('Style guide loaded successfully!');
        }, 1000);
    }

    addCustomColor() {
        const name = prompt('Enter color name:');
        if (!name) return;

        const hex = prompt('Enter hex color (e.g., #FF5722):');
        if (!hex || !Utils.isValidHexColor(hex)) {
            SnackbarController.error('Invalid color format. Please use #RRGGBB format.');
            return;
        }

        const rgb = Utils.hexToRgb(hex);
        const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        const textColor = Utils.getContrastRatio(hex, '#000000') > Utils.getContrastRatio(hex, '#ffffff') ? '#000' : '#fff';

        const newColor = {
            name: name,
            hex: hex,
            rgb: rgbString,
            textColor: textColor,
            editable: true,
            category: 'custom',
            usage: ['custom']
        };

        this.components.colorPalette.addColor(newColor);
        SnackbarController.success(`Added ${name} to palette!`);
    }

    handleGlobalKeydown(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k': // Ctrl/Cmd + K for search
                    e.preventDefault();
                    this.focusSearch();
                    break;
                case '/': // Ctrl/Cmd + / for help
                    e.preventDefault();
                    this.showKeyboardShortcuts();
                    break;
                case 'e': // Ctrl/Cmd + E for export
                    e.preventDefault();
                    this.showExportOptions();
                    break;
            }
        }

        // Escape key handling
        if (e.key === 'Escape') {
            this.handleEscapeKey();
        }
    }

    focusSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    showKeyboardShortcuts() {
        const shortcuts = `
        Keyboard Shortcuts:

        Navigation:
        • Alt + 1-3: Jump to sections
        • Alt + M: Toggle menu
        • Ctrl + ↑/↓: Navigate sections

        Actions:
        • Ctrl + K: Focus search
        • Ctrl + E: Export options
        • Ctrl + Z: Undo (in edit mode)
        • Ctrl + /: Show this help

        Other:
        • Escape: Close modals/menus
        • Space/Enter: Activate buttons
        `;

        alert(shortcuts); // Could be replaced with a proper modal
    }

    showExportOptions() {
        SnackbarController.info('Use the Export buttons in each section to download CSS/JSON');
    }

    handleEscapeKey() {
        // Close any open modals or drawers
        if (this.controllers.navigation?.isDrawerOpen()) {
            this.controllers.navigation.closeDrawer();
        }

        // Close any open modals
        const openModal = document.querySelector('.modal-overlay.show');
        if (openModal) {
            openModal.classList.remove('show');
        }
    }

    handlePageHidden() {
        // Pause animations and heavy operations when page is hidden
        if (this.controllers.particles) {
            this.controllers.particles.pause();
        }

        // Stop any ongoing animations
        if (this.controllers.animation) {
            // Animation controller handles this automatically
        }
    }

    handlePageVisible() {
        // Resume animations when page becomes visible
        if (this.controllers.particles) {
            this.controllers.particles.resume();
        }
    }

    handleInitializationError(error) {
        // Show user-friendly error message
        const errorContainer = Utils.createElement('div', 'initialization-error');
        errorContainer.innerHTML = `
            <div class="error-content">
                <h2>Initialization Error</h2>
                <p>The style guide failed to load properly. Please refresh the page.</p>
                <button class="btn-primary" onclick="window.location.reload()">
                    <span class="material-icons-outlined">refresh</span>
                    Refresh Page
                </button>
            </div>
        `;

        document.body.appendChild(errorContainer);
    }

    handleGlobalError(error) {
        // Log error for debugging
        console.error('Application error:', error);

        // Show user notification
        SnackbarController.error('An error occurred. Some features may not work properly.');

        // Send error to analytics if configured
        if (window.gtag) {
            gtag('event', 'exception', {
                description: error.message || error.toString(),
                fatal: false
            });
        }
    }

    initializeAnalytics() {
        // Initialize Google Analytics or other analytics services
        if (window.gtag) {
            gtag('event', 'style_guide_loaded', {
                event_category: 'Application',
                event_label: 'Initialization Complete',
                value: Math.round(this.performanceMetrics.initTime)
            });
        }

        // Custom analytics
        if (window.styleGuideAnalytics) {
            window.styleGuideAnalytics.track('app_initialized', {
                initTime: this.performanceMetrics.initTime,
                renderTime: this.performanceMetrics.renderTime,
                userAgent: navigator.userAgent,
                timestamp: Date.now()
            });
        }
    }

    cleanup() {
        // Cleanup before page unload
        console.log('🧹 Cleaning up application...');

        try {
            // Destroy controllers
            Object.values(this.controllers).forEach(controller => {
                if (controller.destroy) {
                    controller.destroy();
                }
            });

            // Clear any intervals or timeouts
            // (They should be handled by individual controllers)

            // Remove global event listeners
            // (They will be automatically removed when page unloads)

        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }

    // Public API methods
    getComponent(name) {
        return this.components[name];
    }

    getController(name) {
        return this.controllers[name];
    }

    isReady() {
        return this.isInitialized;
    }

    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }

    // Development/debug methods
    exportConfiguration() {
        return {
            colors: this.components.colorPalette?.colorData || [],
            fonts: this.components.fontShowcase?.fontData || [],
            typography: this.components.typographyShowcase?.typographyData || [],
            theme: this.controllers.theme?.getCurrentTheme() || 'light',
            metadata: ENHANCED_STYLE_GUIDE_DATA.metadata
        };
    }

    importConfiguration(config) {
        try {
            if (config.colors) {
                this.components.colorPalette.colorData = config.colors;
                this.components.colorPalette.render();
            }

            if (config.fonts) {
                this.components.fontShowcase.fontData = config.fonts;
                this.components.fontShowcase.render();
            }

            if (config.typography) {
                this.components.typographyShowcase.typographyData = config.typography;
                this.components.typographyShowcase.render();
            }

            if (config.theme) {
                this.controllers.theme.setTheme(config.theme);
            }

            SnackbarController.success('Configuration imported successfully!');

        } catch (error) {
            console.error('Failed to import configuration:', error);
            SnackbarController.error('Failed to import configuration');
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Global app instance
    window.styleGuideApp = new EnhancedStyleGuideApp();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedStyleGuideApp;
}
