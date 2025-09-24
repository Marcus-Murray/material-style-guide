class StyleGuideApp {
    constructor() {
        this.init();
    }

    init() {
        // Initialize components
        this.colorPalette = new ColorPalette('color-grid', STYLE_GUIDE_DATA.colors);
        this.fontShowcase = new FontShowcase('font-grid', STYLE_GUIDE_DATA.fonts);
        this.typographyShowcase = new TypographyShowcase('typography-showcase', STYLE_GUIDE_DATA.typographyExamples);

        // Initialize controllers
        this.animationController = new AnimationController();
        this.navigationController = new NavigationController();

        // Render components
        this.render();
    }

    render() {
        this.colorPalette.render();
        this.fontShowcase.render();
        this.typographyShowcase.render();
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StyleGuideApp();
});
