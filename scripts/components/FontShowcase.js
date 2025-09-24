class FontShowcase {
    constructor(containerId, fontData) {
        this.container = document.getElementById(containerId);
        this.fontData = fontData;
    }

    render() {
        this.fontData.forEach(font => {
            const fontCard = this.createFontCard(font);
            this.container.appendChild(fontCard);
        });
    }

    createFontCard(font) {
        const fontCard = Utils.createElement('div', `font-card ${font.className}`);

        const fontName = Utils.createElement('div', 'font-name', font.name);
        fontCard.appendChild(fontName);

        const weights = ['normal', 'bold', 'italic'];
        weights.forEach(weight => {
            const preview = Utils.createElement('div', `font-preview ${weight}`, font.preview);
            fontCard.appendChild(preview);
        });

        return fontCard;
    }
}
