// Dynamic HTML Generator for Advanced Markdown Editor

// Function to create the complete HTML structure
function createHTMLStructure() {
    const htmlContent = `
    <div class="container">
        <header>
            <h1>Advanced Markdown Editor</h1>
            <div class="theme-selector">
                <button id="themeToggle" class="viewport-button">
                    <i class="fas fa-palette"></i> Theme
                </button>
                <div id="theme-options">
                    <div class="theme-option" data-theme="light">
                        <span class="theme-color-indicator"></span> Light
                    </div>
                    <div class="theme-option" data-theme="dark">
                        <span class="theme-color-indicator"></span> Dark
                    </div>
                    <div class="theme-option" data-theme="sepia">
                        <span class="theme-color-indicator"></span> Sepia
                    </div>
                    <div class="theme-option" data-theme="blue">
                        <span class="theme-color-indicator"></span> Blue
                    </div>
                    <div class="theme-option" data-theme="green">
                        <span class="theme-color-indicator"></span> Green
                    </div>
                </div>
            </div>
        </header>

        <div class="controls-panel">
            <button id="generateBtn" class="viewport-button"><i class="fas fa-magic"></i> Generate</button>
            <button id="analyzeBtn" class="viewport-button"><i class="fas fa-chart-bar"></i> Analyze Text</button>
            <button id="convertBtn" class="viewport-button"><i class="fas fa-exchange-alt"></i> Convert</button>
            <button id="settingsBtn" class="viewport-button"><i class="fas fa-cog"></i> Settings</button>
            <button id="saveLocallyBtn" class="viewport-button"><i class="fas fa-save"></i> Save Locally</button>
            <button id="copyMarkdownBtn" class="viewport-button"><i class="fas fa-copy"></i> Copy Markdown</button>
            <button id="copyHtmlBtn" class="viewport-button"><i class="fas fa-code"></i> Copy HTML</button>
            <button id="clearEditorBtn" class="viewport-button"><i class="fas fa-eraser"></i> Clear Editor</button>
        </div>

        ${createMarkdownToolbar()}

        <div class="editors-container">
            <div class="editor-wrapper">
                <h2>Markdown Editor</h2>
                <div id="markdownEditor" style="height: 100%;"></div>
            </div>
            <div class="editor-wrapper">
                <h2>Preview</h2>
                <div id="previewContainer"></div>
            </div>
        </div>
    </div>

    ${createModals()}
    `;

    return htmlContent;
}

