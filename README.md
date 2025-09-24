# Material Design Style Guide

A modern, responsive style guide built with Material Design 3 principles, featuring modular architecture and component-based JavaScript.

![Material Design](https://img.shields.io/badge/Material%20Design-3-blue)
![CSS3](https://img.shields.io/badge/CSS3-Custom%20Properties-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Responsive](https://img.shields.io/badge/Responsive-Mobile%20First-green)

## ✨ Features

- 🎨 **Material Design 3** color system and typography
- 📱 **Responsive design** with mobile-first approach
- ♿ **Accessibility features** with ARIA labels and semantic HTML
- 🧩 **Modular CSS architecture** with custom properties
- 🔄 **Component-based JavaScript** with separation of concerns
- ⚡ **Smooth animations** and Material Design interactions
- 🎯 **SEO optimized** with proper semantic structure

## 🚀 Quick Start

### Prerequisites
- VS Code with Live Server extension
- Modern web browser
- Git (optional)

### Setup
1. **Clone or download** this repository
2. **Open in VS Code**: `code .`
3. **Install recommended extensions** (see below)
4. **Right-click** on `index.html`
5. **Select** "Open with Live Server"
6. **Visit** `http://localhost:3000`

## 🏗️ Project Structure

```
material-style-guide/
├── index.html                 # Main HTML file
├── styles/                    # CSS modules
│   ├── variables.css          # Design tokens & CSS custom properties
│   ├── base.css              # Reset, typography, base styles
│   ├── components.css         # Component-specific styles
│   ├── layout.css            # Layout and responsive styles
│   └── animations.css         # Animation definitions
├── scripts/                   # JavaScript modules
│   ├── data/
│   │   └── styleGuideData.js # Content configuration
│   ├── components/           # UI components
│   │   ├── ColorPalette.js
│   │   ├── FontShowcase.js
│   │   └── TypographyShowcase.js
│   ├── controllers/          # Application logic
│   │   ├── AnimationController.js
│   │   └── NavigationController.js
│   ├── utils/
│   │   └── Utils.js          # Helper functions
│   └── app.js                # Main application controller
├── assets/                   # Static assets
│   └── fonts/               # Custom fonts (if any)
├── .vscode/                 # VS Code configuration
└── README.md
```

## 🎨 Color Palette

The style guide showcases a custom color palette:
- **Parchment** (`#F9F5F0`) - Light neutral
- **Buttermilk** (`#F2EAD3`) - Warm cream
- **Autumn Blaze** (`#F4991A`) - Vibrant orange
- **Hunter's Green** (`#344F1F`) - Deep green

## 🔤 Typography

Three font families are demonstrated:
- **Raleway** - Clean, modern sans-serif
- **Merriweather** - Readable serif for body text
- **Lato** - Friendly, approachable sans-serif

## 🛠️ Development

### Recommended VS Code Extensions
- **Live Server** (`ritwickdey.liveserver`) - Local development server
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting
- **Auto Rename Tag** (`formulahendry.auto-rename-tag`) - HTML tag management
- **CSS Peek** (`pranaygp.vscode-css-peek`) - CSS navigation
- **Material Icon Theme** (`pkief.material-icon-theme`) - Better file icons

### Customization

#### Adding New Colors
Edit `scripts/data/styleGuideData.js`:
```javascript
colors: [
    {
        name: 'Your Color',
        hex: '#YOUR_HEX',
        rgb: 'rgb(R, G, B)',
        textColor: '#fff' // or '#000'
    }
]
```

#### Adding New Fonts
1. Add Google Fonts link to `index.html`
2. Update font data in `styleGuideData.js`
3. Add CSS class in `styles/components.css`

#### Modifying Design Tokens
Edit CSS custom properties in `styles/variables.css`:
```css
:root {
    --md-sys-color-primary: #YOUR_COLOR;
    --spacing-md: 16px;
    --elevation-1: your-shadow-values;
}
```

## 📱 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material Design 3](https://m3.material.io/) by Google
- [Roboto Font](https://fonts.google.com/specimen/Roboto) by Google Fonts
- [Material Icons](https://fonts.google.com/icons) by Google

---

Made with ❤️ and Material Design principles
