class TypographyShowcase {
    constructor(containerId, typographyData) {
        this.container = document.getElementById(containerId);
        this.typographyData = [...typographyData];
        this.originalData = [...typographyData];
        this.isEditMode = false;
        this.changes = new Map();
        this.undoStack = [];
        this.redoStack = [];
    }

    render() {
        this.container.innerHTML = '';

        // Add typography controls
        const controls = this.createTypographyControls();
        this.container.appendChild(controls);

        // Add typography examples
        const examplesContainer = Utils.createElement('div', 'typography-examples');

        this.typographyData.forEach((item, index) => {
            const element = this.createTypographyElement(item, index);
            examplesContainer.appendChild(element);
        });

        // Add interactive elements
        this.addBodyTextExample(examplesContainer);
        this.addLinkExample(examplesContainer);
        this.addAdvancedExamples(examplesContainer);

        this.container.appendChild(examplesContainer);

        // Initialize interactions
        setTimeout(() => {
            this.initializeTypographyInteractions();
        }, 100);
    }

    createTypographyControls() {
        const controls = Utils.createElement('div', 'typography-controls');

        controls.innerHTML = `
            <div class="control-group">
                <div class="control-section">
                    <button class="control-btn ${this.isEditMode ? 'active' : ''}" id="edit-mode-toggle">
                        <span class="material-icons-outlined">edit</span>
                        ${this.isEditMode ? 'Exit Edit' : 'Edit Mode'}
                    </button>
                    <button class="control-btn" id="reset-typography">
                        <span class="material-icons-outlined">refresh</span>
                        Reset
                    </button>
                </div>

                <div class="control-section">
                    <button class="control-btn" id="undo-changes" ${this.undoStack.length === 0 ? 'disabled' : ''}>
                        <span class="material-icons-outlined">undo</span>
                        Undo
                    </button>
                    <button class="control-btn" id="redo-changes" ${this.redoStack.length === 0 ? 'disabled' : ''}>
                        <span class="material-icons-outlined">redo</span>
                        Redo
                    </button>
                </div>

                <div class="control-section">
                    <div class="scale-control">
                        <label>Scale: <span id="scale-value">100%</span></label>
                        <input type="range" id="typography-scale" min="50" max="200" value="100" step="10">
                    </div>
                </div>
            </div>

            <div class="typography-info">
                <div class="info-item">
                    <span class="info-label">Type Scale:</span>
                    <span class="info-value">Material Design 3</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Base Size:</span>
                    <span class="info-value">16px</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Line Height:</span>
                    <span class="info-value">1.5</span>
                </div>
            </div>
        `;

        // Add control event listeners
        this.addControlEventListeners(controls);

        return controls;
    }

    createTypographyElement(item, index) {
        const wrapper = Utils.createElement('div', 'typography-item-wrapper reveal');
        wrapper.style.animationDelay = `${index * 100}ms`;

        const element = Utils.createElement(item.tag, `${item.className} typography-item`, item.text);
        element.setAttribute('data-original-text', item.text);
        element.setAttribute('data-typography-level', item.className);
        element.setAttribute('data-index', index);

        // Add editing capabilities
        if (item.editable) {
            this.makeElementEditable(element, item);
        }

        // Add typography metrics
        const metrics = this.createTypographyMetrics(item);

        wrapper.appendChild(element);
        wrapper.appendChild(metrics);

        return wrapper;
    }