// Function to create the markdown toolbar
function createMarkdownToolbar() {
    return `
    <div class="markdown-toolbar">
        <div class="toolbar-group">
            <button class="control-btn sm" data-format="bold" title="Bold"><i class="fas fa-bold"></i></button>
            <button class="control-btn sm" data-format="italic" title="Italic"><i class="fas fa-italic"></i></button>
            <button class="control-btn sm" data-format="underline" title="Underline"><i class="fas fa-underline"></i></button>
            <button class="control-btn sm" data-format="strikethrough" title="Strikethrough"><i class="fas fa-strikethrough"></i></button>
            <button class="control-btn sm" data-format="highlight" title="Highlight"><i class="fas fa-highlighter"></i></button>
        </div>
        <div class="toolbar-group">
            <button class="control-btn sm" data-format="code" title="Inline Code"><i class="fas fa-code"></i></button>
            <button class="control-btn sm" data-format="code-block" title="Code Block"><i class="fas fa-file-code"></i></button>
        </div>
        <div class="toolbar-group">
            <button class="control-btn sm" data-format="h1" title="Heading 1">H1</button>
            <button class="control-btn sm" data-format="h2" title="Heading 2">H2</button>
            <button class="control-btn sm" data-format="h3" title="Heading 3">H3</button>
            <button class="control-btn sm" data-format="h4" title="Heading 4">H4</button>
            <button class="control-btn sm" data-format="h5" title="Heading 5">H5</button>
            <button class="control-btn sm" data-format="h6" title="Heading 6">H6</button>
        </div>
        <div class="toolbar-group">
            <button class="control-btn sm" data-format="unordered-list" title="Unordered List"><i class="fas fa-list-ul"></i></button>
            <button class="control-btn sm" data-format="ordered-list" title="Ordered List"><i class="fas fa-list-ol"></i></button>
            <button class="control-btn sm" data-format="checklist" title="Checklist"><i class="fas fa-tasks"></i></button>
            <button class="control-btn sm" data-format="blockquote" title="Blockquote"><i class="fas fa-quote-right"></i></button>
        </div>
        <div class="toolbar-group">
            <button class="control-btn sm" data-format="link" title="Link"><i class="fas fa-link"></i></button>
            <button class="control-btn sm" data-format="image" title="Image"><i class="fas fa-image"></i></button>
            <button class="control-btn sm" data-format="table" title="Table"><i class="fas fa-table"></i></button>
        </div>
        <div class="toolbar-group">
            <button class="control-btn sm" data-format="superscript" title="Superscript"><i class="fas fa-superscript"></i></button>
            <button class="control-btn sm" data-format="subscript" title="Subscript"><i class="fas fa-subscript"></i></button>
            <button class="control-btn sm" data-format="horizontal-rule" title="Horizontal Rule"><i class="fas fa-minus"></i></button>
        </div>
        <div class="toolbar-group">
            <button class="control-btn sm" data-format="smart-paste" title="Smart Paste"><i class="fas fa-paste"></i></button>
            <button class="control-btn sm" data-format="paste-as-code" title="Paste as Code"><i class="fas fa-terminal"></i></button>
            <button class="control-btn sm" data-format="paste-as-quote" title="Paste as Quote"><i class="fas fa-quote-left"></i></button>
            <button class="control-btn sm" data-format="advanced-paste" title="Advanced Paste"><i class="fas fa-clipboard-list"></i></button>
        </div>
        <div class="toolbar-group">
            <button class="control-btn sm" data-format="uppercase" title="UPPERCASE"><i class="fas fa-font"></i><sup>A</sup></button>
            <button class="control-btn sm" data-format="lowercase" title="lowercase"><i class="fas fa-font"></i><sub>a</sub></button>
            <button class="control-btn sm" data-format="capitalize" title="Capitalize Words"><i class="fas fa-text-height"></i></button>
            <button class="control-btn sm" data-format="sentence-case" title="Sentence case"><i class="fas fa-paragraph"></i></button>
        </div>
        <div class="toolbar-group">
            <button class="control-btn sm" data-format="remove-spaces" title="Remove Extra Spaces"><i class="fas fa-compress-alt"></i></button>
            <button class="control-btn sm" data-format="trim-lines" title="Trim Lines"><i class="fas fa-align-left"></i></button>
            <button class="control-btn sm" data-format="sort-lines" title="Sort Lines"><i class="fas fa-sort-alpha-down"></i></button>
            <button class="control-btn sm" data-format="reverse-lines" title="Reverse Lines"><i class="fas fa-exchange-alt fa-rotate-90"></i></button>
        </div>
    </div>
    `;
}

// Function to create all modals
function createModals() {
    return `
    ${createGeneratorModal()}
    ${createTextAnalysisModal()}
    ${createConvertModal()}
    ${createSettingsModal()}
    ${createSaveLocallyModal()}
    ${createSortTableModal()}
    ${createAdvancedPasteModal()}
    `;
}

// Function to create the generator modal
function createGeneratorModal() {
    return `
    <div id="generatorModal" class="panel-modal">
        <div class="panel-modal-content">
            <div class="panel-modal-header">
                <h3>Generate Content</h3>
                <button class="close-panel control-btn" data-modal-id="generatorModal"><i class="fas fa-times"></i></button>
            </div>
            <div class="panel-modal-body">
                <div class="input-group wide">
                    <label for="generatorPrompt">Prompt:</label>
                    <textarea id="generatorPrompt" placeholder="Enter your prompt for content generation..."></textarea>
                </div>
                <div class="input-group">
                    <label for="generatorLength">Length (words):</label>
                    <input type="number" id="generatorLength" value="200" min="10">
                </div>
                <div class="input-group">
                    <label for="generatorTone">Tone:</label>
                    <select id="generatorTone">
                        <option value="neutral">Neutral</option>
                        <option value="formal">Formal</option>
                        <option value="informal">Informal</option>
                        <option value="creative">Creative</option>
                        <option value="professional">Professional</option>
                    </select>
                </div>
                <button id="generateContentBtn" class="viewport-button">Generate</button>
                <div id="generatorLoading" style="display:none; margin-top: 10px; color: var(--main-text-color);">
                    Generating...</div>
                <div id="generatorOutput"
                    style="margin-top: 15px; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background-color: var(--main-bg-color); color: var(--main-text-color); min-height: 50px; display: none;">
                </div>
            </div>
        </div>
    </div>
    `;
}

