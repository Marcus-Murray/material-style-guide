// Enhanced Style Guide Data Configuration
const ENHANCED_STYLE_GUIDE_DATA = {
    colors: [
        {
            name: 'Parchment',
            hex: '#F9F5F0',
            rgb: 'rgb(249, 245, 240)',
            textColor: '#000',
            editable: true,
            category: 'neutral',
            usage: ['backgrounds', 'cards', 'surfaces'],
            description: 'A warm, off-white color perfect for backgrounds and creating a soft, welcoming atmosphere.'
        },
        {
            name: 'Buttermilk',
            hex: '#F2EAD3',
            rgb: 'rgb(242, 234, 211)',
            textColor: '#000',
            editable: true,
            category: 'neutral',
            usage: ['backgrounds', 'highlights', 'subtle-accents'],
            description: 'A creamy, warm beige that works well for secondary backgrounds and gentle highlights.'
        },
        {
            name: 'Autumn Blaze',
            hex: '#F4991A',
            rgb: 'rgb(244, 153, 26)',
            textColor: '#fff',
            editable: true,
            category: 'accent',
            usage: ['buttons', 'links', 'highlights', 'calls-to-action'],
            description: 'A vibrant orange that commands attention and works perfectly for interactive elements.'
        },
        {
            name: 'Hunter\'s Green',
            hex: '#344F1F',
            rgb: 'rgb(52, 79, 31)',
            textColor: '#fff',
            editable: true,
            category: 'primary',
            usage: ['headers', 'navigation', 'emphasis', 'brand-elements'],
            description: 'A deep, sophisticated green that conveys stability and natural elegance.'
        }
    ],

    fonts: [
        {
            name: 'Raleway',
            className: 'raleway',
            preview: 'The quick brown fox jumps over the lazy dog.',
            variableWeight: true,
            category: 'sans-serif',
            usage: ['headings', 'display', 'ui', 'navigation'],
            weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
            googleFontsUrl: 'https://fonts.google.com/specimen/Raleway',
            description: 'A clean, modern sans-serif with excellent readability across all weights.',
            characteristics: ['geometric', 'clean', 'modern', 'versatile'],
            pairing: ['Merriweather', 'Lato'],
            license: 'Open Font License'
        },
        {
            name: 'Merriweather',
            className: 'merriweather',
            preview: 'The quick brown fox jumps over the lazy dog.',
            variableWeight: false,
            category: 'serif',
            usage: ['body', 'reading', 'articles', 'long-form-content'],
            weights: [300, 400, 700, 900],
            googleFontsUrl: 'https://fonts.google.com/specimen/Merriweather',
            description: 'Designed for optimal readability on screens, perfect for body text and articles.',
            characteristics: ['readable', 'scholarly', 'traditional', 'comfortable'],
            pairing: ['Raleway', 'Lato'],
            license: 'Open Font License'
        },
        {
            name: 'Lato',
            className: 'lato',
            preview: 'The quick brown fox jumps over the lazy dog.',
            variableWeight: false,
            category: 'sans-serif',
            usage: ['body', 'ui', 'captions', 'interface-text'],
            weights: [100, 300, 400, 700, 900],
            googleFontsUrl: 'https://fonts.google.com/specimen/Lato',
            description: 'A friendly humanist sans-serif with warm, approachable characteristics.',
            characteristics: ['humanist', 'friendly', 'approachable', 'warm'],
            pairing: ['Raleway', 'Merriweather'],
            license: 'Open Font License'
        }
    ],

    typographyExamples: [
        {
            tag: 'h1',
            className: 'display-large',
            text: 'Display Large',
            editable: true,
            usage: 'Hero headlines, main page titles',
            specs: {
                fontSize: '57px',
                lineHeight: '64px',
                letterSpacing: '-0.25px',
                fontWeight: '400',
                marginBottom: '24px'
            },
            responsive: {
                mobile: { fontSize: '36px', lineHeight: '44px' },
                tablet: { fontSize: '45px', lineHeight: '52px' }
            },
            accessibility: {
                minContrast: '4.5:1',
                recommendedContrast: '7:1',
                focusIndicator: true
            }
        },
        {
            tag: 'h2',
            className: 'display-medium',
            text: 'Display Medium',
            editable: true,
            usage: 'Section headers, major divisions',
            specs: {
                fontSize: '45px',
                lineHeight: '52px',
                letterSpacing: '0px',
                fontWeight: '400',
                marginBottom: '20px'
            },
            responsive: {
                mobile: { fontSize: '28px', lineHeight: '36px' },
                tablet: { fontSize: '36px', lineHeight: '44px' }
            },
            accessibility: {
                minContrast: '4.5:1',
                recommendedContrast: '7:1',
                focusIndicator: true
            }
        },
        {
            tag: 'h3',
            className: 'display-small',
            text: 'Display Small',
            editable: true,
            usage: 'Card headers, component titles',
            specs: {
                fontSize: '36px',
                lineHeight: '44px',
                letterSpacing: '0px',
                fontWeight: '400',
                marginBottom: '16px'
            },
            responsive: {
                mobile: { fontSize: '24px', lineHeight: '32px' },
                tablet: { fontSize: '28px', lineHeight: '36px' }
            },
            accessibility: {
                minContrast: '4.5:1',
                recommendedContrast: '7:1',
                focusIndicator: true
            }
        },
        {
            tag: 'h4',
            className: 'headline-large',
            text: 'Headline Large',
            editable: true,
            usage: 'Article titles, important announcements',
            specs: {
                fontSize: '32px',
                lineHeight: '40px',
                letterSpacing: '0px',
                fontWeight: '400',
                marginBottom: '16px'
            },
            responsive: {
                mobile: { fontSize: '22px', lineHeight: '28px' },
                tablet: { fontSize: '26px', lineHeight: '34px' }
            },
            accessibility: {
                minContrast: '4.5:1',
                recommendedContrast: '7:1',
                focusIndicator: true
            }
        },
        {
            tag: 'h5',
            className: 'headline-medium',
            text: 'Headline Medium',
            editable: true,
            usage: 'Component titles, form section headers',
            specs: {
                fontSize: '28px',
                lineHeight: '36px',
                letterSpacing: '0px',
                fontWeight: '400',
                marginBottom: '12px'
            },
            responsive: {
                mobile: { fontSize: '20px', lineHeight: '28px' },
                tablet: { fontSize: '24px', lineHeight: '32px' }
            },
            accessibility: {
                minContrast: '4.5:1',
                recommendedContrast: '7:1',
                focusIndicator: true
            }
        },
        {
            tag: 'h6',
            className: 'headline-small',
            text: 'Headline Small',
            editable: true,
            usage: 'List headers, small section titles',
            specs: {
                fontSize: '24px',
                lineHeight: '32px',
                letterSpacing: '0px',
                fontWeight: '400',
                marginBottom: '12px'
            },
            responsive: {
                mobile: { fontSize: '18px', lineHeight: '24px' },
                tablet: { fontSize: '20px', lineHeight: '28px' }
            },
            accessibility: {
                minContrast: '4.5:1',
                recommendedContrast: '7:1',
                focusIndicator: true
            }
        }
    ],

    // Additional typography tokens for body text, captions, etc.
    additionalTypography: [
        {
            name: 'Body Large',
            className: 'body-large',
            usage: 'Primary body text, main content',
            specs: {
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.5px',
                fontWeight: '400'
            }
        },
        {
            name: 'Body Medium',
            className: 'body-medium',
            usage: 'Secondary text, descriptions',
            specs: {
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.25px',
                fontWeight: '400'
            }
        },
        {
            name: 'Label Large',
            className: 'label-large',
            usage: 'Button text, form labels',
            specs: {
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.1px',
                fontWeight: '500'
            }
        }
    ],

    // Design system metadata
    metadata: {
        name: 'Enhanced Material Design Style Guide',
        version: '2.0.0',
        author: 'Style Guide Generator',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        description: 'A comprehensive style guide built with Material Design 3 principles',
        license: 'MIT',
        repository: null,
        documentation: null,
        designSystem: {
            name: 'Material Design 3',
            version: '3.0',
            baseUnit: '8px',
            breakpoints: {
                mobile: '480px',
                tablet: '768px',
                desktop: '1024px',
                wide: '1200px'
            },
            colorSystem: 'Material You',
            typographyScale: 'Material Design Type Scale',
            elevationLevels: 5,
            animationDuration: {
                short: '200ms',
                medium: '300ms',
                long: '500ms'
            }
        }
    },

    // Theme configurations
    themes: {
        light: {
            name: 'Light Theme',
            primary: '#6750A4',
            onPrimary: '#FFFFFF',
            primaryContainer: '#EADDFF',
            onPrimaryContainer: '#21005D',
            background: '#FFFBFE',
            onBackground: '#1C1B1F',
            surface: '#FFFBFE',
            onSurface: '#1C1B1F'
        },
        dark: {
            name: 'Dark Theme',
            primary: '#D0BCFF',
            onPrimary: '#381E72',
            primaryContainer: '#4F378B',
            onPrimaryContainer: '#EADDFF',
            background: '#100E13',
            onBackground: '#E6E0E9',
            surface: '#100E13',
            onSurface: '#E6E0E9'
        }
    },

    // Component specifications
    components: {
        buttons: {
            primary: {
                backgroundColor: 'var(--md-sys-color-primary)',
                textColor: 'var(--md-sys-color-on-primary)',
                borderRadius: '12px',
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: '500',
                minHeight: '48px'
            },
            secondary: {
                backgroundColor: 'var(--md-sys-color-secondary-container)',
                textColor: 'var(--md-sys-color-on-secondary-container)',
                borderRadius: '12px',
                padding: '16px 24px',
                fontSize: '14px',
                fontWeight: '500',
                minHeight: '48px'
            }
        },
        cards: {
            elevation: 'var(--elevation-1)',
            borderRadius: '12px',
            padding: '24px',
            backgroundColor: 'var(--md-sys-color-surface)',
            textColor: 'var(--md-sys-color-on-surface)'
        },
        navigation: {
            drawer: {
                width: '320px',
                backgroundColor: 'var(--glass-background)',
                backdropFilter: 'var(--glass-backdrop)'
            },
            topAppBar: {
                height: '64px',
                backgroundColor: 'var(--glass-background)',
                backdropFilter: 'var(--glass-backdrop)'
            }
        }
    },

    // Accessibility guidelines
    accessibility: {
        colorContrast: {
            normal: '4.5:1',
            large: '3:1',
            excellent: '7:1'
        },
        touchTargets: {
            minimum: '44px',
            recommended: '48px'
        },
        focusIndicators: {
            outlineWidth: '2px',
            outlineColor: 'var(--md-sys-color-primary)',
            outlineOffset: '2px'
        },
        animationDuration: {
            respectsReducedMotion: true,
            maxDuration: '500ms'
        }
    },

    // Usage guidelines
    guidelines: {
        colors: {
            primary: 'Use for main actions, navigation, and brand elements',
            secondary: 'Use for secondary actions and complementary elements',
            neutral: 'Use for backgrounds, dividers, and subtle elements',
            accent: 'Use sparingly for highlights and attention-drawing elements'
        },
        typography: {
            hierarchy: 'Maintain clear visual hierarchy using size, weight, and spacing',
            readability: 'Ensure sufficient contrast and line height for comfortable reading',
            consistency: 'Use consistent font families and weights throughout the design'
        },
        spacing: {
            baseUnit: '8px',
            scale: [4, 8, 16, 24, 32, 48, 64, 96],
            usage: 'Use multiples of 8px for consistent spacing throughout the design'
        }
    }
};

