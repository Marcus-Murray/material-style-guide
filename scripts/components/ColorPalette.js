class ColorPalette {
    constructor(containerId, colorData) {
        this.container = document.getElementById(containerId);
        this.colorData = colorData;
    }

    render() {
        this.colorData.forEach(color => {
            const colorItem = this.createColorItem(color);
            this.container.appendChild(colorItem);
        });
    }

    createColorItem(color) {
        const colorItem = Utils.createElement('div', 'color-item');

        const colorSwatch = Utils.createElement('div', 'color-swatch', color.hex);
        colorSwatch.style.backgroundColor = color.hex;
        colorSwatch.style.color = color.textColor;
        if (color.textColor === '#fff') {
            colorSwatch.style.textShadow = 'none';
        }

        const colorInfo = Utils.createElement('div', 'color-info');
        const colorName = Utils.createElement('div', 'color-name', color.name);
        const colorHex = Utils.createElement('div', 'color-hex', color.hex);
        const colorRgb = Utils.createElement('div', 'color-rgb', color.rgb);

        colorInfo.appendChild(colorName);
        colorInfo.appendChild(colorHex);
        colorInfo.appendChild(colorRgb);

        colorItem.appendChild(colorSwatch);
        colorItem.appendChild(colorInfo);

        return colorItem;
    }
}