// Function to create the text analysis modal
function createTextAnalysisModal() {
    return `
    <div id="textAnalysisModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Text Analysis</h3>
                <button class="close-btn control-btn" data-modal-id="textAnalysisModal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div id="textStatistics">
                    <div class="stat-group">
                        <h4>Basic Statistics</h4>
                        <div class="stat-item"><span class="stat-label">Characters:</span> <span id="charCount" class="stat-value">0</span></div>
                        <div class="stat-item"><span class="stat-label">Words:</span> <span id="wordCount" class="stat-value">0</span></div>
                        <div class="stat-item"><span class="stat-label">Sentences:</span> <span id="sentenceCount" class="stat-value">0</span></div>
                        <div class="stat-item"><span class="stat-label">Paragraphs:</span> <span id="paragraphCount" class="stat-value">0</span></div>
                    </div>
                    <div class="stat-group">
                        <h4>Readability</h4>
                        <div class="stat-item"><span class="stat-label">Flesch-Kincaid Grade Level:</span> <span id="fleschKincaid" class="stat-value">N/A</span></div>
                        <div class="stat-item"><span class="stat-label">Automated Readability Index:</span> <span id="ari" class="stat-value">N/A</span></div>
                    </div>
                </div>
                <div id="detailedStats" style="margin-top: 20px;">
                    <h4>Detailed Word Frequency</h4>
                    <div id="wordFrequencyList"
                        style="max-height: 200px; overflow-y: auto; border: 1px solid var(--border-color); padding: 10px; border-radius: 4px; background-color: var(--main-bg-color);">
                        <p>No words to display.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="secondary-btn close-btn" data-modal-id="textAnalysisModal">Close</button>
            </div>
        </div>
    </div>
    `;
}

// Function to create the convert modal
function createConvertModal() {
    return `
    <div id="convertModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Convert Content</h3>
                <button class="close-btn control-btn" data-modal-id="convertModal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="input-group">
                    <label for="convertFormat">Convert to:</label>
                    <select id="convertFormat">
                        <option value="html">HTML</option>
                        <option value="text">Plain Text</option>
                    </select>
                </div>
                <button id="performConvertBtn" class="viewport-button">Convert</button>
                <div id="convertedOutput"
                    style="margin-top: 15px; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background-color: var(--main-bg-color); color: var(--main-text-color); min-height: 50px; display: none; white-space: pre-wrap; word-break: break-all;">
                </div>
            </div>
            <div class="modal-footer">
                <button class="secondary-btn close-btn" data-modal-id="convertModal">Close</button>
            </div>
        </div>
    </div>
    `;
}

