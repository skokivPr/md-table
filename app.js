// Monaco Editor setup
let editor;
let md; // markdown-it instance

// Advanced Theme Settings Manager (based on linki.html)
const ThemeSettingsManager = {
    // Storage key for theme settings
    storageKey: 'advanced-markdown-editor-theme-settings',

    // Default settings
    defaultSettings: {
        hue1: 155,
        hue2: 222,
        blurIntensity: 12,
        glowBrightness: 70,
        editorFontSize: 14,
        previewFontSize: 16,
        tabSize: 4,
        wordWrap: 'on'
    },

    // Current settings
    settings: {},

    // Track number of setting changes
    changeCounter: 0,

    // Initialize the theme manager
    init() {
        this.loadSettings();
        this.applySettings();
        this.setupControlHandlers();
        this.listenForExternalChanges();

        // Ensure Monaco Editor gets proper theme colors if editor is already loaded
        if (editor && monaco) {
            this.updateMonacoThemeColors();
        }

        console.log("ThemeSettingsManager initialized with settings:", this.settings);
        return this;
    },

    // Listen for theme changes from other tabs/pages
    listenForExternalChanges() {
        window.addEventListener('storage', (event) => {
            if (event.key === this.storageKey) {
                this.loadSettings();
                this.applySettings();
                this.updateControlValues();
            }
        });
        document.addEventListener('theme-settings-changed', (event) => {
            if (event.detail && typeof event.detail.settings === 'object') {
                this.settings = event.detail.settings;
                this.applySettings();
                this.updateControlValues();
            }
        });
    },

    // Load settings from localStorage
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem(this.storageKey);
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                this.settings = {
                    ...this.defaultSettings,
                    ...parsedSettings
                };
                console.log("Loaded settings from localStorage:", this.settings);
            } else {
                this.settings = { ...this.defaultSettings };
                console.log("No saved settings found, using defaults:", this.settings);
            }
            const savedCounter = localStorage.getItem(`${this.storageKey}-counter`);
            this.changeCounter = savedCounter ? parseInt(savedCounter) : 0;
        } catch (error) {
            console.error('Failed to load theme settings:', error);
            this.settings = { ...this.defaultSettings };
            this.changeCounter = 0;
        }
        return this;
    },

    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
            console.log("Saved settings to localStorage:", this.settings);
            this.changeCounter++;
            localStorage.setItem(`${this.storageKey}-counter`, this.changeCounter.toString());
            this.updateChangeCounter();
            const event = new CustomEvent('theme-settings-changed', {
                detail: {
                    settings: this.settings,
                    changeCounter: this.changeCounter
                }
            });
            document.dispatchEvent(event);
        } catch (error) {
            console.error('Failed to save theme settings:', error);
        }
        return this;
    },

    // Update change counter display
    updateChangeCounter() {
        const counterElement = document.getElementById('theme-changes-counter');
        if (counterElement) {
            counterElement.textContent = this.changeCounter.toString();
        }
    },

    // Apply settings to the current page
    applySettings() {
        // Apply hue values
        document.documentElement.style.setProperty('--hue1', this.settings.hue1);
        document.documentElement.style.setProperty('--hue2', this.settings.hue2);

        // Apply derived colors
        document.documentElement.style.setProperty('--primary-color', `hsl(${this.settings.hue1}, 70%, 50%)`);
        document.documentElement.style.setProperty('--secondary-color', `hsl(${this.settings.hue2}, 70%, 50%)`);

        // Apply blur intensity
        if (this.settings.blurIntensity !== undefined) {
            document.documentElement.style.setProperty('--blur-intensity', `${this.settings.blurIntensity}px`);
            document.querySelectorAll('.container, .modal-content, .panel-modal-content').forEach(el => {
                el.style.backdropFilter = `blur(${this.settings.blurIntensity}px)`;
                el.style.webkitBackdropFilter = `blur(${this.settings.blurIntensity}px)`;
            });
        }

        // Apply glow brightness
        if (this.settings.glowBrightness !== undefined) {
            document.documentElement.style.setProperty('--glow-brightness', this.settings.glowBrightness);
            document.querySelectorAll('.viewport-button, .control-btn').forEach(el => {
                el.style.filter = `brightness(${this.settings.glowBrightness / 100})`;
            });
        }

        // Apply editor settings
        if (editor) {
            editor.updateOptions({
                fontSize: parseInt(this.settings.editorFontSize),
                tabSize: parseInt(this.settings.tabSize),
                wordWrap: this.settings.wordWrap
            });
        }

        // Apply preview font size
        const previewContainer = document.getElementById('previewContainer');
        if (previewContainer) {
            previewContainer.style.fontSize = `${this.settings.previewFontSize}px`;
        }

        // Update Monaco Editor theme with new colors
        this.updateMonacoThemeColors();

        this.updateChangeCounter();
        console.log("Settings applied to page:", this.settings);

        // Ensure Monaco Editor gets the latest theme after all settings are applied
        if (editor && monaco) {
            setTimeout(() => {
                this.updateMonacoThemeColors();
            }, 50);
        }

        return this;
    },

    // Update control values to match current settings
    updateControlValues() {
        const h1Slider = document.getElementById('h1');
        const h2Slider = document.getElementById('h2');
        const blurSlider = document.getElementById('blur-intensity');
        const glowSlider = document.getElementById('glow-brightness');

        const h1ValueInput = document.getElementById('h1-value');
        const h2ValueInput = document.getElementById('h2-value');
        const blurValueInput = document.getElementById('blur-value');
        const glowValueInput = document.getElementById('glow-value');

        const editorFontSizeInput = document.getElementById('editorFontSize');
        const previewFontSizeInput = document.getElementById('previewFontSize');
        const tabSizeInput = document.getElementById('tabSize');
        const wordWrapSelect = document.getElementById('wordWrap');

        if (h1Slider) h1Slider.value = this.settings.hue1;
        if (h2Slider) h2Slider.value = this.settings.hue2;
        if (blurSlider) blurSlider.value = this.settings.blurIntensity;
        if (glowSlider) glowSlider.value = this.settings.glowBrightness;

        if (h1ValueInput) h1ValueInput.value = this.settings.hue1;
        if (h2ValueInput) h2ValueInput.value = this.settings.hue2;
        if (blurValueInput) blurValueInput.value = this.settings.blurIntensity;
        if (glowValueInput) glowValueInput.value = this.settings.glowBrightness;

        if (editorFontSizeInput) editorFontSizeInput.value = this.settings.editorFontSize;
        if (previewFontSizeInput) previewFontSizeInput.value = this.settings.previewFontSize;
        if (tabSizeInput) tabSizeInput.value = this.settings.tabSize;
        if (wordWrapSelect) wordWrapSelect.value = this.settings.wordWrap;
    },

    // Update a specific setting
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
        return this;
    },

    // Reset all settings to defaults
    resetSettings() {
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
        this.applySettings();
        this.updateControlValues();
        return this;
    },

    // Generate random hue values
    randomizeColors() {
        const randomHue1 = Math.floor(Math.random() * 360);
        const randomHue2 = Math.floor(Math.random() * 360);
        this.updateSetting('hue1', randomHue1);
        this.updateSetting('hue2', randomHue2);
        this.updateControlValues();
        return this;
    },

    // Update Monaco Editor theme colors dynamically
    updateMonacoThemeColors() {
        if (!editor || !monaco) return;

        const currentTheme = document.body.dataset.theme || 'light';
        const hue1 = this.settings.hue1;
        const hue2 = this.settings.hue2;

        console.log(`Updating Monaco theme for: ${currentTheme}, hue1: ${hue1}, hue2: ${hue2}`);

        // Create updated theme based on current theme and hue values
        let updatedTheme;

        switch (currentTheme) {
            case 'dark':
                updatedTheme = {
                    base: 'vs-dark',
                    inherit: true,
                    rules: [
                        { token: 'comment', foreground: `${this.hslToHex(hue1, 30, 60)}`, fontStyle: 'italic' },
                        { token: 'keyword', foreground: `${this.hslToHex(hue2, 50, 70)}`, fontStyle: 'bold' },
                        { token: 'string', foreground: `${this.hslToHex(hue1, 40, 65)}` },
                        { token: 'number', foreground: `${this.hslToHex(hue2, 60, 60)}` }
                    ],
                    colors: {
                        'editor.background': '#1e1e1e',
                        'editor.foreground': '#d4d4d4',
                        'editor.lineHighlightBackground': `${this.hslToHex(hue1, 10, 25)}`,
                        'editor.selectionBackground': `${this.hslToHex(hue2, 40, 35)}`,
                        'editorCursor.foreground': '#aeafad'
                    }
                };
                break;
            case 'sepia':
                updatedTheme = {
                    base: 'vs',
                    inherit: true,
                    rules: [
                        { token: 'comment', foreground: `${this.hslToHex(hue1, 25, 50)}`, fontStyle: 'italic' },
                        { token: 'keyword', foreground: `${this.hslToHex(hue2, 40, 40)}`, fontStyle: 'bold' },
                        { token: 'string', foreground: `${this.hslToHex(hue1, 50, 55)}` },
                        { token: 'number', foreground: `${this.hslToHex(hue2, 60, 45)}` }
                    ],
                    colors: {
                        'editor.background': '#f4f3ed',
                        'editor.foreground': `${this.hslToHex(hue2, 30, 30)}`,
                        'editor.lineHighlightBackground': `${this.hslToHex(hue1, 8, 90)}`,
                        'editor.selectionBackground': `${this.hslToHex(hue2, 15, 80)}`,
                        'editorCursor.foreground': `${this.hslToHex(hue2, 30, 30)}`
                    }
                };
                break;
            case 'blue':
                updatedTheme = {
                    base: 'vs',
                    inherit: true,
                    rules: [
                        { token: 'comment', foreground: `${this.hslToHex(hue1, 40, 50)}`, fontStyle: 'italic' },
                        { token: 'keyword', foreground: `${this.hslToHex(hue2, 60, 35)}`, fontStyle: 'bold' },
                        { token: 'string', foreground: `${this.hslToHex(hue1, 50, 55)}` },
                        { token: 'number', foreground: `${this.hslToHex(hue2, 70, 40)}` }
                    ],
                    colors: {
                        'editor.background': '#f0f9ff',
                        'editor.foreground': `${this.hslToHex(hue2, 60, 30)}`,
                        'editor.lineHighlightBackground': `${this.hslToHex(hue1, 15, 95)}`,
                        'editor.selectionBackground': `${this.hslToHex(hue2, 30, 85)}`,
                        'editorCursor.foreground': `${this.hslToHex(hue2, 60, 30)}`
                    }
                };
                break;
            case 'green':
                updatedTheme = {
                    base: 'vs',
                    inherit: true,
                    rules: [
                        { token: 'comment', foreground: `${this.hslToHex(hue1, 40, 50)}`, fontStyle: 'italic' },
                        { token: 'keyword', foreground: `${this.hslToHex(hue2, 60, 35)}`, fontStyle: 'bold' },
                        { token: 'string', foreground: `${this.hslToHex(hue1, 50, 45)}` },
                        { token: 'number', foreground: `${this.hslToHex(hue2, 70, 45)}` }
                    ],
                    colors: {
                        'editor.background': '#f0fdf4',
                        'editor.foreground': `${this.hslToHex(hue2, 50, 30)}`,
                        'editor.lineHighlightBackground': `${this.hslToHex(hue1, 12, 95)}`,
                        'editor.selectionBackground': `${this.hslToHex(hue2, 25, 85)}`,
                        'editorCursor.foreground': `${this.hslToHex(hue2, 50, 30)}`
                    }
                };
                break;
            default: // light
                updatedTheme = {
                    base: 'vs',
                    inherit: true,
                    rules: [
                        { token: 'comment', foreground: `${this.hslToHex(hue1, 30, 50)}`, fontStyle: 'italic' },
                        { token: 'keyword', foreground: `${this.hslToHex(hue2, 50, 40)}`, fontStyle: 'bold' },
                        { token: 'string', foreground: `${this.hslToHex(hue1, 60, 45)}` },
                        { token: 'number', foreground: `${this.hslToHex(hue2, 70, 35)}` }
                    ],
                    colors: {
                        'editor.background': '#ffffff',
                        'editor.foreground': '#212529',
                        'editor.lineHighlightBackground': `${this.hslToHex(hue1, 8, 97)}`,
                        'editor.selectionBackground': `${this.hslToHex(hue2, 30, 85)}`,
                        'editorCursor.foreground': '#212529'
                    }
                };
        }

        // Define and apply the updated theme with consistent naming
        const themeName = `custom-${currentTheme}-dynamic`;

        // Debug: log some color samples
        console.log(`Sample colors - Comment: ${updatedTheme.rules[0].foreground}, Background: ${updatedTheme.colors['editor.background']}`);

        monaco.editor.defineTheme(themeName, updatedTheme);
        monaco.editor.setTheme(themeName);
    },

    // Helper function to convert HSL to HEX
    hslToHex(h, s, l) {
        try {
            // Ensure values are in valid ranges
            h = Math.max(0, Math.min(360, h));
            s = Math.max(0, Math.min(100, s));
            l = Math.max(0, Math.min(100, l));

            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                const hexValue = Math.round(255 * color).toString(16).padStart(2, '0');
                return hexValue;
            };
            const result = `#${f(0)}${f(8)}${f(4)}`;

            // Validate result is a proper hex color
            if (!/^#[0-9A-Fa-f]{6}$/.test(result)) {
                console.warn(`Invalid hex color generated: ${result}, falling back to default`);
                return '#808080'; // Gray fallback
            }

            return result;
        } catch (error) {
            console.error('Error in hslToHex conversion:', error);
            return '#808080'; // Gray fallback
        }
    },

    // Set up handlers for settings control elements
    setupControlHandlers() {
        const h1Slider = document.getElementById('h1');
        const h2Slider = document.getElementById('h2');
        const blurSlider = document.getElementById('blur-intensity');
        const glowSlider = document.getElementById('glow-brightness');

        const h1ValueInput = document.getElementById('h1-value');
        const h2ValueInput = document.getElementById('h2-value');
        const blurValueInput = document.getElementById('blur-value');
        const glowValueInput = document.getElementById('glow-value');

        const resetBtn = document.getElementById('reset-theme-btn');
        const randomBtn = document.getElementById('random-theme-btn');

        // Handle sliders and associated number inputs
        const setupSlider = (slider, input, settingKey) => {
            if (slider) {
                slider.value = this.settings[settingKey];
                slider.addEventListener('input', () => {
                    const value = parseInt(slider.value);
                    this.updateSetting(settingKey, value);
                    if (input) input.value = value;
                });
            }
            if (input) {
                input.value = this.settings[settingKey];
                input.addEventListener('input', () => {
                    let value = parseInt(input.value);
                    if (isNaN(value)) value = this.settings[settingKey]; // Revert if invalid

                    // Get min/max from input attributes
                    const min = parseInt(input.getAttribute('min')) || 0;
                    const max = parseInt(input.getAttribute('max')) || 360;
                    value = Math.max(min, Math.min(max, value)); // Clamp

                    this.updateSetting(settingKey, value);
                    if (slider) slider.value = value;
                });
                input.addEventListener('blur', () => {
                    input.value = this.settings[settingKey]; // Ensure final value is consistent
                });
            }
        };

        setupSlider(h1Slider, h1ValueInput, 'hue1');
        setupSlider(h2Slider, h2ValueInput, 'hue2');
        setupSlider(blurSlider, blurValueInput, 'blurIntensity');
        setupSlider(glowSlider, glowValueInput, 'glowBrightness');

        // Handle reset button
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSettings();
            });
        }

        // Handle random button
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.randomizeColors();
            });
        }

        this.updateControlValues(); // Ensure all controls reflect current settings on setup
        return this;
    }
};