// Validation function to ensure data integrity
function validateStyleGuideData(data) {
    const errors = [];

    // Validate colors
    if (!data.colors || !Array.isArray(data.colors)) {
        errors.push('Colors array is missing or invalid');
    } else {
        data.colors.forEach((color, index) => {
            if (!color.name || !color.hex || !color.rgb || !color.textColor) {
                errors.push(`Color at index ${index} is missing required properties`);
            }
            if (color.hex && !/^#[0-9A-Fa-f]{6}$/.test(color.hex)) {
                errors.push(`Color "${color.name}" has invalid hex format: ${color.hex}`);
            }
        });
    }

    // Validate fonts
    if (!data.fonts || !Array.isArray(data.fonts)) {
        errors.push('Fonts array is missing or invalid');
    } else {
        data.fonts.forEach((font, index) => {
            if (!font.name || !font.className || !font.preview) {
                errors.push(`Font at index ${index} is missing required properties`);
            }
        });
    }

    // Validate typography examples
    if (!data.typographyExamples || !Array.isArray(data.typographyExamples)) {
        errors.push('Typography examples array is missing or invalid');
    } else {
        data.typographyExamples.forEach((example, index) => {
            if (!example.tag || !example.className || !example.text) {
                errors.push(`Typography example at index ${index} is missing required properties`);
            }
        });
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Utility functions for working with the data
const StyleGuideUtils = {
    // Get colors by category
    getColorsByCategory(category) {
        return ENHANCED_STYLE_GUIDE_DATA.colors.filter(color => color.category === category);
    },

    // Get fonts by category
    getFontsByCategory(category) {
        return ENHANCED_STYLE_GUIDE_DATA.fonts.filter(font => font.category === category);
    },

    // Get typography by usage
    getTypographyByUsage(usage) {
        return ENHANCED_STYLE_GUIDE_DATA.typographyExamples.filter(example =>
            example.usage && example.usage.toLowerCase().includes(usage.toLowerCase())
        );
    },

    // Generate CSS custom properties
    generateCSSCustomProperties() {
        let css = ':root {\n';

        // Add color properties
        ENHANCED_STYLE_GUIDE_DATA.colors.forEach(color => {
            const name = color.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            css += `  --color-${name}: ${color.hex};\n`;
            css += `  --color-${name}-rgb: ${color.rgb.replace('rgb(', '').replace(')', '')};\n`;
        });

        css += '}\n';
        return css;
    },

    // Export data as JSON
    exportAsJSON() {
        return JSON.stringify(ENHANCED_STYLE_GUIDE_DATA, null, 2);
    }
};

// Validate the data on load
const validation = validateStyleGuideData(ENHANCED_STYLE_GUIDE_DATA);
if (!validation.isValid) {
    console.warn('Style guide data validation errors:', validation.errors);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ENHANCED_STYLE_GUIDE_DATA,
        StyleGuideUtils,
        validateStyleGuideData
    };
}

// Global reference for browser environments
if (typeof window !== 'undefined') {
    window.ENHANCED_STYLE_GUIDE_DATA = ENHANCED_STYLE_GUIDE_DATA;
    window.StyleGuideUtils = StyleGuideUtils;
}

// Legacy compatibility - keep the old variable name
const STYLE_GUIDE_DATA = ENHANCED_STYLE_GUIDE_DATA;
