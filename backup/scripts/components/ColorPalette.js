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

        // Add interactions
        this.addColorItemInteractions(colorItem, color);

        return colorItem;
    }

    createColorSwatch(color) {
        const colorSwatch = Utils.createElement('div', 'color-swatch', color.hex);
        colorSwatch.style.backgroundColor = color.hex;
        colorSwatch.style.color = color.textColor;

        if (color.textColor === '#fff') {
            colorSwatch.style.textShadow = 'none';
        }

        // Add hover overlay
        const overlay = Utils.createElement('div', 'color-overlay');
        overlay.innerHTML = `
            <span class="material-icons-outlined">content_copy</span>
            <span>Click to copy</span>
        `;
        colorSwatch.appendChild(overlay);

        return colorSwatch;
    }

    createColorInfo(color) {
        const colorInfo = Utils.createElement('div', 'color-info');

        // Name and copy button row
        const nameRow = Utils.createElement('div', 'color-details');
        const colorName = Utils.createElement('div', 'color-name', color.name);
        const copyBtn = this.createCopyButton(color.hex);

        nameRow.appendChild(colorName);
        nameRow.appendChild(copyBtn);

        // Color values row
        const detailsRow = Utils.createElement('div', 'color-details');
        const colorHex = Utils.createElement('div', 'color-hex', color.hex);
        const colorRgb = Utils.createElement('div', 'color-rgb', color.rgb);

        detailsRow.appendChild(colorHex);
        detailsRow.appendChild(colorRgb);

        // Accessibility rating
        const accessibilityRating = this.createAccessibilityRating(color);

        // Additional color info
        const additionalInfo = this.createAdditionalColorInfo(color);

        colorInfo.appendChild(nameRow);
        colorInfo.appendChild(detailsRow);
        colorInfo.appendChild(accessibilityRating);
        colorInfo.appendChild(additionalInfo);

        return colorInfo;
    }

    createCopyButton(hex) {
        const copyBtn = Utils.createElement('button', 'copy-btn');
        copyBtn.innerHTML = '<span class="material-icons-outlined">content_copy</span>';
        copyBtn.title = `Copy ${hex}`;
        copyBtn.setAttribute('aria-label', `Copy color ${hex} to clipboard`);

        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.copyColor(hex, copyBtn);
        });

        return copyBtn;
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

    createAdditionalColorInfo(color) {
        const rgb = Utils.hexToRgb(color.hex);
        const hsl = this.hexToHSL(color.hex);

        const additionalInfo = Utils.createElement('div', 'additional-color-info');
        additionalInfo.innerHTML = `
            <div class="color-formats">
                <div class="color-format">
                    <label>HSL:</label>
                    <span class="format-value">${hsl}</span>
                </div>
                <div class="color-actions">
                    <button class="action-btn" data-action="edit" title="Edit color">
                        <span class="material-icons-outlined">edit</span>
                    </button>
                    <button class="action-btn" data-action="variations" title="Show variations">
                        <span class="material-icons-outlined">tune</span>
                    </button>
                    ${color.editable ? `
                        <button class="action-btn danger" data-action="delete" title="Delete color">
                            <span class="material-icons-outlined">delete</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        // Add action button listeners
        const actionBtns = additionalInfo.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleColorAction(btn.dataset.action, color);
            });
        });

        return additionalInfo;
    }

    addColorItemInteractions(colorItem, color) {
        // Main click to copy
        colorItem.addEventListener('click', () => {
            this.copyColor(color.hex);
        });

        // Keyboard support
        colorItem.setAttribute('tabindex', '0');
        colorItem.setAttribute('role', 'button');
        colorItem.setAttribute('aria-label', `${color.name} color, ${color.hex}. Press Enter to copy.`);

        colorItem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.copyColor(color.hex);
            }
        });

        // Enhanced hover effects
        colorItem.addEventListener('mouseenter', () => {
            this.showColorPreview(color, colorItem);
        });

        colorItem.addEventListener('mouseleave', () => {
            this.hideColorPreview();
        });
    }

    showColorPreview(color, element) {
        // Create or update color preview tooltip
        let tooltip = document.getElementById('color-preview-tooltip');
        if (!tooltip) {
            tooltip = Utils.createElement('div', 'color-preview-tooltip');
            tooltip.id = 'color-preview-tooltip';
            document.body.appendChild(tooltip);
        }

        const rgb = Utils.hexToRgb(color.hex);
        const hsl = this.hexToHSL(color.hex);

        tooltip.innerHTML = `
            <div class="tooltip-color" style="background: ${color.hex}; color: ${color.textColor};"></div>
            <div class="tooltip-info">
                <strong>${color.name}</strong>
                <div>HEX: ${color.hex}</div>
                <div>RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})</div>
                <div>HSL: ${hsl}</div>
            </div>
        `;

        // Position tooltip
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // Adjust if tooltip would go off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.classList.add('show');
    }

    hideColorPreview() {
        const tooltip = document.getElementById('color-preview-tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    }

    async copyColor(hex, button = null) {
        const success = await Utils.copyToClipboard(hex);

        if (success && button) {
            // Visual feedback for copy button
            const originalHTML = button.innerHTML;
            button.innerHTML = '<span class="material-icons-outlined">check</span>';
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
            }, 1000);
        }
    }

    handleColorAction(action, color) {
        switch (action) {
            case 'edit':
                this.editColor(color);
                break;
            case 'variations':
                this.showColorVariations(color);
                break;
            case 'delete':
                this.deleteColor(color);
                break;
        }
    }

    editColor(color) {
        const newName = prompt('Enter new color name:', color.name);
        const newHex = prompt('Enter new hex color:', color.hex);

        if (newName && newHex && Utils.isValidHexColor(newHex)) {
            const rgb = Utils.hexToRgb(newHex);
            const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            const textColor = Utils.getContrastRatio(newHex, '#000000') > Utils.getContrastRatio(newHex, '#ffffff') ? '#000' : '#fff';

            // Update color data
            Object.assign(color, {
                name: newName,
                hex: newHex,
                rgb: rgbString,
                textColor: textColor
            });

            this.render();
            SnackbarController.success(`Updated ${newName}!`);
        } else if (newName || newHex) {
            SnackbarController.error('Invalid color format. Please use #RRGGBB format.');
        }
    }

    showColorVariations(color) {
        // This could open a modal with color variations
        SnackbarController.info(`Showing variations for ${color.name} - Feature coming soon!`);
    }

    deleteColor(color) {
        if (!color.editable) {
            SnackbarController.error('This color cannot be deleted');
            return;
        }

        if (confirm(`Are you sure you want to delete ${color.name}?`)) {
            const index = this.colorData.findIndex(c => c.hex === color.hex && c.name === color.name);
            if (index > -1) {
                this.colorData.splice(index, 1);
                this.render();
                SnackbarController.success(`Deleted ${color.name}`);
            }
        }
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