// Function to load Monaco Editor
function loadMonacoEditor() {
    require.config({
        paths: {
            'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs',
            // Configure markdown-it as a module path for RequireJS
            'markdown-it': 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.1.0/markdown-it.min' // Note: .min is removed, require adds it
        }
    });
    // Load Monaco Editor and markdown-it as dependencies
    require(['vs/editor/editor.main', 'markdown-it'], (monacoEditor, markdownitLib) => {

        // Define custom themes for Monaco Editor
        monaco.editor.defineTheme('custom-light', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6a994e', fontStyle: 'italic' },
                { token: 'keyword', foreground: '2a4d67', fontStyle: 'bold' },
                { token: 'string', foreground: 'bc6c25' },
                { token: 'number', foreground: '6f1d1b' }
            ],
            colors: {
                'editor.background': '#ffffff',
                'editor.foreground': '#212529',
                'editor.lineHighlightBackground': '#f8f9fa',
                'editor.selectionBackground': '#b3d7ff',
                'editorCursor.foreground': '#212529'
            }
        });

        monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '7fb069', fontStyle: 'italic' },
                { token: 'keyword', foreground: '6db4e8', fontStyle: 'bold' },
                { token: 'string', foreground: 'f4a261' },
                { token: 'number', foreground: 'e76f51' }
            ],
            colors: {
                'editor.background': '#1e1e1e',
                'editor.foreground': '#d4d4d4',
                'editor.lineHighlightBackground': '#2d2d30',
                'editor.selectionBackground': '#264f78',
                'editorCursor.foreground': '#aeafad'
            }
        });

        monaco.editor.defineTheme('custom-sepia', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '8c7b6a', fontStyle: 'italic' },
                { token: 'keyword', foreground: '5b4636', fontStyle: 'bold' },
                { token: 'string', foreground: 'd58936' },
                { token: 'number', foreground: 'b85e2e' }
            ],
            colors: {
                'editor.background': '#f3eade',
                'editor.foreground': '#5b4636',
                'editor.lineHighlightBackground': '#efe5d9',
                'editor.selectionBackground': '#e9dccc',
                'editorCursor.foreground': '#5b4636'
            }
        });

        monaco.editor.defineTheme('custom-blue', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '00796b', fontStyle: 'italic' },
                { token: 'keyword', foreground: '004d40', fontStyle: 'bold' },
                { token: 'string', foreground: '0277bd' },
                { token: 'number', foreground: '01579b' }
            ],
            colors: {
                'editor.background': '#e0f7fa',
                'editor.foreground': '#004d40',
                'editor.lineHighlightBackground': '#d4f3f7',
                'editor.selectionBackground': '#b2ebf2',
                'editorCursor.foreground': '#004d40'
            }
        });

        monaco.editor.defineTheme('custom-green', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '388e3c', fontStyle: 'italic' },
                { token: 'keyword', foreground: '1b5e20', fontStyle: 'bold' },
                { token: 'string', foreground: '2e7d32' },
                { token: 'number', foreground: '1565c0' }
            ],
            colors: {
                'editor.background': '#e8f5e9',
                'editor.foreground': '#1b5e20',
                'editor.lineHighlightBackground': '#dceddd',
                'editor.selectionBackground': '#c8e6c9',
                'editorCursor.foreground': '#1b5e20'
            }
        });

        editor = monacoEditor.editor.create(document.getElementById('markdownEditor'), {
            value: `# Welcome to the Advanced Markdown Editor!

This editor supports **live preview** and various **markdown formatting** options.

## Text Formatting Examples:
* **Bold text**: \`**text**\`
* *Italic text*: \`*text*\`
* <u>Underlined text</u>: \`<u>text</u>\`
* ~Strikethrough~: \`~text~\`
* ==Highlighted text==: \`==text==\`
* \`Inline Code\`: \`\`code\`\`
* Super<sup>script</sup>: \`<sup>script</sup>\`
* Sub<sub>script</sub>: \`<sub>script</sub>\`

### Code Blocks:
\`\`\`javascript
function hello() {
    console.log("Hello World!");
}
\`\`\`

### All Heading Levels:
# Heading 1
## Heading 2  
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

### Different List Types:
**Unordered List:**
* Item 1
* Item 2
    * Nested item

**Ordered List:**
1. First item
2. Second item

**Checklist:**
- [ ] Task to do
- [x] Completed task
- [ ] Another task

### Other Elements:
> Blockquotes are great for emphasizing text.

[Links](https://www.example.com) and images work too!

---

### Enhanced Table Examples:

**Simple Table:**
| Name | Age | City |
|------|-----|------|
| John | 25 | New York |
| Jane | 30 | Los Angeles |
| Bob | 35 | Chicago |

**Advanced Table with Different Content:**
| Feature | Status | Notes |
|---------|--------|-------|
| **Text Formatting** | ✅ Complete | Bold, italic, highlight, etc. |
| *Smart Paste* | ✅ Complete | Auto-detect content type |
| \`Code Blocks\` | ✅ Complete | Syntax highlighting |
| ==Table Styling== | ✅ NEW! | Beautiful, responsive tables |
| Text Transform | ✅ NEW! | UPPERCASE, lowercase, Capitalize |

**Data Table:**
| Product | Price | Stock | Category |
|---------|-------|-------|----------|
| Laptop | $999 | 15 | Electronics |
| Phone | $699 | 32 | Electronics |
| Book | $19 | 150 | Education |
| Desk | $299 | 8 | Furniture |

### New Text Transformation Tools:
Use the new toolbar buttons to:
- Transform to **UPPERCASE**
- Transform to **lowercase** 
- **Capitalize Each Word**
- Convert to **Sentence case**
- Remove extra spaces
- Trim line whitespace
- Sort lines alphabetically
- Reverse line order

Try selecting text and using the new formatting tools!
`,
            language: 'markdown',
            theme: 'custom-light-dynamic', // Start with a dynamic theme
            automaticLayout: true,
            fontSize: 14, // Will be updated by ThemeSettingsManager
            wordWrap: 'on', // Will be updated by ThemeSettingsManager
            tabSize: 4, // Will be updated by ThemeSettingsManager
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            overviewRulerLanes: 0,
        });

        // Initialize markdown-it using the loaded module
        md = markdownitLib({
            html: true,
            linkify: true,
            typographer: true,
            breaks: true
        });

        // Add support for highlighting syntax
        md.use(function (md) {
            md.renderer.rules.mark_open = function () { return '<mark>'; };
            md.renderer.rules.mark_close = function () { return '</mark>'; };
        });

        // Custom rule for == highlighting ==
        md.inline.ruler.before('emphasis', 'mark', function (state, silent) {
            const start = state.pos;
            const marker = 0x3D; // '='

            if (state.src.charCodeAt(start) !== marker) return false;
            if (state.src.charCodeAt(start + 1) !== marker) return false;
            if (start + 4 >= state.posMax) return false;

            const end = state.src.indexOf('==', start + 2);
            if (end === -1) return false;

            if (!silent) {
                const token_o = state.push('mark_open', 'mark', 1);
                const token_c = state.push('mark_close', 'mark', -1);

                token_o.markup = '==';
                token_c.markup = '==';
            }

            state.pos = start + 2;
            state.posMax = end;
            state.md.inline.tokenize(state);
            state.pos = end + 2;
            state.posMax = state.src.length;

            return true;
        });

        // Update preview on editor content change
        editor.onDidChangeModelContent(updatePreview);
        editor.onDidChangeModelContent(trackChanges); // Track changes for auto-save
        updatePreview(); // Initial preview update

        // Apply ThemeSettingsManager settings to the editor once it's ready
        setTimeout(() => {
            if (ThemeSettingsManager && ThemeSettingsManager.settings) {
                ThemeSettingsManager.applySettings();
            }
        }, 100);
    });
}