// Function to create the settings modal
function createSettingsModal() {
    return `
    <div id="settingsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Settings</h3>
                <button class="close-btn control-btn" data-modal-id="settingsModal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="input-group">
                    <label for="editorFontSize">Editor Font Size (px):</label>
                    <input type="number" id="editorFontSize" value="14" min="10" max="24">
                </div>
                <div class="input-group">
                    <label for="previewFontSize">Preview Font Size (px):</label>
                    <input type="number" id="previewFontSize" value="16" min="12" max="28">
                </div>
                <div class="input-group">
                    <label for="tabSize">Tab Size:</label>
                    <input type="number" id="tabSize" value="4" min="2" max="8">
                </div>
                <div class="input-group">
                    <label for="wordWrap">Word Wrap:</label>
                    <select id="wordWrap">
                        <option value="off">Off</option>
                        <option value="on">On</option>
                        <option value="wordWrapColumn">Word Wrap Column</option>
                        <option value="bounded">Bounded</option>
                    </select>
                </div>

                <hr style="margin: 20px 0; border: 1px solid var(--border-color-ui-dark);">

                <h4 style="margin-bottom: 15px; color: var(--text-color-dark);">Ustawienia Motywu</h4>

                <div class="setting-row">
                    <label for="h1">Odcień 1 (Hue 1):</label>
                    <input type="range" id="h1" min="0" max="360" value="155">
                    <input type="number" id="h1-value" min="0" max="360" value="155">
                </div>

                <div class="setting-row">
                    <label for="h2">Odcień 2 (Hue 2):</label>
                    <input type="range" id="h2" min="0" max="360" value="222">
                    <input type="number" id="h2-value" min="0" max="360" value="222">
                </div>

                <div class="setting-row">
                    <label for="blur-intensity">Intensywność Rozmycia:</label>
                    <input type="range" id="blur-intensity" min="0" max="20" value="12">
                    <input type="number" id="blur-value" min="0" max="20" value="12">
                </div>

                <div class="setting-row">
                    <label for="glow-brightness">Jasność Poświaty (%):</label>
                    <input type="range" id="glow-brightness" min="0" max="200" value="70">
                    <input type="number" id="glow-value" min="0" max="200" value="70">
                </div>

                <div class="input-group" style="margin-top: 15px;">
                    <button id="reset-theme-btn" class="viewport-button"
                        style="background: var(--secondary-color); margin-right: 10px;">
                        <i class="fas fa-undo"></i> Resetuj Motyw
                    </button>
                    <button id="random-theme-btn" class="viewport-button" style="background: var(--primary-color);">
                        <i class="fas fa-random"></i> Losowy Motyw
                    </button>
                </div>

                <p style="margin-top: 10px; font-size: 0.85em; color: var(--text-color-dark);">
                    Zmiany motywu: <span id="theme-changes-counter">0</span>
                </p>

                <button id="applySettingsBtn" class="viewport-button">Apply Settings</button>
            </div>
            <div class="modal-footer">
                <button class="secondary-btn close-btn" data-modal-id="settingsModal">Close</button>
            </div>
        </div>
    </div>
    `;
}

// Function to create the save locally modal
function createSaveLocallyModal() {
    return `
    <div id="saveLocallyModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Save Locally</h3>
                <button class="close-btn control-btn" data-modal-id="saveLocallyModal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="input-group">
                    <label for="saveFileName">File Name:</label>
                    <input type="text" id="saveFileName" value="markdown-document"
                        placeholder="Enter filename (without extension)">
                </div>
                <div class="input-group">
                    <label for="saveFormat">Save Format:</label>
                    <select id="saveFormat">
                        <option value="md">Markdown (.md)</option>
                        <option value="txt">Plain Text (.txt)</option>
                        <option value="html">HTML (.html)</option>
                    </select>
                </div>
                <div class="input-group">
                    <input type="checkbox" id="autoSaveEnabled">
                    <label for="autoSaveEnabled">Enable Auto-save to Browser Storage</label>
                </div>
                <div class="input-group">
                    <button id="downloadFileBtn" class="viewport-button">
                        <i class="fas fa-download"></i> Download File
                    </button>
                    <button id="saveToStorageBtn" class="viewport-button">
                        <i class="fas fa-database"></i> Save to Browser Storage
                    </button>
                </div>
                <div id="saveStatus" style="margin-top: 15px; padding: 10px; border-radius: 4px; display: none;">
                </div>
            </div>
            <div class="modal-footer">
                <button class="secondary-btn close-btn" data-modal-id="saveLocallyModal">Close</button>
            </div>
        </div>
    </div>
    `;
}

// Function to create the sort table modal
function createSortTableModal() {
    return `
    <div id="sortTableModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Sort Table</h3>
                <button class="close-btn control-btn" data-modal-id="sortTableModal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="input-group">
                    <label for="sortColumn">Column to Sort:</label>
                    <select id="sortColumn"></select>
                </div>
                <div class="input-group">
                    <label for="sortOrder">Sort Order:</label>
                    <select id="sortOrder">
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <button id="applySortBtn" class="viewport-button">Apply Sort</button>
            </div>
            <div class="modal-footer">
                <button class="secondary-btn close-btn" data-modal-id="sortTableModal">Close</button>
            </div>
        </div>
    </div>
    `;
}

