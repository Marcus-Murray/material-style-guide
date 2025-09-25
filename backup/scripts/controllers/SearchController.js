class SearchController {
    constructor(colorPalette, fontShowcase) {
        this.colorPalette = colorPalette;
        this.fontShowcase = fontShowcase;
        this.searchInput = document.getElementById('search-input');
        this.currentSearchTerm = '';
        this.searchHistory = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSearchHistory();
    }

    bindEvents() {
        // Debounced search input
        this.searchInput.addEventListener('input',
            Utils.debounce((e) => this.handleSearch(e.target.value), 300)
        );

        // Handle search on Enter key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });

        // Clear search on Escape
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });

        // Handle focus and blur for accessibility
        this.searchInput.addEventListener('focus', () => {
            this.searchInput.setAttribute('aria-expanded', 'true');
        });

        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.searchInput.setAttribute('aria-expanded', 'false');
            }, 150);
        });
    }

    handleSearch(term) {
        this.currentSearchTerm = term.trim().toLowerCase();

        if (this.currentSearchTerm.length === 0) {
            this.clearSearch();
            return;
        }

        this.performSearch(this.currentSearchTerm);
        this.announceSearchResults();
    }

    performSearch(term) {
        if (!term) return;

        const results = {
            colors: this.searchColors(term),
            fonts: this.searchFonts(term),
            typography: this.searchTypography(term)
        };

        this.displaySearchResults(results);
        this.addToSearchHistory(term);
        this.highlightSearchTerms(term);
    }

    searchColors(term) {
        if (!this.colorPalette || !this.colorPalette.colorData) return [];

        return this.colorPalette.colorData.filter(color =>
            color.name.toLowerCase().includes(term) ||
            color.hex.toLowerCase().includes(term) ||
            color.rgb.toLowerCase().includes(term)
        );
    }

    searchFonts(term) {
        if (!this.fontShowcase || !this.fontShowcase.fontData) return [];

        return this.fontShowcase.fontData.filter(font =>
            font.name.toLowerCase().includes(term) ||
            font.className.toLowerCase().includes(term) ||
            font.preview.toLowerCase().includes(term)
        );
    }

    searchTypography(term) {
        // Search through typography examples
        const typographySection = document.getElementById('typography-showcase');
        if (!typographySection) return [];

        const elements = typographySection.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
        const results = [];

        elements.forEach(element => {
            if (element.textContent.toLowerCase().includes(term)) {
                results.push({
                    element: element,
                    text: element.textContent,
                    type: element.tagName.toLowerCase()
                });
            }
        });

        return results;
    }

    displaySearchResults(results) {
        // Filter and update color palette
        if (this.colorPalette) {
            this.colorPalette.search(this.currentSearchTerm);
        }

        // Highlight matching sections
        this.highlightSections(results);

        // Show/hide sections based on results
        this.toggleSectionVisibility(results);
    }

    highlightSections(results) {
        // Remove existing highlights
        this.removeHighlights();

        const hasColorResults = results.colors.length > 0;
        const hasFontResults = results.fonts.length > 0;
        const hasTypographyResults = results.typography.length > 0;

        // Add visual indicators for sections with results
        if (hasColorResults) {
            this.addSectionHighlight('colors-section');
        }
        if (hasFontResults) {
            this.addSectionHighlight('typography-section');
        }
        if (hasTypographyResults) {
            this.addSectionHighlight('playground-section');
        }
    }

    addSectionHighlight(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('search-highlight');
        }
    }

    removeHighlights() {
        const highlightedSections = document.querySelectorAll('.search-highlight');
        highlightedSections.forEach(section => {
            section.classList.remove('search-highlight');
        });

        // Remove text highlights
        const textHighlights = document.querySelectorAll('.text-highlight');
        textHighlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }

    highlightSearchTerms(term) {
        if (!term || term.length < 2) return;

        const sections = ['colors-section', 'typography-section', 'playground-section'];

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                this.highlightTextInElement(section, term);
            }
        });
    }

    highlightTextInElement(element, term) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.toLowerCase().includes(term)) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const parent = textNode.parentNode;
            if (parent.classList.contains('text-highlight')) return;

            const text = textNode.textContent;
            const regex = new RegExp(`(${term})`, 'gi');
            const highlightedText = text.replace(regex, '<mark class="text-highlight">$1</mark>');

            if (highlightedText !== text) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlightedText;
                parent.replaceChild(wrapper, textNode);
            }
        });
    }

    toggleSectionVisibility(results) {
        const hasResults = results.colors.length > 0 || results.fonts.length > 0 || results.typography.length > 0;

        if (!hasResults && this.currentSearchTerm.length > 0) {
            this.showNoResultsMessage();
        } else {
            this.hideNoResultsMessage();
        }
    }

    showNoResultsMessage() {
        this.hideNoResultsMessage(); // Remove existing message first

        const message = Utils.createElement('div', 'no-results-message');
        message.innerHTML = `
            <div class="no-results-content">
                <span class="material-icons-outlined">search_off</span>
                <h3>No results found</h3>
                <p>Try searching for colors, fonts, or typography terms</p>
                <button class="btn-secondary" onclick="searchController.clearSearch()">Clear Search</button>
            </div>
        `;

        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.appendChild(message);
        }
    }

    hideNoResultsMessage() {
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    clearSearch() {
        this.currentSearchTerm = '';
        this.searchInput.value = '';
        this.removeHighlights();
        this.hideNoResultsMessage();

        // Reset all components to show all items
        if (this.colorPalette) {
            this.colorPalette.search('');
        }

        // Announce search cleared
        SnackbarController.info('Search cleared');
    }

    addToSearchHistory(term) {
        if (!term || this.searchHistory.includes(term)) return;

        this.searchHistory.unshift(term);

        // Keep only last 10 searches
        if (this.searchHistory.length > 10) {
            this.searchHistory = this.searchHistory.slice(0, 10);
        }

        this.saveSearchHistory();
    }

    loadSearchHistory() {
        const saved = Utils.getLocalStorage('search-history', []);
        this.searchHistory = Array.isArray(saved) ? saved : [];
    }

    saveSearchHistory() {
        Utils.setLocalStorage('search-history', this.searchHistory);
    }

    announceSearchResults() {
        const colorResults = this.colorPalette ? this.colorPalette.filterColors().length : 0;
        const message = colorResults === 1
            ? '1 result found'
            : `${colorResults} results found`;

        // Create invisible announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    getSearchHistory() {
        return [...this.searchHistory];
    }

    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
        SnackbarController.info('Search history cleared');
    }

    getCurrentSearchTerm() {
        return this.currentSearchTerm;
    }
}