// Function to get Monaco theme based on current page theme
function getMonacoThemeForCurrentTheme() {
    const currentTheme = document.body.dataset.theme || localStorage.getItem('selectedTheme') || 'light';
    return getMonacoThemeForTheme(currentTheme);
}

// Function to update Monaco Editor theme
function updateMonacoTheme(theme) {
    if (editor) {
        const monacoTheme = getMonacoThemeForTheme(theme);
        monaco.editor.setTheme(monacoTheme);
    }
}

// Helper function to get Monaco theme for specific theme
function getMonacoThemeForTheme(theme) {
    switch (theme) {
        case 'dark':
            return 'custom-dark';
        case 'sepia':
            return 'custom-sepia';
        case 'blue':
            return 'custom-blue';
        case 'green':
            return 'custom-green';
        case 'light':
        default:
            return 'custom-light';
    }
}

// Smart paste functions
async function handleSmartPaste() {
    try {
        const text = await navigator.clipboard.readText();
        if (text) {
            const formattedText = convertToMarkdown(text);
            insertAtCursor(formattedText);
        }
    } catch (err) {
        console.error('Could not read clipboard contents: ', err);
        // Fallback: prompt user to paste text
        const text = prompt('Paste your text here:');
        if (text) {
            const formattedText = convertToMarkdown(text);
            insertAtCursor(formattedText);
        }
    }
}

