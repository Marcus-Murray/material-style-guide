class ColorPalette {
    constructor(containerId, colorData) {
        this.container = document.getElementById(containerId);
        this.colorData = [...colorData];
        this.originalColorData = [...colorData];
        this.searchTerm = '';
        this.filteredData = [...colorData];
    }

    render() {
        this.container.innerHTML = '';
        this.filteredData = this.filterColors();

        if (this.filteredData.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.filteredData.forEach((color, index) => {
            const colorItem = this.createColorItem(color, index);
            this.container.appendChild(colorItem);
        });

        // Re-initialize ripple effects for new elements
        setTimeout(() => {
            this.initializeRippleEffects();
        }, 100);
    }

    renderEmptyState() {
        const emptyState = Utils.createElement('div', 'empty-state');
        emptyState.innerHTML = `
            <div class="empty-state-content">
                <span class="material-icons-outlined empty-icon">palette</span>
                <h3>No colors found</h3>
                <p>Try adjusting your search or add a new color</p>
            </div>
        `;
        this.container.appendChild(emptyState);
    }

    filterColors() {
        if (!this.searchTerm) return this.colorData;

        const term = this.searchTerm.toLowerCase();
        return this.colorData.filter(color =>
            color.name.toLowerCase().includes(term) ||
            color.hex.toLowerCase().includes(term) ||
            color.rgb.toLowerCase().includes(term)
        );
    }

    createColorItem(color, index) {
        const colorItem = Utils.createElement('div', 'color-item');
        colorItem.style.animationDelay = `${index * 50}ms`;
        colorItem.setAttribute('data-color-hex', color.hex);
        colorItem.setAttribute('data-color-name', color.name);

        const colorSwatch = this.createColorSwatch(color);
        const colorInfo = this.createColorInfo(color);

        colorItem.appendChild(colorSwatch);
        colorItem.appendChild(colorInfo);

        return colorItem;
    }

    createColorSwatch(color) {
        const colorSwatch = Utils.createElement('div', 'color-swatch', color.hex);
        colorSwatch.style.backgroundColor = color.hex;
        colorSwatch.style.color = color.textColor;

        if (color.textColor === '#fff') {
            colorSwatch.style.textShadow = 'none';
        }

        return colorSwatch;
    }

    createColorInfo(color) {
        const colorInfo = Utils.createElement('div', 'color-info');

        // Color name
        const colorName = Utils.createElement('div', 'color-name', color.name);

        // Only show hex value
        const colorHex = Utils.createElement('div', 'color-hex', color.hex);

        // Accessibility rating (keep this for good UX)
        const accessibilityRating = this.createAccessibilityRating(color);

        colorInfo.appendChild(colorName);
        colorInfo.appendChild(colorHex);
        colorInfo.appendChild(accessibilityRating);

        return colorInfo;
    }

    createAccessibilityRating(color) {
        const whiteContrast = Utils.getContrastRatio(color.hex, '#ffffff');
        const blackContrast = Utils.getContrastRatio(color.hex, '#000000');
        const bestContrast = Math.max(whiteContrast, blackContrast);

        let rating, ratingClass, ratingText;
        if (bestContrast >= 7) {
            rating = 'AAA';
            ratingClass = 'rating-aaa';
            ratingText = 'Excellent';
        } else if (bestContrast >= 4.5) {
            rating = 'AA';
            ratingClass = 'rating-aa';
            ratingText = 'Good';
        } else {
            rating = 'FAIL';
            ratingClass = 'rating-fail';
            ratingText = 'Poor';
        }

        const ratingDiv = Utils.createElement('div', 'accessibility-rating');
        ratingDiv.innerHTML = `
            <span class="material-icons-outlined">accessibility</span>
            <span class="${ratingClass}">${rating}</span>
            <span>${ratingText}</span>
            <span class="contrast-ratio">${bestContrast.toFixed(1)}:1</span>
        `;
        ratingDiv.title = `Accessibility rating: ${rating} (${bestContrast.toFixed(1)}:1 contrast ratio)`;

        return ratingDiv;
    }

    search(term) {
        this.searchTerm = term;
        this.render();
    }

    addColor(color) {
        this.colorData.push({
            ...color,
            editable: true
        });
        this.render();

        // Scroll to new color
        setTimeout(() => {
            const newColorItem = this.container.querySelector(`[data-color-hex="${color.hex}"]`);
            if (newColorItem) {
                newColorItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                newColorItem.classList.add('highlight-new');
                setTimeout(() => newColorItem.classList.remove('highlight-new'), 2000);
            }
        }, 100);
    }

    initializeRippleEffects() {
        const colorItems = this.container.querySelectorAll('.color-item');
        colorItems.forEach(item => {
            if (!item.hasAttribute('data-ripple-initialized')) {
                item.setAttribute('data-ripple-initialized', 'true');
                item.addEventListener('click', this.createRippleEffect);
            }
        });
    }

    createRippleEffect(e) {
        const ripple = document.createElement('div');
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(103, 80, 164, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;

        e.currentTarget.style.position = 'relative';
        e.currentTarget.style.overflow = 'hidden';
        e.currentTarget.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }

    exportCSS() {
        let css = ':root {\n';
        this.colorData.forEach(color => {
            const varName = Utils.slugify(color.name);
            css += `  --color-${varName}: ${color.hex};\n`;
            const rgb = Utils.hexToRgb(color.hex);
            if (rgb) {
                css += `  --color-${varName}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n`;
            }
        });
        css += '}';
        return css;
    }

    getColorCount() {
        return this.colorData.length;
    }

    getFilteredCount() {
        return this.filteredData.length;
    }

    resetColors() {
        this.colorData = [...this.originalColorData];
        this.searchTerm = '';
        this.render();
        SnackbarController.info('Colors reset to original set');
    }

    // Helper method for HSL conversion
    hexToHSL(hex) {
        const rgb = Utils.hexToRgb(hex);
        if (!rgb) return 'hsl(0, 0%, 0%)';

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
}
