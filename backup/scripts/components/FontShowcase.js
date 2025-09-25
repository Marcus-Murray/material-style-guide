class FontShowcase {
    constructor(containerId, fontData) {
        this.container = document.getElementById(containerId);
        this.fontData = [...fontData];
        this.originalFontData = [...fontData];
        this.currentWeight = 400;
        this.currentSize = 16;
        this.searchTerm = '';
        this.activePresets = new Set();
    }

    render() {
        this.container.innerHTML = '';

        const filteredData = this.filterFonts();

        if (filteredData.length === 0) {
            this.renderEmptyState();
            return;
        }

        filteredData.forEach((font, index) => {
            const fontCard = this.createFontCard(font, index);
            this.container.appendChild(fontCard);
        });

        // Re-initialize interactions for new elements
        setTimeout(() => {
            this.initializeFontInteractions();
        }, 100);
    }

    renderEmptyState() {
        const emptyState = Utils.createElement('div', 'empty-state');
        emptyState.innerHTML = `
            <div class="empty-state-content">
                <span class="material-icons-outlined empty-icon">text_fields</span>
                <h3>No fonts found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        `;
        this.container.appendChild(emptyState);
    }

    filterFonts() {
        if (!this.searchTerm) return this.fontData;

        const term = this.searchTerm.toLowerCase();
        return this.fontData.filter(font =>
            font.name.toLowerCase().includes(term) ||
            font.className.toLowerCase().includes(term) ||
            font.preview.toLowerCase().includes(term)
        );
    }

    createFontCard(font, index) {
        const fontCard = Utils.createElement('div', `font-card ${font.className}`);
        fontCard.style.animationDelay = `${index * 100}ms`;
        fontCard.setAttribute('data-font-name', font.name);

        const header = this.createFontHeader(font);
        const previews = this.createFontPreviews(font);
        const controls = this.createFontControls(font);
        const metrics = this.createFontMetrics(font);

        fontCard.appendChild(header);
        fontCard.appendChild(previews);
        fontCard.appendChild(controls);
        fontCard.appendChild(metrics);

        // Add interactions
        this.addFontCardInteractions(fontCard, font);

        return fontCard;
    }

    createFontHeader(font) {
        const header = Utils.createElement('div', 'font-header');

        const nameSection = Utils.createElement('div', 'font-name-section');
        const fontName = Utils.createElement('h3', 'font-name', font.name);
        const fontMeta = Utils.createElement('div', 'font-meta');

        // Font classification
        const fontType = this.getFontType(font.name);
        const weightRange = this.getWeightRange(font);

        fontMeta.innerHTML = `
            <span class="font-type">${fontType}</span>
            <span class="weight-range">${weightRange}</span>
            <span class="font-status">${this.getFontStatus(font)}</span>
        `;

        nameSection.appendChild(fontName);
        nameSection.appendChild(fontMeta);

        const actions = Utils.createElement('div', 'font-actions');
        actions.innerHTML = `
            <button class="action-btn" data-action="favorite" title="Add to favorites">
                <span class="material-icons-outlined">favorite_border</span>
            </button>
            <button class="action-btn" data-action="compare" title="Compare fonts">
                <span class="material-icons-outlined">compare_arrows</span>
            </button>
            <button class="action-btn" data-action="download" title="Get font info">
                <span class="material-icons-outlined">info</span>
            </button>
        `;

        header.appendChild(nameSection);
        header.appendChild(actions);

        return header;
    }

    createFontPreviews(font) {
        const previewsContainer = Utils.createElement('div', 'font-previews');

        const weights = [
            { class: 'normal', weight: this.currentWeight, label: `${this.currentWeight} Weight` },
            { class: 'bold', weight: 700, label: 'Bold (700)' },
            { class: 'italic', weight: this.currentWeight, label: `${this.currentWeight} Italic` }
        ];

        weights.forEach(weightInfo => {
            const previewWrapper = Utils.createElement('div', 'preview-wrapper');

            const label = Utils.createElement('div', 'preview-label', weightInfo.label);
            const preview = Utils.createElement('div', `font-preview ${weightInfo.class}`, font.preview);

            preview.style.fontWeight = weightInfo.weight;
            preview.style.fontSize = this.currentSize + 'px';
            preview.contentEditable = true;
            preview.setAttribute('data-original', font.preview);

            if (weightInfo.class === 'italic') {
                preview.style.fontStyle = 'italic';
            }

            // Add edit functionality
            preview.addEventListener('blur', () => {
                if (preview.textContent.trim() === '') {
                    preview.textContent = font.preview;
                }
            });

            preview.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    preview.blur();
                }
            });

            previewWrapper.appendChild(label);
            previewWrapper.appendChild(preview);
            previewsContainer.appendChild(previewWrapper);
        });

        return previewsContainer;
    }

    createFontControls(font) {
        const controls = Utils.createElement('div', 'font-card-controls');

        controls.innerHTML = `
            <div class="size-control">
                <label>Size: <span class="size-display">${this.currentSize}px</span></label>
                <input type="range" class="size-slider" min="12" max="72" value="${this.currentSize}">
            </div>
            <div class="weight-control">
                <label>Weight: <span class="weight-display">${this.currentWeight}</span></label>
                <input type="range" class="weight-slider" min="100" max="900" step="100" value="${this.currentWeight}">
            </div>
            <div class="preset-controls">
                <button class="preset-btn" data-preset="heading">Heading</button>
                <button class="preset-btn" data-preset="body">Body</button>
                <button class="preset-btn" data-preset="caption">Caption</button>
            </div>
        `;

        // Add control listeners
        this.addControlListeners(controls, font);

        return controls;
    }

    createFontMetrics(font) {
        const metrics = Utils.createElement('div', 'font-metrics');

        const readabilityScore = this.calculateReadabilityScore(font);
        const characterCount = this.getCharacterSupport(font);
        const loadingTime = this.estimateLoadingTime(font);

        metrics.innerHTML = `
            <div class="metric-item">
                <span class="metric-label">Readability</span>
                <div class="metric-value">
                    <div class="readability-bar">
                        <div class="readability-fill" style="width: ${readabilityScore}%"></div>
                    </div>
                    <span>${readabilityScore}%</span>
                </div>
            </div>
            <div class="metric-item">
                <span class="metric-label">Characters</span>
                <span class="metric-value">${characterCount}+ chars</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Load Time</span>
                <span class="metric-value">${loadingTime}ms</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Usage</span>
                <span class="metric-value">${this.getUsageRecommendation(font)}</span>
            </div>
        `;

        return metrics;
    }

    addFontCardInteractions(fontCard, font) {
        // Action button handlers
        const actionBtns = fontCard.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleFontAction(btn.dataset.action, font, btn);
            });
        });

        // Keyboard navigation
        fontCard.setAttribute('tabindex', '0');
        fontCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.showFontDetails(font);
            }
        });

        // Double-click to show details
        fontCard.addEventListener('dblclick', () => {
            this.showFontDetails(font);
        });

        // Hover effects for accessibility
        fontCard.addEventListener('mouseenter', () => {
            this.showFontTooltip(font, fontCard);
        });

        fontCard.addEventListener('mouseleave', () => {
            this.hideFontTooltip();
        });
    }

    addControlListeners(controls, font) {
        const sizeSlider = controls.querySelector('.size-slider');
        const weightSlider = controls.querySelector('.weight-slider');
        const sizeDisplay = controls.querySelector('.size-display');
        const weightDisplay = controls.querySelector('.weight-display');
        const presetBtns = controls.querySelectorAll('.preset-btn');

        // Size control
        sizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            sizeDisplay.textContent = size + 'px';
            this.updateFontPreview(controls.closest('.font-card'), { size });
        });

        // Weight control
        weightSlider.addEventListener('input', (e) => {
            const weight = parseInt(e.target.value);
            weightDisplay.textContent = weight;
            this.updateFontPreview(controls.closest('.font-card'), { weight });
        });

        // Preset buttons
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyFontPreset(btn.dataset.preset, controls.closest('.font-card'));

                // Visual feedback
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    updateFontPreview(fontCard, changes) {
        const previews = fontCard.querySelectorAll('.font-preview');

        previews.forEach(preview => {
            if (changes.size) {
                preview.style.fontSize = changes.size + 'px';
            }
            if (changes.weight && !preview.classList.contains('bold')) {
                preview.style.fontWeight = changes.weight;
            }
            if (changes.letterSpacing) {
                preview.style.letterSpacing = changes.letterSpacing + 'px';
            }
            if (changes.lineHeight) {
                preview.style.lineHeight = changes.lineHeight;
            }
        });
    }

    applyFontPreset(preset, fontCard) {
        const presets = {
            heading: { size: 32, weight: 600, letterSpacing: -0.5, lineHeight: 1.2 },
            body: { size: 16, weight: 400, letterSpacing: 0, lineHeight: 1.6 },
            caption: { size: 12, weight: 400, letterSpacing: 0.5, lineHeight: 1.4 }
        };

        const config = presets[preset];
        if (config) {
            this.updateFontPreview(fontCard, config);

            // Update controls
            const sizeSlider = fontCard.querySelector('.size-slider');
            const weightSlider = fontCard.querySelector('.weight-slider');
            const sizeDisplay = fontCard.querySelector('.size-display');
            const weightDisplay = fontCard.querySelector('.weight-display');

            if (sizeSlider) {
                sizeSlider.value = config.size;
                sizeDisplay.textContent = config.size + 'px';
            }

            if (weightSlider) {
                weightSlider.value = config.weight;
                weightDisplay.textContent = config.weight;
            }

            SnackbarController.success(`Applied ${preset} preset`);
        }
    }

    handleFontAction(action, font, button) {
        switch (action) {
            case 'favorite':
                this.toggleFavorite(font, button);
                break;
            case 'compare':
                this.addToComparison(font);
                break;
            case 'download':
                this.showFontInfo(font);
                break;
        }
    }

    toggleFavorite(font, button) {
        const icon = button.querySelector('.material-icons-outlined');
        const isFavorite = icon.textContent === 'favorite';

        if (isFavorite) {
            icon.textContent = 'favorite_border';
            button.title = 'Add to favorites';
            SnackbarController.info(`Removed ${font.name} from favorites`);
        } else {
            icon.textContent = 'favorite';
            button.title = 'Remove from favorites';
            SnackbarController.success(`Added ${font.name} to favorites`);
        }
    }

    addToComparison(font) {
        // This could open a comparison view
        SnackbarController.info(`Added ${font.name} to comparison - Feature coming soon!`);
    }

    showFontInfo(font) {
        const info = `
Font: ${font.name}
Class: ${font.className}
Type: ${this.getFontType(font.name)}
Weights: ${this.getWeightRange(font)}
Best for: ${this.getUsageRecommendation(font)}
Google Fonts: https://fonts.google.com/specimen/${font.name.replace(/\s+/g, '+')}
        `;

        alert(info); // Could be replaced with a proper modal
    }

    showFontDetails(font) {
        // This could open a detailed modal with font specimen
        SnackbarController.info(`Font details for ${font.name} - Feature coming soon!`);
    }

    showFontTooltip(font, element) {
        let tooltip = document.getElementById('font-tooltip');
        if (!tooltip) {
            tooltip = Utils.createElement('div', 'font-tooltip');
            tooltip.id = 'font-tooltip';
            document.body.appendChild(tooltip);
        }

        tooltip.innerHTML = `
            <strong>${font.name}</strong>
            <div>Type: ${this.getFontType(font.name)}</div>
            <div>Best for: ${this.getUsageRecommendation(font)}</div>
            <div class="tooltip-sample" style="font-family: ${font.name};">
                The quick brown fox jumps over the lazy dog.
            </div>
        `;

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top - 10) + 'px';
        tooltip.classList.add('show');
    }

    hideFontTooltip() {
        const tooltip = document.getElementById('font-tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    }

    updateWeights(weight, size) {
        this.currentWeight = weight;
        this.currentSize = size;
        this.render();
    }

    search(term) {
        this.searchTerm = term;
        this.render();
    }

    exportCSS() {
        let css = '/* Font Families */\n';
        css += '@import url(\'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&family=Lato:wght@100;300;400;700;900&display=swap\');\n\n';

        this.fontData.forEach(font => {
            const className = Utils.slugify(font.name);
            css += `.${className} {\n`;
            css += `  font-family: '${font.name}', sans-serif;\n`;
            css += `  font-weight: ${this.currentWeight};\n`;
            css += `  font-size: ${this.currentSize}px;\n`;
            css += '}\n\n';
        });

        return css;
    }

    initializeFontInteractions() {
        const fontCards = this.container.querySelectorAll('.font-card');
        fontCards.forEach(card => {
            if (!card.hasAttribute('data-interactions-initialized')) {
                card.setAttribute('data-interactions-initialized', 'true');
                card.addEventListener('click', this.createRippleEffect);
            }
        });
    }

    createRippleEffect(e) {
        if (e.target.closest('.action-btn') || e.target.closest('.font-card-controls')) {
            return; // Don't add ripple to action buttons or controls
        }

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

    // Helper methods
    getFontType(fontName) {
        const serifFonts = ['Merriweather', 'Times', 'Georgia', 'Serif'];
        const monoFonts = ['Courier', 'Monaco', 'Consolas', 'Mono'];

        if (serifFonts.some(serif => fontName.includes(serif))) return 'Serif';
        if (monoFonts.some(mono => fontName.includes(mono))) return 'Monospace';
        return 'Sans-serif';
    }

    getWeightRange(font) {
        if (font.variableWeight) return '100-900';
        return '300, 400, 700';
    }

    getFontStatus(font) {
        return 'Google Fonts';
    }

    calculateReadabilityScore(font) {
        // Simplified readability calculation
        const baseScore = 75;
        const fontType = this.getFontType(font.name);

        if (fontType === 'Sans-serif') return Math.min(95, baseScore + 15);
        if (fontType === 'Serif') return Math.min(90, baseScore + 10);
        return Math.min(85, baseScore + 5);
    }

    getCharacterSupport(font) {
        // Estimated character support
        const supportMap = {
            'Roboto': 800,
            'Raleway': 600,
            'Merriweather': 400,
            'Lato': 700
        };

        return supportMap[font.name] || 500;
    }

    estimateLoadingTime(font) {
        // Estimated loading time in ms
        return Math.floor(Math.random() * 200) + 100;
    }

    getUsageRecommendation(font) {
        const recommendations = {
            'Roboto': 'UI & Body Text',
            'Raleway': 'Headings & Titles',
            'Merriweather': 'Long-form Reading',
            'Lato': 'Versatile Display'
        };

        return recommendations[font.name] || 'General Purpose';
    }
}