async function handlePasteAsCode() {
    try {
        const text = await navigator.clipboard.readText();
        if (text) {
            const language = prompt('Enter programming language (optional):', 'javascript');
            const codeBlock = `\`\`\`${language || ''}\n${text}\n\`\`\``;
            insertAtCursor(codeBlock);
        }
    } catch (err) {
        console.error('Could not read clipboard contents: ', err);
        const text = prompt('Paste your code here:');
        if (text) {
            const language = prompt('Enter programming language (optional):', 'javascript');
            const codeBlock = `\`\`\`${language || ''}\n${text}\n\`\`\``;
            insertAtCursor(codeBlock);
        }
    }
}

async function handlePasteAsQuote() {
    try {
        const text = await navigator.clipboard.readText();
        if (text) {
            const quotedText = text.split('\n').map(line => `> ${line}`).join('\n');
            insertAtCursor(quotedText);
        }
    } catch (err) {
        console.error('Could not read clipboard contents: ', err);
        const text = prompt('Paste your text to quote:');
        if (text) {
            const quotedText = text.split('\n').map(line => `> ${line}`).join('\n');
            insertAtCursor(quotedText);
        }
    }
}

// Intelligent text to markdown converter
function convertToMarkdown(text) {
    // Detect and convert URLs to links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)');

    // Detect email addresses
    text = text.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '[$1](mailto:$1)');

    // Detect HTML content and convert basic tags
    if (text.includes('<') && text.includes('>')) {
        text = convertHtmlToMarkdown(text);
    }

    // Detect tabular data and convert to markdown table
    if (isTabularData(text)) {
        text = convertTabularDataToMarkdown(text);
    }

    // Detect numbered lists and convert to markdown
    text = text.replace(/^(\d+\.\s+)(.+)$/gm, '$1$2');

    // Detect bullet points and convert to markdown
    text = text.replace(/^[•·\-\*]\s+(.+)$/gm, '- $1');

    // Clean up multiple newlines
    text = text.replace(/\n{3,}/g, '\n\n');

    return text;
}

