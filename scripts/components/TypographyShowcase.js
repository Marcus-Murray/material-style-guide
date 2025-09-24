class TypographyShowcase {
    constructor(containerId, typographyData) {
        this.container = document.getElementById(containerId);
        this.typographyData = typographyData;
    }

    render() {
        this.typographyData.forEach(item => {
            const element = Utils.createElement(item.tag, item.className, item.text);
            this.container.appendChild(element);
        });

        // Add body text and link examples
        const bodyText = Utils.createElement('p', 'body-text',
            'This is body text using the Material Design typography system. It\'s designed to be highly readable and accessible across different devices and screen sizes. The text follows Material Design 3 principles for optimal user experience.');

        const linkParagraph = Utils.createElement('p');
        const link = Utils.createElement('a', 'material-link', 'This is a Material Design link');
        link.href = '#';
        linkParagraph.appendChild(link);
        linkParagraph.innerHTML += ' with proper styling and interaction states.';

        this.container.appendChild(bodyText);
        this.container.appendChild(linkParagraph);
    }
}