    makeElementEditable(element, item) {
        element.setAttribute('data-editable', 'true');

        // Add edit indicator
        const editIndicator = Utils.createElement('div', 'edit-indicator');
        editIndicator.innerHTML = '<span class="material-icons-outlined">edit</span>';
        element.parentNode?.appendChild(editIndicator);

        // Add editing functionality
        element.addEventListener('click', () => {
            if (this.isEditMode) {
                this.startEditing(element, item);
            }
        });

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.isEditMode) {
                e.preventDefault();
                this.stopEditing(element, item);
            } else if (e.key === 'Escape' && this.isEditMode) {
                this.cancelEditing(element, item);
            }
        });
    }

    createTypographyMetrics(item) {
        const metrics = Utils.createElement('div', 'typography-metrics');

        const computedStyle = this.getComputedTypographyStyle(item.className);
        const readabilityScore = this.calculateReadabilityScore(computedStyle);
        const accessibility = this.getAccessibilityInfo(computedStyle);

        metrics.innerHTML = `
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Size</span>
                    <span class="metric-value">${computedStyle.fontSize}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Weight</span>
                    <span class="metric-value">${computedStyle.fontWeight}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Line Height</span>
                    <span class="metric-value">${computedStyle.lineHeight}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Letter Spacing</span>
                    <span class="metric-value">${computedStyle.letterSpacing || 'normal'}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Readability</span>
                    <div class="readability-indicator">
                        <div class="readability-bar">
                            <div class="readability-fill" style="width: ${readabilityScore}%"></div>
                        </div>
                        <span class="readability-score">${readabilityScore}%</span>
                    </div>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Accessibility</span>
                    <span class="accessibility-badge ${accessibility.class}">${accessibility.rating}</span>
                </div>
            </div>
        `;

        return metrics;
    }

    addBodyTextExample(container) {
        const bodyExample = Utils.createElement('div', 'typography-item-wrapper reveal');

        const bodyText = Utils.createElement('p', 'body-text typography-item editable-content',
            'This is body text using the Material Design typography system. It\'s designed to be highly readable and accessible across different devices and screen sizes. The text follows Material Design 3 principles for optimal user experience.');

        bodyText.setAttribute('contenteditable', this.isEditMode);
        bodyText.setAttribute('data-original-text', bodyText.textContent);

        const metrics = this.createBodyTextMetrics();

        bodyExample.appendChild(bodyText);
        bodyExample.appendChild(metrics);
        container.appendChild(bodyExample);
    }

    addLinkExample(container) {
        const linkExample = Utils.createElement('div', 'typography-item-wrapper reveal');

        const linkParagraph = Utils.createElement('p', 'body-text typography-item');
        const link = Utils.createElement('a', 'material-link', 'This is a Material Design link');
        link.href = '#';

        linkParagraph.innerHTML = '';
        linkParagraph.appendChild(link);
        linkParagraph.innerHTML += ' with proper styling and interaction states. ';

        const secondLink = Utils.createElement('a', 'material-link', 'Here\'s another link');
        secondLink.href = '#';
        linkParagraph.appendChild(secondLink);
        linkParagraph.innerHTML += ' to demonstrate link styling.';

        const linkMetrics = this.createLinkMetrics();

        linkExample.appendChild(linkParagraph);
        linkExample.appendChild(linkMetrics);
        container.appendChild(linkExample);
    }

    addAdvancedExamples(container) {
        const advancedSection = Utils.createElement('div', 'advanced-typography-section');

        // Code example
        const codeExample = Utils.createElement('div', 'typography-item-wrapper reveal');
        const codeElement = Utils.createElement('code', 'code-text typography-item',
            'const materialDesign = { version: "3.0", theme: "dynamic" };');
        codeExample.appendChild(codeElement);
        codeExample.appendChild(this.createCodeMetrics());

        // Quote example
        const quoteExample = Utils.createElement('div', 'typography-item-wrapper reveal');
        const quoteElement = Utils.createElement('blockquote', 'quote-text typography-item',
            '"Typography is the craft of endowing human language with a durable visual form."');
        const citation = Utils.createElement('cite', 'quote-citation', '— Robert Bringhurst');
        quoteElement.appendChild(citation);
        quoteExample.appendChild(quoteElement);
        quoteExample.appendChild(this.createQuoteMetrics());

        // List example
        const listExample = Utils.createElement('div', 'typography-item-wrapper reveal');
        const listElement = Utils.createElement('div', 'list-container typography-item');
        listElement.innerHTML = `
            <h4 class="headline-small">Typography Best Practices</h4>
            <ul class="material-list">
                <li>Maintain consistent vertical rhythm</li>
                <li>Use appropriate contrast ratios</li>
                <li>Consider reading distance and context</li>
                <li>Test across different devices</li>
            </ul>
        `;
        listExample.appendChild(listElement);
        listExample.appendChild(this.createListMetrics());

        advancedSection.appendChild(codeExample);
        advancedSection.appendChild(quoteExample);
        advancedSection.appendChild(listExample);

        container.appendChild(advancedSection);
    }

    addControlEventListeners(controls) {
        // Edit mode toggle
        const editToggle = controls.querySelector('#edit-mode-toggle');
        editToggle?.addEventListener('click', () => {
            this.toggleEditMode();
        });

        // Reset button
        const resetBtn = controls.querySelector('#reset-typography');
        resetBtn?.addEventListener('click', () => {
            this.resetTypography();
        });

        // Undo/Redo buttons
        const undoBtn = controls.querySelector('#undo-changes');
        const redoBtn = controls.querySelector('#redo-changes');

        undoBtn?.addEventListener('click', () => this.undo());
        redoBtn?.addEventListener('click', () => this.redo());

        // Scale control
        const scaleSlider = controls.querySelector('#typography-scale');
        const scaleValue = controls.querySelector('#scale-value');

        scaleSlider?.addEventListener('input', (e) => {
            const scale = e.target.value;
            scaleValue.textContent = scale + '%';
            this.applyTypographyScale(scale / 100);
        });
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;

        // Update edit mode UI
        const editToggle = document.querySelector('#edit-mode-toggle');
        if (editToggle) {
            editToggle.classList.toggle('active', this.isEditMode);
            editToggle.innerHTML = `
                <span class="material-icons-outlined">edit</span>
                ${this.isEditMode ? 'Exit Edit' : 'Edit Mode'}
            `;
        }

        // Update editable elements
        const editableElements = this.container.querySelectorAll('[data-editable="true"]');
        editableElements.forEach(element => {
            element.contentEditable = this.isEditMode;
            if (this.isEditMode) {
                element.classList.add('editable-active');
            } else {
                element.classList.remove('editable-active');
                element.blur();
            }
        });

        // Update body text
        const bodyText = this.container.querySelector('.editable-content');
        if (bodyText) {
            bodyText.contentEditable = this.isEditMode;
        }

        SnackbarController.info(this.isEditMode ? 'Edit mode enabled - click text to edit' : 'Edit mode disabled');
    }

    startEditing(element, item) {
        if (!this.isEditMode) return;

        // Save current state for undo
        this.saveState();

        element.contentEditable = true;
        element.focus();
        element.classList.add('editing');

        // Select all text
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        // Add editing toolbar
        this.showEditingToolbar(element);
    }

    stopEditing(element, item) {
        const newText = element.textContent.trim();

        if (newText && newText !== item.text) {
            item.text = newText;
            this.changes.set(element.dataset.index, newText);
        }

        element.contentEditable = false;
        element.classList.remove('editing');
        this.hideEditingToolbar();

        SnackbarController.success('Text updated');
    }

    cancelEditing(element, item) {
        element.textContent = item.text;
        element.contentEditable = false;
        element.classList.remove('editing');
        this.hideEditingToolbar();

        SnackbarController.info('Edit cancelled');
    }

    showEditingToolbar(element) {
        let toolbar = document.getElementById('editing-toolbar');
        if (!toolbar) {
            toolbar = Utils.createElement('div', 'editing-toolbar');
            toolbar.id = 'editing-toolbar';
            toolbar.innerHTML = `
                <button class="toolbar-btn" data-action="bold" title="Bold">
                    <span class="material-icons-outlined">format_bold</span>
                </button>
                <button class="toolbar-btn" data-action="italic" title="Italic">
                    <span class="material-icons-outlined">format_italic</span>
                </button>
                <button class="toolbar-btn" data-action="save" title="Save">
                    <span class="material-icons-outlined">check</span>
                </button>
                <button class="toolbar-btn" data-action="cancel" title="Cancel">
                    <span class="material-icons-outlined">close</span>
                </button>
            `;
            document.body.appendChild(toolbar);

            // Add toolbar event listeners
            toolbar.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]')?.dataset.action;
                if (action) {
                    this.handleToolbarAction(action, element);
                }
            });
        }

        // Position toolbar
        const rect = element.getBoundingClientRect();
        toolbar.style.left = rect.left + 'px';
        toolbar.style.top = (rect.top - toolbar.offsetHeight - 10) + 'px';
        toolbar.classList.add('show');
    }

    hideEditingToolbar() {
        const toolbar = document.getElementById('editing-toolbar');
        if (toolbar) {
            toolbar.classList.remove('show');
        }
    }

    handleToolbarAction(action, element) {
        switch (action) {
            case 'bold':
                document.execCommand('bold');
                break;
            case 'italic':
                document.execCommand('italic');
                break;
            case 'save':
                element.blur();
                break;
            case 'cancel':
                const originalText = element.getAttribute('data-original-text');
                element.textContent = originalText;
                element.blur();
                break;
        }
    }

    applyTypographyScale(scale) {
        const typographyItems = this.container.querySelectorAll('.typography-item');
        typographyItems.forEach(item => {
            const currentFontSize = parseFloat(getComputedStyle(item).fontSize);
            item.style.fontSize = (currentFontSize * scale) + 'px';
        });

        SnackbarController.info(`Typography scaled to ${Math.round(scale * 100)}%`);
    }

    resetTypography() {
        // Reset all text content
        this.typographyData = [...this.originalData];

        // Clear changes
        this.changes.clear();
        this.undoStack = [];
        this.redoStack = [];

        // Reset scale
        const scaleSlider = document.querySelector('#typography-scale');
        const scaleValue = document.querySelector('#scale-value');
        if (scaleSlider && scaleValue) {
            scaleSlider.value = 100;
            scaleValue.textContent = '100%';
        }

        // Re-render
        this.render();

        SnackbarController.success('Typography reset to defaults');
    }

    saveState() {
        const state = {
            typographyData: [...this.typographyData],
            changes: new Map(this.changes)
        };

        this.undoStack.push(state);

        // Limit undo stack size
        if (this.undoStack.length > 20) {
            this.undoStack.shift();
        }

        // Clear redo stack when new change is made
        this.redoStack = [];

        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.undoStack.length === 0) return;

        // Save current state to redo stack
        this.redoStack.push({
            typographyData: [...this.typographyData],
            changes: new Map(this.changes)
        });

        // Restore previous state
        const state = this.undoStack.pop();
        this.typographyData = [...state.typographyData];
        this.changes = new Map(state.changes);

        this.render();
        this.updateUndoRedoButtons();

        SnackbarController.info('Undid last change');
    }

    redo() {
        if (this.redoStack.length === 0) return;

        // Save current state to undo stack
        this.undoStack.push({
            typographyData: [...this.typographyData],
            changes: new Map(this.changes)
        });

        // Restore next state
        const state = this.redoStack.pop();
        this.typographyData = [...state.typographyData];
        this.changes = new Map(state.changes);

        this.render();
        this.updateUndoRedoButtons();

        SnackbarController.info('Redid last change');
    }

    updateUndoRedoButtons() {
        const undoBtn = document.querySelector('#undo-changes');
        const redoBtn = document.querySelector('#redo-changes');

        if (undoBtn) {
            undoBtn.disabled = this.undoStack.length === 0;
        }
        if (redoBtn) {
            redoBtn.disabled = this.redoStack.length === 0;
        }
    }

    initializeTypographyInteractions() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'e':
                        e.preventDefault();
                        this.toggleEditMode();
                        break;
                }
            }
        });

        // Add accessibility improvements
        const typographyItems = this.container.querySelectorAll('.typography-item[data-editable="true"]');
        typographyItems.forEach(item => {
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Click to edit text');
            item.setAttribute('tabindex', '0');
        });
    }

    // Metrics calculation methods
    getComputedTypographyStyle(className) {
        // Create temporary element to get computed styles
        const tempElement = Utils.createElement('div', className, 'Sample');
        document.body.appendChild(tempElement);

        const computedStyle = getComputedStyle(tempElement);
        const styles = {
            fontSize: computedStyle.fontSize,
            fontWeight: computedStyle.fontWeight,
            lineHeight: computedStyle.lineHeight,
            letterSpacing: computedStyle.letterSpacing,
            fontFamily: computedStyle.fontFamily
        };

        document.body.removeChild(tempElement);
        return styles;
    }

    calculateReadabilityScore(styles) {
        // Simplified readability calculation based on typography best practices
        let score = 50;

        const fontSize = parseFloat(styles.fontSize);
        const lineHeight = parseFloat(styles.lineHeight);

        // Font size scoring
        if (fontSize >= 16) score += 20;
        else if (fontSize >= 14) score += 10;
        else score -= 10;

        // Line height scoring
        const lineHeightRatio = lineHeight / fontSize;
        if (lineHeightRatio >= 1.4 && lineHeightRatio <= 1.6) score += 20;
        else if (lineHeightRatio >= 1.2) score += 10;
        else score -= 10;

        // Font weight scoring
        const fontWeight = parseInt(styles.fontWeight);
        if (fontWeight >= 400 && fontWeight <= 600) score += 10;

        return Math.max(0, Math.min(100, score));
    }

    getAccessibilityInfo(styles) {
        const fontSize = parseFloat(styles.fontSize);

        if (fontSize >= 18 || (fontSize >= 14 && parseInt(styles.fontWeight) >= 700)) {
            return { rating: 'AA+', class: 'rating-aaa' };
        } else if (fontSize >= 16) {
            return { rating: 'AA', class: 'rating-aa' };
        } else {
            return { rating: 'Review', class: 'rating-warning' };
        }
    }

    createBodyTextMetrics() {
        return Utils.createElementWithHTML('div', 'typography-metrics', `
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Optimal Length</span>
                    <span class="metric-value">45-75 chars</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Reading Level</span>
                    <span class="metric-value">Grade 8-10</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Readability</span>
                    <div class="readability-indicator">
                        <div class="readability-bar">
                            <div class="readability-fill" style="width: 85%"></div>
                        </div>
                        <span class="readability-score">85%</span>
                    </div>
                </div>
            </div>
        `);
    }

    createLinkMetrics() {
        return Utils.createElementWithHTML('div', 'typography-metrics', `
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Color Contrast</span>
                    <span class="accessibility-badge rating-aa">AA</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Touch Target</span>
                    <span class="metric-value">44px min</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Hover State</span>
                    <span class="metric-value">✓ Present</span>
                </div>
            </div>
        `);
    }

    createCodeMetrics() {
        return Utils.createElementWithHTML('div', 'typography-metrics', `
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Font Family</span>
                    <span class="metric-value">Monospace</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Syntax</span>
                    <span class="metric-value">JavaScript</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Readability</span>
                    <span class="accessibility-badge rating-aa">Good</span>
                </div>
            </div>
        `);
    }

    createQuoteMetrics() {
        return Utils.createElementWithHTML('div', 'typography-metrics', `
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">Style</span>
                    <span class="metric-value">Blockquote</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Emphasis</span>
                    <span class="metric-value">Italic</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Citation</span>
                    <span class="metric-value">✓ Present</span>
                </div>
            </div>
        `);
    }

    createListMetrics() {
        return Utils.createElementWithHTML('div', 'typography-metrics', `
            <div class="metrics-grid">
                <div class="metric-item">
                    <span class="metric-label">List Type</span>
                    <span class="metric-value">Unordered</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Items</span>
                    <span class="metric-value">4 items</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Hierarchy</span>
                    <span class="accessibility-badge rating-aa">Clear</span>
                </div>
            </div>
        `);
    }

    // Public API methods
    getTypographyData() {
        return [...this.typographyData];
    }

    exportTypographyCSS() {
        let css = '/* Typography Styles */\n';

        this.typographyData.forEach(item => {
            const styles = this.getComputedTypographyStyle(item.className);
            css += `.${item.className} {\n`;
            css += `  font-size: ${styles.fontSize};\n`;
            css += `  font-weight: ${styles.fontWeight};\n`;
            css += `  line-height: ${styles.lineHeight};\n`;
            if (styles.letterSpacing !== 'normal') {
                css += `  letter-spacing: ${styles.letterSpacing};\n`;
            }
            css += `  font-family: ${styles.fontFamily};\n`;
            css += '}\n\n';
        });

        return css;
    }

    getEditableContent() {
        const content = {};
        this.changes.forEach((text, index) => {
            content[index] = text;
        });
        return content;
    }
}