// Convert basic HTML to Markdown
function convertHtmlToMarkdown(html) {
    let markdown = html;

    // Headers
    markdown = markdown.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (match, level, content) => {
        return '#'.repeat(parseInt(level)) + ' ' + content.trim();
    });

    // Bold and italic
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

    // Links
    markdown = markdown.replace(/<a[^>]*href=["\']([^"\']*)["\'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Images
    markdown = markdown.replace(/<img[^>]*src=["\']([^"\']*)["\'][^>]*alt=["\']([^"\']*)["\'][^>]*>/gi, '![$2]($1)');
    markdown = markdown.replace(/<img[^>]*alt=["\']([^"\']*)["\'][^>]*src=["\']([^"\']*)["\'][^>]*>/gi, '![$1]($2)');

    // Code
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```');

    // Lists
    markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n');
    });

    markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
        let counter = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/gis, () => `${counter++}. $1\n`);
    });

    // Blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1');

    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]*>/g, '');

    // Clean up whitespace
    markdown = markdown.replace(/\n\s*\n/g, '\n\n').trim();

    return markdown;
}

// Check if text appears to be tabular data
function isTabularData(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return false;

    // Check for common delimiters
    const delimiters = ['\t', ',', ';', '|'];
    for (const delimiter of delimiters) {
        const firstLineCount = (lines[0].match(new RegExp(delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        if (firstLineCount > 0) {
            // Check if other lines have similar delimiter count
            const similarLines = lines.slice(1, Math.min(5, lines.length)).filter(line => {
                const count = (line.match(new RegExp(delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
                return Math.abs(count - firstLineCount) <= 1;
            });
            if (similarLines.length >= Math.min(2, lines.length - 1)) {
                return true;
            }
        }
    }
    return false;
}

// Convert tabular data to markdown table
function convertTabularDataToMarkdown(text) {
    const lines = text.trim().split('\n');

    // Detect delimiter
    const delimiters = ['\t', ',', ';', '|'];
    let bestDelimiter = ',';
    let maxCount = 0;

    for (const delimiter of delimiters) {
        const count = (lines[0].match(new RegExp(delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        if (count > maxCount) {
            maxCount = count;
            bestDelimiter = delimiter;
        }
    }

    // Parse rows
    const rows = lines.map(line =>
        line.split(bestDelimiter).map(cell => cell.trim().replace(/^["']|["']$/g, ''))
    );

    // Generate markdown table
    let markdown = '';

    // Header row
    markdown += '| ' + rows[0].join(' | ') + ' |\n';

    // Separator row
    markdown += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n';

    // Data rows
    for (let i = 1; i < rows.length; i++) {
        markdown += '| ' + rows[i].join(' | ') + ' |\n';
    }

    return markdown;
}

// Helper function to insert text at cursor position
function insertAtCursor(text) {
    if (!editor) return;

    const selection = editor.getSelection();
    const range = new monaco.Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn
    );

    editor.executeEdits('smart-paste', [{
        range: range,
        text: text
    }]);

    editor.focus();
}

// Helper function to transform selected text
function transformSelectedText(transformFn) {
    if (!editor) return;

    const selection = editor.getSelection();
    const model = editor.getModel();

    // If there's no selection, select the entire document
    let range = selection;
    if (selection.isEmpty()) {
        const lastLine = model.getLineCount();
        const lastColumn = model.getLineMaxColumn(lastLine);
        range = new monaco.Range(1, 1, lastLine, lastColumn);
    }

    // Get selected text
    const selectedText = model.getValueInRange(range);

    if (!selectedText.trim()) {
        return; // Nothing to transform
    }

    // Apply transformation
    const transformedText = transformFn(selectedText);

    // Replace selected text with transformed text
    editor.executeEdits('text-transform', [{
        range: range,
        text: transformedText
    }]);

    // Restore selection
    if (!selection.isEmpty()) {
        editor.setSelection(new monaco.Selection(
            range.startLineNumber,
            range.startColumn,
            range.startLineNumber,
            range.startColumn + transformedText.length
        ));
    }

    editor.focus();
}

// Function to apply markdown formatting
function applyMarkdownFormat(formatType) {
    if (!editor) return;

    const selection = editor.getSelection();
    const selectedText = editor.getModel().getValueInRange(selection);
    let newText = selectedText;
    let startColumn = selection.startColumn;
    let endColumn = selection.endColumn;

    switch (formatType) {
        case 'bold':
            newText = `**${selectedText}**`;
            startColumn += 2;
            endColumn += 2;
            break;
        case 'italic':
            newText = `*${selectedText}*`;
            startColumn += 1;
            endColumn += 1;
            break;
        case 'underline':
            newText = `<u>${selectedText}</u>`;
            startColumn += 3;
            endColumn += 3;
            break;
        case 'strikethrough':
            newText = `~${selectedText}~`;
            startColumn += 1;
            endColumn += 1;
            break;
        case 'highlight':
            newText = `==${selectedText}==`;
            startColumn += 2;
            endColumn += 2;
            break;
        case 'code':
            newText = `\`${selectedText}\``;
            startColumn += 1;
            endColumn += 1;
            break;
        case 'code-block':
            const language = prompt('Enter language (optional):', 'javascript');
            newText = `\`\`\`${language || ''}\n${selectedText || 'Your code here'}\n\`\`\``;
            if (!selectedText) {
                startColumn = selection.startColumn + (language ? language.length + 4 : 4);
                endColumn = startColumn + 'Your code here'.length;
            }
            break;
        case 'superscript':
            newText = `<sup>${selectedText}</sup>`;
            startColumn += 5;
            endColumn += 5;
            break;
        case 'subscript':
            newText = `<sub>${selectedText}</sub>`;
            startColumn += 5;
            endColumn += 5;
            break;
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            const headingPrefix = '#'.repeat(parseInt(formatType.replace('h', '')));
            const currentLine = editor.getModel().getLineContent(selection.startLineNumber);
            if (currentLine.startsWith(headingPrefix + ' ')) {
                // Remove heading if already present
                newText = currentLine.substring(headingPrefix.length + 1);
                editor.executeEdits('my-source', [{
                    range: new monaco.Range(selection.startLineNumber, 1, selection.startLineNumber, currentLine.length + 1),
                    text: newText
                }]);
                return;
            } else {
                newText = `${headingPrefix} ${selectedText || 'Your Heading'}`;
                if (!selectedText) {
                    startColumn = selection.startColumn + headingPrefix.length + 1;
                    endColumn = startColumn + 'Your Heading'.length;
                } else {
                    startColumn = selection.startColumn + headingPrefix.length + 1;
                    endColumn = selection.endColumn + headingPrefix.length + 1;
                }
            }
            break;
        case 'unordered-list':
            const linesUL = selectedText.split('\n').map(line => `- ${line}`).join('\n');
            newText = linesUL;
            break;
        case 'ordered-list':
            const linesOL = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
            newText = linesOL;
            break;
        case 'checklist':
            const linesChecklist = selectedText.split('\n').map(line => `- [ ] ${line}`).join('\n');
            newText = linesChecklist;
            break;
        case 'blockquote':
            const linesBQ = selectedText.split('\n').map(line => `> ${line}`).join('\n');
            newText = linesBQ;
            break;
        case 'link':
            const url = prompt('Enter URL:', 'https://example.com');
            if (url) {
                newText = `[${selectedText || 'Link Text'}](${url})`;
                if (!selectedText) {
                    startColumn = selection.startColumn + 1;
                    endColumn = startColumn + 'Link Text'.length;
                } else {
                    startColumn = selection.startColumn + 1;
                    endColumn = selection.endColumn + 1;
                }
            } else {
                return; // Do nothing if no URL entered
            }
            break;
        case 'image':
            const imageUrl = prompt('Enter Image URL:', 'https://placehold.co/150x100/000/FFF?text=Image');
            const altText = prompt('Enter Alt Text:', 'Image description');
            if (imageUrl) {
                newText = `![${altText || 'Image description'}](${imageUrl})`;
                if (!selectedText) {
                    startColumn = selection.startColumn + 2;
                    endColumn = startColumn + (altText || 'Image description').length;
                } else {
                    startColumn = selection.startColumn + 2;
                    endColumn = selection.endColumn + 2;
                }
            } else {
                return; // Do nothing if no URL entered
            }
            break;
        case 'table':
            newText = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`;
            break;
        case 'horizontal-rule':
            newText = `\n---\n`;
            break;
        case 'smart-paste':
            handleSmartPaste();
            return;
        case 'paste-as-code':
            handlePasteAsCode();
            return;
        case 'paste-as-quote':
            handlePasteAsQuote();
            return;
        case 'advanced-paste':
            openAdvancedPasteModal();
            return;
        case 'uppercase':
            transformSelectedText(text => text.toUpperCase());
            return;
        case 'lowercase':
            transformSelectedText(text => text.toLowerCase());
            return;
        case 'capitalize':
            transformSelectedText(text => {
                return text.replace(/\b\w/g, char => char.toUpperCase());
            });
            return;
        case 'sentence-case':
            transformSelectedText(text => {
                return text.toLowerCase().replace(/(^\w|\.\s+\w)/g, char => char.toUpperCase());
            });
            return;
        case 'remove-spaces':
            transformSelectedText(text => {
                return text.replace(/\s+/g, ' ').trim();
            });
            return;
        case 'trim-lines':
            transformSelectedText(text => {
                return text.split('\n').map(line => line.trim()).join('\n');
            });
            return;
        case 'sort-lines':
            transformSelectedText(text => {
                return text.split('\n').sort().join('\n');
            });
            return;
        case 'reverse-lines':
            transformSelectedText(text => {
                return text.split('\n').reverse().join('\n');
            });
            return;
        default:
            return;
    }

    editor.executeEdits('my-source', [{
        range: selection,
        text: newText
    }]);

    // Set new selection
    if (['bold', 'italic', 'underline', 'strikethrough', 'highlight', 'code', 'code-block', 'superscript', 'subscript', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'link', 'image'].includes(formatType) && !selectedText) {
        editor.setSelection(new monaco.Selection(
            selection.startLineNumber, startColumn,
            selection.endLineNumber, endColumn
        ));
    }
    editor.focus();
}

// Function to update the preview
function updatePreview() {
    if (editor && md) {
        const markdownText = editor.getValue();
        document.getElementById('previewContainer').innerHTML = md.render(markdownText);
    }
}

// Theme switching logic
const themeToggle = document.getElementById('themeToggle');
const themeOptions = document.getElementById('theme-options');
const themeOptionElements = document.querySelectorAll('.theme-option');

themeToggle.addEventListener('click', () => {
    themeOptions.classList.toggle('active');
});

themeOptionElements.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        document.body.dataset.theme = theme;
        localStorage.setItem('selectedTheme', theme); // Save theme preference
        themeOptions.classList.remove('active');

        // Update Monaco Editor theme using ThemeSettingsManager
        updateMonacoTheme(theme);

        // Update Monaco theme colors with current hue values
        ThemeSettingsManager.updateMonacoThemeColors();
    });
});

// Close theme options if clicked outside
document.addEventListener('click', (event) => {
    if (!themeToggle.contains(event.target) && !themeOptions.contains(event.target)) {
        themeOptions.classList.remove('active');
    }
});

// Apply saved theme on load
const savedTheme = localStorage.getItem('selectedTheme');
if (savedTheme) {
    document.body.dataset.theme = savedTheme;
    updateMonacoTheme(savedTheme);
}

// Modal handling
const modals = document.querySelectorAll('.modal, .panel-modal');
const openModalButtons = {
    'generateBtn': 'generatorModal',
    'analyzeBtn': 'textAnalysisModal',
    'convertBtn': 'convertModal',
    'settingsBtn': 'settingsModal'
};

Object.entries(openModalButtons).forEach(([btnId, modalId]) => {
    document.getElementById(btnId).addEventListener('click', () => {
        document.getElementById(modalId).classList.add('active');
        if (modalId === 'textAnalysisModal') {
            analyzeText();
        } else if (modalId === 'settingsModal') {
            loadSettings();
        } else if (modalId === 'generatorModal') {
            document.getElementById('generatorOutput').style.display = 'none';
            document.getElementById('generatorOutput').textContent = '';
        } else if (modalId === 'convertModal') {
            document.getElementById('convertedOutput').style.display = 'none';
            document.getElementById('convertedOutput').textContent = '';
        }
    });
});

document.querySelectorAll('.close-panel, .close-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const modalId = event.target.dataset.modalId || event.target.closest('.panel-modal, .modal').id;
        document.getElementById(modalId).classList.remove('active');
    });
});

// Close modals if clicked outside content
modals.forEach(modal => {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Advanced Paste Modal Event Listeners
document.getElementById('conversionType').addEventListener('change', updateConversionOptions);
document.getElementById('previewConversionBtn').addEventListener('click', previewConversion);
document.getElementById('applyPasteBtn').addEventListener('click', applyAdvancedPaste);

// Auto-update preview when input changes
document.getElementById('pasteInput').addEventListener('input', () => {
    if (document.getElementById('conversionPreview').style.display !== 'none') {
        previewConversion();
    }
});

// Update preview when options change
document.getElementById('tableDelimiter').addEventListener('change', () => {
    if (document.getElementById('conversionPreview').style.display !== 'none') {
        previewConversion();
    }
});

document.getElementById('hasHeaders').addEventListener('change', () => {
    if (document.getElementById('conversionPreview').style.display !== 'none') {
        previewConversion();
    }
});

document.getElementById('codeLanguage').addEventListener('change', () => {
    if (document.getElementById('conversionPreview').style.display !== 'none') {
        previewConversion();
    }
});

document.getElementById('listType').addEventListener('change', () => {
    if (document.getElementById('conversionPreview').style.display !== 'none') {
        previewConversion();
    }
});

// Markdown Toolbar functionality
document.querySelectorAll('.markdown-toolbar .control-btn').forEach(button => {
    button.addEventListener('click', () => {
        const formatType = button.dataset.format;
        applyMarkdownFormat(formatType);
    });
});

// Copy Markdown/HTML functionality
document.getElementById('copyMarkdownBtn').addEventListener('click', () => {
    if (editor) {
        const markdownText = editor.getValue();
        copyToClipboard(markdownText, 'Markdown copied to clipboard!');
    }
});

document.getElementById('copyHtmlBtn').addEventListener('click', () => {
    if (md) {
        const htmlText = md.render(editor.getValue());
        copyToClipboard(htmlText, 'HTML copied to clipboard!');
    }
});

function copyToClipboard(text, message) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        // Display a temporary message to the user
        const msgDiv = document.createElement('div');
        msgDiv.textContent = message;
        msgDiv.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: var(--secondary-bg-color);
                    color: var(--main-text-color);
                    padding: 10px 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                `;
        document.body.appendChild(msgDiv);
        setTimeout(() => {
            msgDiv.style.opacity = 1;
        }, 10); // Small delay to trigger transition
        setTimeout(() => {
            msgDiv.style.opacity = 0;
            msgDiv.addEventListener('transitionend', () => msgDiv.remove());
        }, 2000); // Message disappears after 2 seconds
    } catch (err) {
        console.error('Failed to copy text: ', err);
    } finally {
        document.body.removeChild(textarea);
    }
}

// Clear Editor functionality
document.getElementById('clearEditorBtn').addEventListener('click', () => {
    if (editor) {
        editor.setValue('');
    }
});

// Generator Modal functionality
document.getElementById('generateContentBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('generatorPrompt').value;
    const length = document.getElementById('generatorLength').value;
    const tone = document.getElementById('generatorTone').value;
    const outputDiv = document.getElementById('generatorOutput');
    const loadingDiv = document.getElementById('generatorLoading');

    if (!prompt) {
        outputDiv.style.display = 'block';
        outputDiv.textContent = 'Please enter a prompt.';
        return;
    }

    loadingDiv.style.display = 'block';
    outputDiv.style.display = 'none';
    outputDiv.textContent = '';

    try {
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: `Generate a ${tone} text of approximately ${length} words based on the following prompt: "${prompt}".` }] });
        const payload = { contents: chatHistory };
        const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            outputDiv.textContent = text;
            outputDiv.style.display = 'block';
        } else {
            outputDiv.textContent = 'Failed to generate content. Please try again.';
            outputDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error generating content:', error);
        outputDiv.textContent = 'An error occurred while generating content.';
        outputDiv.style.display = 'block';
    } finally {
        loadingDiv.style.display = 'none';
    }
});