// Function to create the advanced paste modal
function createAdvancedPasteModal() {
    return `
    <div id="advancedPasteModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Advanced Paste</h3>
                <button class="close-btn control-btn" data-modal-id="advancedPasteModal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="input-group wide">
                    <label for="pasteInput">Input Text:</label>
                    <textarea id="pasteInput" placeholder="Paste your text here..." rows="6"></textarea>
                </div>

                <div class="modal-options">
                    <div class="input-group">
                        <label for="conversionType">Conversion Type:</label>
                        <select id="conversionType">
                            <option value="auto">Auto Detect</option>
                            <option value="table">Table Data</option>
                            <option value="html">HTML to Markdown</option>
                            <option value="code">Code Block</option>
                            <option value="quote">Blockquote</option>
                            <option value="list">List</option>
                            <option value="plain">Plain Text</option>
                        </select>
                    </div>
                </div>

                <div id="tableOptions" class="conversion-options" style="display: none;">
                    <h4>Table Options</h4>
                    <div class="modal-options">
                        <div class="input-group">
                            <label for="tableDelimiter">Delimiter:</label>
                            <select id="tableDelimiter">
                                <option value="auto">Auto Detect</option>
                                <option value=",">Comma (,)</option>
                                <option value="\\t">Tab</option>
                                <option value=";">Semicolon (;)</option>
                                <option value="|">Pipe (|)</option>
                                <option value=" ">Space</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <input type="checkbox" id="hasHeaders" checked>
                            <label for="hasHeaders">First row contains headers</label>
                        </div>
                    </div>
                </div>

                <div id="codeOptions" class="conversion-options" style="display: none;">
                    <h4>Code Options</h4>
                    <div class="input-group">
                        <label for="codeLanguage">Programming Language:</label>
                        <select id="codeLanguage">
                            <option value="">Auto Detect</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="csharp">C#</option>
                            <option value="cpp">C++</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="sql">SQL</option>
                            <option value="json">JSON</option>
                            <option value="xml">XML</option>
                            <option value="bash">Bash</option>
                            <option value="powershell">PowerShell</option>
                        </select>
                    </div>
                </div>

                <div id="listOptions" class="conversion-options" style="display: none;">
                    <h4>List Options</h4>
                    <div class="modal-options">
                        <div class="input-group">
                            <label for="listType">List Type:</label>
                            <select id="listType">
                                <option value="unordered">Unordered (-)</option>
                                <option value="ordered">Ordered (1.)</option>
                                <option value="checklist">Checklist (- [ ])</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="input-group">
                    <button id="previewConversionBtn" class="viewport-button">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button id="applyPasteBtn" class="viewport-button">
                        <i class="fas fa-check"></i> Apply
                    </button>
                </div>

                <div id="conversionPreview"
                    style="margin-top: 15px; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background-color: var(--main-bg-color); color: var(--main-text-color); min-height: 100px; display: none; white-space: pre-wrap; font-family: monospace; font-size: 0.9em; max-height: 200px; overflow-y: auto;">
                </div>
            </div>
            <div class="modal-footer">
                <button class="secondary-btn close-btn" data-modal-id="advancedPasteModal">Close</button>
            </div>
        </div>
    </div>
    `;
}

// Function to inject HTML into the page
function initializeHTML() {
    // Set document title
    document.title = 'Advanced Markdown Editor';

    // Set body attributes
    document.body.dataset.theme = 'dark';

    // Inject the main HTML structure
    document.body.innerHTML = createHTMLStructure();

    // Load external dependencies
    loadExternalDependencies();
}

// Function to load external dependencies
function loadExternalDependencies() {
    // Create and load Monaco Editor
    const monacoScript = document.createElement('script');
    monacoScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/loader.min.js';
    monacoScript.onload = () => {
        // Load app.js after Monaco is loaded
        const appScript = document.createElement('script');
        appScript.src = 'https://cdn.jsdelivr.net/gh/skokivPr/md-table@refs/heads/main/app.js';
        document.head.appendChild(appScript);
    };
    document.head.appendChild(monacoScript);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeHTML); 