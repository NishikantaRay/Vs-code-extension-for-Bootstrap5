// Bootstrap 5 Snippets Extension
// This extension provides comprehensive Bootstrap 5.3 snippets with accessibility features

const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Bootstrap 5 Snippets extension is now active!');
    
    // Register command for extension info
    let infoCommand = vscode.commands.registerCommand('bootstrap5snippets.showInfo', function () {
        vscode.window.showInformationMessage(
            'Bootstrap 5 Snippets v2.1.0 - Professional accessibility-first snippets with keyboard shortcuts! 🚀',
            'View Shortcuts', 'GitHub'
        ).then(selection => {
            if (selection === 'View Shortcuts') {
                vscode.commands.executeCommand('bootstrap5snippets.showShortcuts');
            } else if (selection === 'GitHub') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/NishikantaRay/Vs-code-extension-for-Bootstrap5'));
            }
        });
    });

    // Register command for shortcuts guide
    let shortcutsCommand = vscode.commands.registerCommand('bootstrap5snippets.showShortcuts', function () {
        const panel = vscode.window.createWebviewPanel(
            'bootstrap5Shortcuts',
            'Bootstrap 5 Shortcuts Guide',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        // Read the shortcuts markdown file
        const shortcutsPath = path.join(context.extensionPath, 'SHORTCUTS.md');
        try {
            const shortcutsContent = fs.readFileSync(shortcutsPath, 'utf8');
            panel.webview.html = getWebviewContent(shortcutsContent);
        } catch (error) {
            panel.webview.html = getWebviewContent('# Shortcuts guide not found\nPlease check the extension installation.');
        }
    });

    context.subscriptions.push(infoCommand, shortcutsCommand);
    
    // Show welcome message on first install/update
    const packageJson = require('./package.json');
    const version = packageJson.version;
    const lastVersion = context.globalState.get('bootstrap5snippets.version');
    
    if (lastVersion !== version) {
        context.globalState.update('bootstrap5snippets.version', version);
        vscode.window.showInformationMessage(
            `Bootstrap 5 Snippets updated to v${version}! 🎉`,
            'What\'s New', 'View Shortcuts'
        ).then(selection => {
            if (selection === 'What\'s New') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/NishikantaRay/Vs-code-extension-for-Bootstrap5/blob/main/CHANGELOG.md'));
            } else if (selection === 'View Shortcuts') {
                vscode.commands.executeCommand('bootstrap5snippets.showShortcuts');
            }
        });
    }
}

function getWebviewContent(markdownContent) {
    // Convert markdown to HTML (simple conversion)
    const htmlContent = markdownContent
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^\- (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n/g, '<br>');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bootstrap 5 Shortcuts</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    font-size: var(--vscode-font-size);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                    line-height: 1.6;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1 { color: var(--vscode-textLink-foreground); border-bottom: 2px solid var(--vscode-textLink-foreground); padding-bottom: 10px; }
                h2 { color: var(--vscode-textPreformat-foreground); margin-top: 30px; }
                h3 { color: var(--vscode-textBlockQuote-foreground); }
                code {
                    background-color: var(--vscode-textBlockQuote-background);
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-family: var(--vscode-editor-font-family);
                }
                ul { margin: 10px 0; }
                li { margin: 5px 0; }
                strong { color: var(--vscode-textLink-foreground); }
                .shortcut { 
                    background: var(--vscode-button-background); 
                    color: var(--vscode-button-foreground); 
                    padding: 2px 6px; 
                    border-radius: 3px; 
                    font-family: monospace;
                }
            </style>
        </head>
        <body>
            ${htmlContent}
        </body>
        </html>
    `;
}

function deactivate() {
    console.log('Bootstrap 5 Snippets extension has been deactivated.');
}

module.exports = {
    activate,
    deactivate
};