// Text Analysis Modal functionality
function analyzeText() {
    const text = editor.getValue();

    // Basic statistics
    const charCount = text.length;
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const sentenceCount = (text.match(/[.!?]\s*|[.!?]$/g) || []).length;
    const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

    document.getElementById('charCount').textContent = charCount;
    document.getElementById('wordCount').textContent = wordCount;
    document.getElementById('sentenceCount').textContent = sentenceCount;
    document.getElementById('paragraphCount').textContent = paragraphCount;

    // Readability (simplified for demonstration)
    // Flesch-Kincaid Grade Level: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    // Automated Readability Index: 4.71 * (characters/words) + 0.5 * (words/sentences) - 21.43
    // These require syllable counting, which is complex. Providing placeholders.
    document.getElementById('fleschKincaid').textContent = 'N/A';
    document.getElementById('ari').textContent = 'N/A';

    // Word Frequency
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFrequency = {};
    words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    const sortedWords = Object.entries(wordFrequency).sort(([, countA], [, countB]) => countB - countA);
    const wordFrequencyList = document.getElementById('wordFrequencyList');
    wordFrequencyList.innerHTML = ''; // Clear previous list

    if (sortedWords.length === 0) {
        wordFrequencyList.innerHTML = '<p>No words to display.</p>';
    } else {
        sortedWords.slice(0, 20).forEach(([word, count]) => { // Show top 20
            const p = document.createElement('p');
            p.textContent = `${word}: ${count}`;
            wordFrequencyList.appendChild(p);
        });
    }
}

