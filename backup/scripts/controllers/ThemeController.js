class ThemeController {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggle());

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
        this.announceThemeChange();
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        this.updateIcon(theme);
        this.updateParticleColors();
    }

    updateIcon(theme) {
        this.themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
        this.themeToggle.title = `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`;
    }

    updateParticleColors() {
        // Update particle colors to match theme
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const primaryColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--md-sys-color-primary').trim();
            particle.style.background = primaryColor;
        });
    }

    saveTheme() {
        localStorage.setItem('theme', this.currentTheme);
    }

    announceThemeChange() {
        // Announce theme change for accessibility
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = `Switched to ${this.currentTheme} theme`;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            this.applyTheme(theme);
            this.saveTheme();
        }
    }
}
