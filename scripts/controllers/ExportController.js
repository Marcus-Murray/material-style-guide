class ExportController {
    constructor(colorPalette, fontShowcase) {
        this.colorPalette = colorPalette;
        this.fontShowcase = fontShowcase;
        this.modal = document.getElementById('modal-overlay');
        this.codeContainer = document.getElementById('export-code');
        this.currentCode = '';
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Export buttons
        document.getElementById('export-colors-btn')?.addEventListener('click', () => {
            this.exportColors();
        });

        document.getElementById('export-fonts-btn')?.addEventListener('click', () => {
            this.exportFonts();
        });

        // Modal controls
        document.getElementById('close-modal-btn')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancel-modal-btn')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('copy-code-btn')?.addEventListener('click', () => {
            this.copyCode();
        });

        // Close modal when clicking overlay
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    exportColors() {
        const formats = {
            css: this.generateColorCSS(),
            scss: this.generateColorSCSS(),
            json: this.generateColorJSON(),
            js: this.generateColorJS()
        };

        const combinedCode = this.createTabbedExport('Color Export', formats);
        this.showModal('Color Export', combinedCode);
    }

    exportFonts() {
        const formats = {
            css: this.generateFontCSS(),
            scss: this.generateFontSCSS(),
            json: this.generateFontJSON(),
            js: this.generateFontJS()
        };

        const combinedCode = this.createTabbedExport('Font Export', formats);
        this.showModal('Font Export', combinedCode);
    }

    generateColorCSS() {
        if (!this.colorPalette?.colorData) return '';

        let css = ':root {\n';
        this.colorPalette.colorData.forEach(color => {
            const varName = Utils.slugify(color.name);
            css += `  --color-${varName}: ${color.hex};\n`;
            const rgb = Utils.hexToRgb(color.hex);
            if (rgb) {
                css += `  --color-${varName}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n`;
            }
        });
        css += '}\n\n';

        // Add utility classes
        css += '/* Color Utility Classes */\n';
        this.colorPalette.colorData.forEach(color => {
            const varName = Utils.slugify(color.name);
            css += `.text-${varName} { color: var(--color-${varName}); }\n`;
            css += `.bg-${varName} { background-color: var(--color-${varName}); }\n`;
            css += `.border-${varName} { border-color: var(--color-${varName}); }\n`;
        });

        return css;
    }

    generateColorSCSS() {
        if (!this.colorPalette?.colorData) return '';

        let scss = '// Color Variables\n';
        this.colorPalette.colorData.forEach(color => {
            const varName = Utils.slugify(color.name);
            scss += `$color-${varName}: ${color.hex};\n`;
            const rgb = Utils.hexToRgb(color.hex);
            if (rgb) {
                scss += `$color-${varName}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n`;
            }
        });

        scss += '\n// Color Map\n$colors: (\n';
        this.colorPalette.colorData.forEach((color, index) => {
            const varName = Utils.slugify(color.name);
            scss += `  "${varName}": $color-${varName}`;
            scss += index < this.colorPalette.colorData.length - 1 ? ',\n' : '\n';
        });
        scss += ');\n\n';

        // Add mixins
        scss += '// Color Mixins\n';
        scss += '@mixin text-color($color-name) {\n';
        scss += '  color: map-get($colors, $color-name);\n';
        scss += '}\n\n';
        scss += '@mixin background-color($color-name) {\n';
        scss += '  background-color: map-get($colors, $color-name);\n';
        scss += '}\n';

        return scss;
    }

    generateColorJSON() {
        if (!this.colorPalette?.colorData) return '';

        const colorData = {
            metadata: {
                name: "Style Guide Colors",
                version: "1.0.0",
                generated: new Date().toISOString(),
                totalColors: this.colorPalette.colorData.length
            },
            colors: {}
        };

        this.colorPalette.colorData.forEach(color => {
            const key = Utils.slugify(color.name);
            const rgb = Utils.hexToRgb(color.hex);

            colorData.colors[key] = {
                name: color.name,
                hex: color.hex,
                rgb: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : color.rgb,
                hsl: this.hexToHSL(color.hex),
                accessibility: {
                    contrastWithWhite: Utils.getContrastRatio(color.hex, '#ffffff'),
                    contrastWithBlack: Utils.getContrastRatio(color.hex, '#000000'),
                    recommendedTextColor: color.textColor
                }
            };
        });

        return JSON.stringify(colorData, null, 2);
    }

    generateColorJS() {
        if (!this.colorPalette?.colorData) return '';

        let js = 'export const colors = {\n';
        this.colorPalette.colorData.forEach((color, index) => {
            const key = Utils.slugify(color.name).replace(/-/g, '_').toUpperCase();
            js += `  ${key}: {\n`;
            js += `    name: '${color.name}',\n`;
            js += `    hex: '${color.hex}',\n`;
            js += `    rgb: '${color.rgb}',\n`;
            js += `    textColor: '${color.textColor}'\n`;
            js += `  }`;
            js += index < this.colorPalette.colorData.length - 1 ? ',\n' : '\n';
        });
        js += '};\n\n';

        // Add utility functions
        js += 'export const getColor = (colorName) => {\n';
        js += '  const key = colorName.toUpperCase().replace(/[^A-Z0-9]/g, \'_\');\n';
        js += '  return colors[key] || null;\n';
        js += '};\n\n';

        js += 'export const getAllColors = () => Object.values(colors);\n';

        return js;
    }

    generateFontCSS() {
        if (!this.fontShowcase?.fontData) return '';

        let css = '/* Font Face Declarations */\n';
        css += '@import url(\'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&family=Lato:wght@100;300;400;700;900&display=swap\');\n\n';

        css += '/* Font Variables */\n:root {\n';
        this.fontShowcase.fontData.forEach(font => {
            css += `  --font-${Utils.slugify(font.name)}: '${font.name}', sans-serif;\n`;
        });
        css += '}\n\n';

        css += '/* Font Classes */\n';
        this.fontShowcase.fontData.forEach(font => {
            const className = Utils.slugify(font.name);
            css += `.font-${className} {\n`;
            css += `  font-family: var(--font-${className});\n`;
            css += `}\n\n`;
        });

        // Add responsive typography
        css += '/* Responsive Typography */\n';
        css += '@media (max-width: 768px) {\n';
        css += '  .font-large { font-size: 1.2em; }\n';
        css += '  .font-medium { font-size: 1em; }\n';
        css += '  .font-small { font-size: 0.9em; }\n';
        css += '}\n';

        return css;
    }

    generateFontSCSS() {
        if (!this.fontShowcase?.fontData) return '';

        let scss = '// Font Variables\n';
        this.fontShowcase.fontData.forEach(font => {
            scss += `$font-${Utils.slugify(font.name)}: '${font.name}', sans-serif;\n`;
        });

        scss += '\n// Font Map\n$fonts: (\n';
        this.fontShowcase.fontData.forEach((font, index) => {
            const varName = Utils.slugify(font.name);
            scss += `  "${varName}": $font-${varName}`;
            scss += index < this.fontShowcase.fontData.length - 1 ? ',\n' : '\n';
        });
        scss += ');\n\n';

        // Add mixins
        scss += '// Font Mixins\n';
        scss += '@mixin font-family($font-name) {\n';
        scss += '  font-family: map-get($fonts, $font-name);\n';
        scss += '}\n\n';

        scss += '@mixin responsive-font($base-size: 16px, $scale: 1.2) {\n';
        scss += '  font-size: $base-size;\n';
        scss += '  @media (max-width: 768px) {\n';
        scss += '    font-size: $base-size / $scale;\n';
        scss += '  }\n';
        scss += '}\n';

        return scss;
    }

    generateFontJSON() {
        if (!this.fontShowcase?.fontData) return '';

        const fontData = {
            metadata: {
                name: "Style Guide Fonts",
                version: "1.0.0",
                generated: new Date().toISOString(),
                totalFonts: this.fontShowcase.fontData.length
            },
            fonts: {}
        };

        this.fontShowcase.fontData.forEach(font => {
            const key = Utils.slugify(font.name);
            fontData.fonts[key] = {
                name: font.name,
                className: font.className,
                family: `'${font.name}', sans-serif`,
                weights: font.variableWeight ? [100, 200, 300, 400, 500, 600, 700, 800, 900] : [300, 400, 700],
                preview: font.preview,
                googleFontsUrl: this.getGoogleFontsUrl(font.name)
            };
        });

        return JSON.stringify(fontData, null, 2);
    }

    generateFontJS() {
        if (!this.fontShowcase?.fontData) return '';

        let js = 'export const fonts = {\n';
        this.fontShowcase.fontData.forEach((font, index) => {
            const key = Utils.slugify(font.name).replace(/-/g, '_').toUpperCase();
            js += `  ${key}: {\n`;
            js += `    name: '${font.name}',\n`;
            js += `    className: '${font.className}',\n`;
            js += `    family: '${font.name}, sans-serif',\n`;
            js += `    preview: '${font.preview}'\n`;
            js += `  }`;
            js += index < this.fontShowcase.fontData.length - 1 ? ',\n' : '\n';
        });
        js += '};\n\n';

        js += 'export const loadGoogleFonts = () => {\n';
        js += '  const link = document.createElement(\'link\');\n';
        js += '  link.href = \'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&family=Lato:wght@100;300;400;700;900&display=swap\';\n';
        js += '  link.rel = \'stylesheet\';\n';
        js += '  document.head.appendChild(link);\n';
        js += '};\n';

        return js;
    }

    createTabbedExport(title, formats) {
        let html = `<div class="export-tabs">\n`;

        // Tab buttons
        html += '<div class="tab-buttons">\n';
        Object.keys(formats).forEach((format, index) => {
            const active = index === 0 ? ' active' : '';
            html += `<button class="tab-btn${active}" data-tab="${format}">${format.toUpperCase()}</button>\n`;
        });
        html += '</div>\n\n';

        // Tab content
        Object.entries(formats).forEach(([format, code], index) => {
            const active = index === 0 ? ' active' : '';
            html += `<div class="tab-content${active}" data-tab="${format}">\n${code}\n</div>\n\n`;
        });

        html += '</div>';

        // Store first format as current code for copying
        this.currentCode = Object.values(formats)[0];

        return html;
    }

    showModal(title, code) {
        const modalTitle = document.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = title;
        }

        this.codeContainer.innerHTML = code;
        this.modal.classList.add('show');
        document.body.classList.add('no-scroll');

        // Add tab functionality
        this.initializeTabs();

        // Focus management
        const firstFocusable = this.modal.querySelector('.tab-btn, .btn-primary, .btn-secondary');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    initializeTabs() {
        const tabBtns = this.modal.querySelectorAll('.tab-btn');
        const tabContents = this.modal.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;

                // Update active states
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const content = this.modal.querySelector(`[data-tab="${tab}"].tab-content`);
                if (content) {
                    content.classList.add('active');
                    this.currentCode = content.textContent;
                }
            });
        });
    }

    closeModal() {
        this.modal.classList.remove('show');
        document.body.classList.remove('no-scroll');
        this.currentCode = '';
    }

    async copyCode() {
        if (!this.currentCode) {
            SnackbarController.error('No code to copy');
            return;
        }

        const success = await Utils.copyToClipboard(this.currentCode);
        if (success) {
            this.closeModal();
        }
    }

    // Helper methods
    hexToHSL(hex) {
        const rgb = Utils.hexToRgb(hex);
        if (!rgb) return null;

        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }

    getGoogleFontsUrl(fontName) {
        const encodedName = encodeURIComponent(fontName);
        return `https://fonts.google.com/specimen/${encodedName.replace(/\s+/g, '+')}`;
    }
}