// Convert Modal functionality
document.getElementById('performConvertBtn').addEventListener('click', () => {
    const format = document.getElementById('convertFormat').value;
    const markdownText = editor.getValue();
    const convertedOutputDiv = document.getElementById('convertedOutput');

    convertedOutputDiv.style.display = 'block';

    if (format === 'html') {
        convertedOutputDiv.textContent = md.render(markdownText);
    } else if (format === 'text') {
        // Simple conversion to plain text by removing markdown syntax
        let plainText = markdownText
            .replace(/^(#+\s*)/gm, '') // Remove headings
            .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
            .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic
            .replace(/~([^~]+)~/g, '$1') // Remove strikethrough
            .replace(/`([^`]+)`/g, '$1') // Remove inline code
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
            .replace(/^(\s*[-*+]|\s*\d+\.)\s+/gm, '') // Remove list markers
            .replace(/^>\s*/gm, '') // Remove blockquote markers
            .replace(/---/g, '') // Remove horizontal rules
            .replace(/\|/g, ' ') // Replace table pipes with space
            .replace(/\n\s*\n/g, '\n\n') // Normalize multiple newlines
            .trim();
        convertedOutputDiv.textContent = plainText;
    }
});

// Settings Modal functionality
function loadSettings() {
    // Load settings through ThemeSettingsManager
    ThemeSettingsManager.updateControlValues();
}

// Apply Settings button functionality
document.getElementById('applySettingsBtn').addEventListener('click', () => {
    const editorFontSize = document.getElementById('editorFontSize').value;
    const previewFontSize = document.getElementById('previewFontSize').value;
    const tabSize = document.getElementById('tabSize').value;
    const wordWrap = document.getElementById('wordWrap').value;

    // Update ThemeSettingsManager with new values
    ThemeSettingsManager.updateSetting('editorFontSize', parseInt(editorFontSize));
    ThemeSettingsManager.updateSetting('previewFontSize', parseInt(previewFontSize));
    ThemeSettingsManager.updateSetting('tabSize', parseInt(tabSize));
    ThemeSettingsManager.updateSetting('wordWrap', wordWrap);

    // Close settings modal
    document.getElementById('settingsModal').classList.remove('active');
});

// Auto-save functionality
let autoSaveInterval;
let hasUnsavedChanges = false;
let lastSavedContent = '';

function enableAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }

    // Auto-save every 30 seconds
    autoSaveInterval = setInterval(() => {
        if (editor && document.getElementById('autoSaveEnabled').checked) {
            saveToLocalStorage();
        }
    }, 30000);
}

function disableAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

// Track changes in the editor
function trackChanges() {
    if (!editor) return;

    const currentContent = editor.getValue();
    hasUnsavedChanges = currentContent !== lastSavedContent;

    // Update page title to show unsaved changes
    const title = document.title;
    if (hasUnsavedChanges && !title.startsWith('*')) {
        document.title = '* ' + title;
    } else if (!hasUnsavedChanges && title.startsWith('*')) {
        document.title = title.substring(2);
    }
}

// Update last saved content when saving
function updateLastSavedContent() {
    if (editor) {
        lastSavedContent = editor.getValue();
        hasUnsavedChanges = false;

        // Remove asterisk from title
        const title = document.title;
        if (title.startsWith('*')) {
            document.title = title.substring(2);
        }
    }
}

// Auto-save before page unload
function handleBeforeUnload(event) {
    // Always save current content before leaving
    if (editor) {
        const content = editor.getValue();
        if (content.trim()) {
            // Save to localStorage immediately
            const timestamp = new Date().toISOString();
            const saveData = {
                content: content,
                timestamp: timestamp,
                filename: document.getElementById('saveFileName')?.value || 'markdown-document',
                autoSaved: true // Mark as auto-saved
            };

            localStorage.setItem('markdownEditorContent', JSON.stringify(saveData));
            localStorage.setItem('markdownEditorAutoSave', JSON.stringify(saveData));

            console.log('Content auto-saved before page unload');
        }
    }

    // Show confirmation dialog if there are unsaved changes
    if (hasUnsavedChanges) {
        const message = 'Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę? Zawartość została automatycznie zapisana.';
        event.preventDefault();
        event.returnValue = message;
        return message;
    }
}

// Load auto-saved content with user confirmation
function loadAutoSavedContent() {
    const autoSavedData = localStorage.getItem('markdownEditorAutoSave');
    const regularSavedData = localStorage.getItem('markdownEditorContent');

    if (autoSavedData) {
        try {
            const autoSaved = JSON.parse(autoSavedData);
            const autoSavedTime = new Date(autoSaved.timestamp);

            let shouldLoadAutoSave = true;

            // Check if there's also regular saved data
            if (regularSavedData) {
                const regularSaved = JSON.parse(regularSavedData);
                const regularSavedTime = new Date(regularSaved.timestamp);

                // If auto-save is newer and different, ask user
                if (autoSavedTime > regularSavedTime && autoSaved.content !== regularSaved.content) {
                    const message = `Znaleziono automatycznie zapisaną zawartość z ${autoSavedTime.toLocaleString()}.\nCzy chcesz ją przywrócić?\n\n(Kliknij "OK" aby przywrócić auto-save lub "Anuluj" aby załadować ostatni ręczny zapis)`;
                    shouldLoadAutoSave = confirm(message);
                }
            } else {
                // Only auto-save exists, ask if user wants to restore
                const message = `Znaleziono automatycznie zapisaną zawartość z ${autoSavedTime.toLocaleString()}.\nCzy chcesz ją przywrócić?`;
                shouldLoadAutoSave = confirm(message);
            }

            if (shouldLoadAutoSave && editor) {
                editor.setValue(autoSaved.content);

                // Update filename in save modal if it exists
                const filenameInput = document.getElementById('saveFileName');
                if (filenameInput && autoSaved.filename) {
                    filenameInput.value = autoSaved.filename;
                }

                showSaveStatus(`Przywrócono automatycznie zapisaną zawartość z ${autoSavedTime.toLocaleString()}`, 'success');

                // Clear auto-save after successful restore
                localStorage.removeItem('markdownEditorAutoSave');

                // Set as current saved content
                updateLastSavedContent();

                return true; // Indicate auto-save was loaded
            }
        } catch (error) {
            console.error('Error loading auto-saved content:', error);
        }

        // Clear invalid auto-save data
        localStorage.removeItem('markdownEditorAutoSave');
    }

    return false; // Indicate auto-save was not loaded
}

// Event Listeners for Save Locally functionality
document.addEventListener('DOMContentLoaded', () => {
    // Save Locally button
    document.getElementById('saveLocallyBtn').addEventListener('click', () => {
        document.getElementById('saveLocallyModal').classList.add('active');
    });

    // Download File button
    document.getElementById('downloadFileBtn').addEventListener('click', () => {
        if (!editor) {
            showSaveStatus('Editor not ready. Please wait a moment and try again.', 'error');
            return;
        }

        const content = editor.getValue();
        const filename = document.getElementById('saveFileName').value || 'markdown-document';
        const format = document.getElementById('saveFormat').value;

        if (!content.trim()) {
            showSaveStatus('No content to save. Please write something first.', 'error');
            return;
        }

        try {
            downloadFile(content, filename, format);
            showSaveStatus(`File downloaded as ${filename}.${format}`, 'success');
        } catch (error) {
            showSaveStatus('Error downloading file. Please try again.', 'error');
            console.error('Download error:', error);
        }
    });

    // Save to Storage button
    document.getElementById('saveToStorageBtn').addEventListener('click', () => {
        if (!editor) {
            showSaveStatus('Editor not ready. Please wait a moment and try again.', 'error');
            return;
        }

        const content = editor.getValue();
        if (!content.trim()) {
            showSaveStatus('No content to save. Please write something first.', 'error');
            return;
        }

        saveToLocalStorage();
    });

    // Auto-save checkbox
    document.getElementById('autoSaveEnabled').addEventListener('change', (e) => {
        if (e.target.checked) {
            enableAutoSave();
            showSaveStatus('Auto-save enabled. Content will be saved every 30 seconds.', 'success');
        } else {
            disableAutoSave();
            showSaveStatus('Auto-save disabled.', 'info');
        }
    });

    // Load auto-save preference
    const autoSaveEnabled = localStorage.getItem('autoSaveEnabled');
    if (autoSaveEnabled === 'true') {
        document.getElementById('autoSaveEnabled').checked = true;
        enableAutoSave();
    }

    // Save auto-save preference
    document.getElementById('autoSaveEnabled').addEventListener('change', (e) => {
        localStorage.setItem('autoSaveEnabled', e.target.checked);
    });

    // Add beforeunload event listener to prevent data loss
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Also add pagehide event for mobile browsers
    window.addEventListener('pagehide', handleBeforeUnload);
});

// Initialize Monaco Editor and Markdown-it on window load
window.onload = function () {
    loadMonacoEditor();

    // Initialize ThemeSettingsManager after editor is loaded
    setTimeout(() => {
        ThemeSettingsManager.init();
    }, 500);

    // Load saved content after a short delay to ensure editor is ready
    setTimeout(() => {
        loadFromLocalStorage();
    }, 1000);
};

// Advanced Paste Modal Functions
function openAdvancedPasteModal() {
    document.getElementById('advancedPasteModal').classList.add('active');

    // Try to get clipboard content and populate the input
    navigator.clipboard.readText().then(text => {
        document.getElementById('pasteInput').value = text;
        updateConversionOptions();
    }).catch(err => {
        console.log('Could not read clipboard: ', err);
        // Focus on input for manual paste
        document.getElementById('pasteInput').focus();
    });
}

function updateConversionOptions() {
    const conversionType = document.getElementById('conversionType').value;

    // Hide all option groups
    document.querySelectorAll('.conversion-options').forEach(el => {
        el.style.display = 'none';
    });

    // Show relevant option group
    switch (conversionType) {
        case 'table':
            document.getElementById('tableOptions').style.display = 'block';
            break;
        case 'code':
            document.getElementById('codeOptions').style.display = 'block';
            break;
        case 'list':
            document.getElementById('listOptions').style.display = 'block';
            break;
    }
}

function previewConversion() {
    const inputText = document.getElementById('pasteInput').value;
    const conversionType = document.getElementById('conversionType').value;
    const previewDiv = document.getElementById('conversionPreview');

    if (!inputText.trim()) {
        previewDiv.style.display = 'none';
        return;
    }

    let convertedText = '';

    switch (conversionType) {
        case 'auto':
            convertedText = convertToMarkdown(inputText);
            break;
        case 'table':
            convertedText = convertToTable(inputText);
            break;
        case 'html':
            convertedText = convertHtmlToMarkdown(inputText);
            break;
        case 'code':
            convertedText = convertToCodeBlock(inputText);
            break;
        case 'quote':
            convertedText = convertToQuote(inputText);
            break;
        case 'list':
            convertedText = convertToList(inputText);
            break;
        case 'plain':
            convertedText = inputText;
            break;
        default:
            convertedText = inputText;
    }

    previewDiv.textContent = convertedText;
    previewDiv.style.display = 'block';
}

function convertToTable(text) {
    const delimiter = document.getElementById('tableDelimiter').value;
    const hasHeaders = document.getElementById('hasHeaders').checked;
    return convertTabularDataToMarkdown(text);
}

function convertToCodeBlock(text) {
    const language = document.getElementById('codeLanguage').value;
    return `\`\`\`${language}\n${text}\n\`\`\``;
}

function convertToQuote(text) {
    return text.split('\n').map(line => `> ${line}`).join('\n');
}

function convertToList(text) {
    const listType = document.getElementById('listType').value;
    const lines = text.split('\n').filter(line => line.trim());

    switch (listType) {
        case 'unordered':
            return lines.map(line => `- ${line.trim()}`).join('\n');
        case 'ordered':
            return lines.map((line, i) => `${i + 1}. ${line.trim()}`).join('\n');
        case 'checklist':
            return lines.map(line => `- [ ] ${line.trim()}`).join('\n');
        default:
            return lines.map(line => `- ${line.trim()}`).join('\n');
    }
}

function applyAdvancedPaste() {
    const inputText = document.getElementById('pasteInput').value;
    const conversionType = document.getElementById('conversionType').value;

    if (!inputText.trim()) {
        alert('Please enter some text to convert.');
        return;
    }

    let convertedText = '';

    switch (conversionType) {
        case 'auto':
            convertedText = convertToMarkdown(inputText);
            break;
        case 'table':
            convertedText = convertToTable(inputText);
            break;
        case 'html':
            convertedText = convertHtmlToMarkdown(inputText);
            break;
        case 'code':
            convertedText = convertToCodeBlock(inputText);
            break;
        case 'quote':
            convertedText = convertToQuote(inputText);
            break;
        case 'list':
            convertedText = convertToList(inputText);
            break;
        case 'plain':
            convertedText = inputText;
            break;
        default:
            convertedText = inputText;
    }

    insertAtCursor(convertedText);

    // Close modal and clear input
    document.getElementById('advancedPasteModal').classList.remove('active');
    document.getElementById('pasteInput').value = '';
    document.getElementById('conversionPreview').style.display = 'none';
}

// Theme color settings are now handled by ThemeSettingsManager.setupControlHandlers()

// Table Sorting Modal functionality (placeholder)
document.getElementById('sortTableModal').addEventListener('click', (event) => {
    // This modal is not directly opened by a top-level button, but by table tools.
    // Placeholder for future implementation.
    if (event.target.id === 'applySortBtn') {
        // Logic to apply sort to the current table in editor
        console.log('Applying table sort...');
        document.getElementById('sortTableModal').classList.remove('active');
    }
});

// Save Locally Functions
function downloadFile(content, filename, format) {
    let mimeType;
    let finalContent = content;

    switch (format) {
        case 'md':
            mimeType = 'text/markdown';
            filename += '.md';
            break;
        case 'txt':
            mimeType = 'text/plain';
            filename += '.txt';
            break;
        case 'html':
            mimeType = 'text/html';
            // Convert markdown to HTML using markdown-it
            if (md) {
                finalContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; }
        pre { background: #f5f5f5; padding: 1rem; border-radius: 5px; overflow-x: auto; }
        code { background: #f0f0f0; padding: 0.2rem 0.4rem; border-radius: 3px; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
        th { background: #f5f5f5; }
    </style>
</head>
<body>
${md.render(content)}
</body>
</html>`;
            }
            filename += '.html';
            break;
        default:
            mimeType = 'text/plain';
            filename += '.txt';
    }

    const blob = new Blob([finalContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function saveToLocalStorage() {
    if (!editor) return;

    const content = editor.getValue();
    const timestamp = new Date().toISOString();
    const saveData = {
        content: content,
        timestamp: timestamp,
        filename: document.getElementById('saveFileName').value || 'markdown-document'
    };

    localStorage.setItem('markdownEditorContent', JSON.stringify(saveData));

    // Update tracking variables
    updateLastSavedContent();

    // Show save status
    showSaveStatus('Content saved to browser storage successfully!', 'success');
}

function loadFromLocalStorage() {
    // First try to load auto-saved content
    const autoSaveLoaded = loadAutoSavedContent();

    // If auto-save wasn't loaded, try regular saved content
    if (!autoSaveLoaded) {
        const savedData = localStorage.getItem('markdownEditorContent');
        if (savedData && editor) {
            try {
                const data = JSON.parse(savedData);
                editor.setValue(data.content);

                // Update filename in save modal if it exists
                const filenameInput = document.getElementById('saveFileName');
                if (filenameInput && data.filename) {
                    filenameInput.value = data.filename;
                }

                // Show when content was last saved
                const lastSaved = new Date(data.timestamp);
                console.log(`Loaded content last saved on: ${lastSaved.toLocaleString()}`);

                // Set as current saved content
                updateLastSavedContent();

            } catch (error) {
                console.error('Error loading saved content:', error);
            }
        } else if (editor) {
            // No saved content, set initial content as saved
            updateLastSavedContent();
        }
    }
}

function showSaveStatus(message, type = 'info') {
    const statusDiv = document.getElementById('saveStatus');
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';

    // Set color based on type
    switch (type) {
        case 'success':
            statusDiv.style.backgroundColor = 'var(--card-bg-dark)';
            statusDiv.style.color = '#4ade80';
            statusDiv.style.border = '1px solid #4ade80';
            break;
        case 'error':
            statusDiv.style.backgroundColor = 'var(--card-bg-dark)';
            statusDiv.style.color = '#ef4444';
            statusDiv.style.border = '1px solid #ef4444';
            break;
        default:
            statusDiv.style.backgroundColor = 'var(--card-bg-dark)';
            statusDiv.style.color = 'var(--text-color-dark)';
            statusDiv.style.border = '1px solid var(--border-color-ui-dark)';
    }

    // Hide after 3 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}