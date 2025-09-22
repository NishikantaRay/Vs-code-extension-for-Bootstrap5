#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log('green', `✅ ${message}`);
}

function logError(message) {
    log('red', `❌ ${message}`);
}

function logInfo(message) {
    log('blue', `ℹ️  ${message}`);
}

class SnippetLinter {
    constructor() {
        this.snippetsDir = path.join(__dirname, '../snippets');
        this.issues = [];
    }

    async lintAllSnippets() {
        logInfo('Starting snippet linting...');
        
        const files = fs.readdirSync(this.snippetsDir)
            .filter(file => file.endsWith('.code-snippets'));

        for (const file of files) {
            await this.lintSnippetFile(file);
        }

        this.printResults();
        return this.issues.length === 0;
    }

    async lintSnippetFile(filename) {
        const filePath = path.join(this.snippetsDir, filename);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const snippets = JSON.parse(content);

            // Check file-level issues
            this.checkFileFormatting(filename, content);
            
            // Check snippet-level issues
            for (const [snippetName, snippetData] of Object.entries(snippets)) {
                this.lintSnippet(filename, snippetName, snippetData);
            }

        } catch (error) {
            this.issues.push({
                file: filename,
                type: 'error',
                message: `Failed to process file: ${error.message}`
            });
        }
    }

    checkFileFormatting(filename, content) {
        // Check indentation consistency
        const lines = content.split('\n');
        let expectedIndent = 0;
        let inconsistentIndentation = false;

        lines.forEach((line, index) => {
            if (line.trim().length === 0) return;
            
            const indent = line.length - line.trimStart().length;
            const trimmed = line.trim();
            
            // Basic bracket counting for expected indentation
            if (trimmed.endsWith('{') || trimmed.endsWith('[')) {
                expectedIndent += 4;
            } else if (trimmed.startsWith('}') || trimmed.startsWith(']')) {
                expectedIndent -= 4;
            }
        });

        // Check for trailing commas in JSON
        if (content.includes(',\n}') || content.includes(',\n]')) {
            this.issues.push({
                file: filename,
                type: 'style',
                message: 'Contains trailing commas'
            });
        }
    }

    lintSnippet(filename, snippetName, snippet) {
        // Check description quality
        if (snippet.description) {
            this.checkDescriptionQuality(filename, snippetName, snippet.description);
        }

        // Check prefix conventions
        if (snippet.prefix) {
            this.checkPrefixConventions(filename, snippetName, snippet.prefix);
        }

        // Check body quality
        if (snippet.body) {
            this.checkBodyQuality(filename, snippetName, snippet.body);
        }
    }

    checkDescriptionQuality(filename, snippetName, description) {
        // Check for generic descriptions
        const genericDescriptions = [
            'basic', 'simple', 'default', 'standard', 'regular'
        ];
        
        const lowerDesc = description.toLowerCase();
        if (genericDescriptions.some(generic => lowerDesc.includes(generic) && lowerDesc.length < 30)) {
            this.issues.push({
                file: filename,
                snippet: snippetName,
                type: 'style',
                message: `Description could be more specific: "${description}"`
            });
        }

        // Check capitalization
        if (description[0] !== description[0].toUpperCase()) {
            this.issues.push({
                file: filename,
                snippet: snippetName,
                type: 'style',
                message: 'Description should start with capital letter'
            });
        }

        // Check for period at end
        if (description.endsWith('.')) {
            this.issues.push({
                file: filename,
                snippet: snippetName,
                type: 'style',
                message: 'Description should not end with period'
            });
        }
    }

    checkPrefixConventions(filename, snippetName, prefix) {
        // Check prefix length
        if (prefix.length > 20) {
            this.issues.push({
                file: filename,
                snippet: snippetName,
                type: 'style',
                message: `Prefix is quite long: "${prefix}"`
            });
        }

        // Check for consistent naming
        if (!prefix.match(/^(!?bs5-|!?form-|fa-)/)) {
            this.issues.push({
                file: filename,
                snippet: snippetName,
                type: 'convention',
                message: `Prefix doesn't follow naming convention: "${prefix}"`
            });
        }
    }

    checkBodyQuality(filename, snippetName, body) {
        const bodyText = body.join('\n');
        
        // Check for accessibility issues
        const accessibilityChecks = [
            {
                pattern: /<img[^>]*>/g,
                check: (match) => !match.includes('alt='),
                message: 'Image tag missing alt attribute'
            },
            {
                pattern: /<button[^>]*>/g,
                check: (match) => match.includes('aria-label') || match.includes('aria-labelledby') || /<button[^>]*>[^<]+</g.test(match),
                message: 'Button should have accessible text or aria-label'
            },
            {
                pattern: /<input[^>]*type=["'](?!hidden)[^"']*["'][^>]*>/g,
                check: (match) => match.includes('aria-label') || match.includes('aria-labelledby'),
                message: 'Input should have associated label or aria-label'
            }
        ];

        accessibilityChecks.forEach(check => {
            const matches = bodyText.match(check.pattern);
            if (matches) {
                matches.forEach(match => {
                    if (!check.check(match)) {
                        this.issues.push({
                            file: filename,
                            snippet: snippetName,
                            type: 'accessibility',
                            message: check.message
                        });
                    }
                });
            }
        });

        // Check for semantic HTML
        if (bodyText.includes('<div') && bodyText.includes('btn')) {
            if (!bodyText.includes('<button') && !bodyText.includes('role="button"')) {
                this.issues.push({
                    file: filename,
                    snippet: snippetName,
                    type: 'semantic',
                    message: 'Consider using <button> element instead of <div> for interactive elements'
                });
            }
        }

        // Check for placeholder quality
        const placeholders = bodyText.match(/\${?\d+:([^}]+)}/g);
        if (placeholders) {
            placeholders.forEach(placeholder => {
                const text = placeholder.match(/:([^}]+)/)?.[1];
                if (text && (text === 'text' || text === 'content' || text.length < 3)) {
                    this.issues.push({
                        file: filename,
                        snippet: snippetName,
                        type: 'usability',
                        message: `Placeholder text could be more descriptive: "${text}"`
                    });
                }
            });
        }
    }

    printResults() {
        console.log('\n' + '='.repeat(60));
        logInfo('Linting Results');
        console.log('='.repeat(60));

        if (this.issues.length === 0) {
            logSuccess('✅ No linting issues found!');
            return;
        }

        // Group issues by type
        const issuesByType = {};
        this.issues.forEach(issue => {
            if (!issuesByType[issue.type]) {
                issuesByType[issue.type] = [];
            }
            issuesByType[issue.type].push(issue);
        });

        Object.keys(issuesByType).forEach(type => {
            const typeColor = {
                'error': 'red',
                'style': 'yellow',
                'convention': 'blue',
                'accessibility': 'red',
                'semantic': 'yellow',
                'usability': 'blue'
            }[type] || 'reset';

            log(typeColor, `\n${type.toUpperCase()} (${issuesByType[type].length}):`);
            
            issuesByType[type].forEach(issue => {
                const location = issue.snippet ? `${issue.file} - "${issue.snippet}"` : issue.file;
                console.log(`  ${location}: ${issue.message}`);
            });
        });

        console.log('\n' + '='.repeat(60));
        logInfo(`Total issues: ${this.issues.length}`);
        
        const errorCount = this.issues.filter(i => i.type === 'error' || i.type === 'accessibility').length;
        if (errorCount > 0) {
            logError(`${errorCount} critical issues need to be fixed`);
        } else {
            logSuccess('No critical issues found');
        }
    }
}

// Run linting if called directly
if (require.main === module) {
    const linter = new SnippetLinter();
    linter.lintAllSnippets().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        logError(`Linting failed: ${error.message}`);
        process.exit(1);
    });
}

module.exports = SnippetLinter;