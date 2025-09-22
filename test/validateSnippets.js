#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m',
    bright: '\x1b[1m'
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

function logWarning(message) {
    log('yellow', `⚠️  ${message}`);
}

function logInfo(message) {
    log('blue', `ℹ️  ${message}`);
}

class SnippetValidator {
    constructor() {
        this.snippetsDir = path.join(__dirname, '../snippets');
        this.errors = [];
        this.warnings = [];
        this.snippetCount = 0;
        this.allPrefixes = new Set();
        this.duplicatePrefixes = new Set();
    }

    async validateAllSnippets() {
        logInfo('Starting snippet validation...');
        
        const files = fs.readdirSync(this.snippetsDir)
            .filter(file => file.endsWith('.code-snippets'));

        for (const file of files) {
            await this.validateSnippetFile(file);
        }

        this.checkForDuplicatePrefixes();
        this.printResults();
        
        return this.errors.length === 0;
    }

    async validateSnippetFile(filename) {
        const filePath = path.join(this.snippetsDir, filename);
        logInfo(`Validating ${filename}...`);

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Validate JSON syntax
            let snippets;
            try {
                snippets = JSON.parse(content);
            } catch (jsonError) {
                this.errors.push(`${filename}: Invalid JSON - ${jsonError.message}`);
                return;
            }

            // Validate snippet structure
            for (const [snippetName, snippetData] of Object.entries(snippets)) {
                this.validateSnippet(filename, snippetName, snippetData);
                this.snippetCount++;
            }

        } catch (error) {
            this.errors.push(`${filename}: Failed to read file - ${error.message}`);
        }
    }

    validateSnippet(filename, snippetName, snippet) {
        // Check required fields
        if (!snippet.prefix) {
            this.errors.push(`${filename} - "${snippetName}": Missing 'prefix' field`);
        } else {
            // Check for duplicate prefixes
            if (this.allPrefixes.has(snippet.prefix)) {
                this.duplicatePrefixes.add(snippet.prefix);
                this.errors.push(`${filename} - "${snippetName}": Duplicate prefix "${snippet.prefix}"`);
            } else {
                this.allPrefixes.add(snippet.prefix);
            }

            // Validate prefix naming convention
            if (!this.isValidPrefix(snippet.prefix)) {
                this.warnings.push(`${filename} - "${snippetName}": Prefix "${snippet.prefix}" doesn't follow naming convention`);
            }
        }

        if (!snippet.body) {
            this.errors.push(`${filename} - "${snippetName}": Missing 'body' field`);
        } else if (!Array.isArray(snippet.body)) {
            this.errors.push(`${filename} - "${snippetName}": 'body' must be an array`);
        } else {
            // Validate body content
            this.validateSnippetBody(filename, snippetName, snippet.body);
        }

        if (!snippet.description) {
            this.warnings.push(`${filename} - "${snippetName}": Missing 'description' field`);
        } else if (snippet.description.trim().length < 10) {
            this.warnings.push(`${filename} - "${snippetName}": Description is too short`);
        }
    }

    validateSnippetBody(filename, snippetName, body) {
        const bodyText = body.join('\n');
        
        // Check for common issues
        if (bodyText.includes('b5${0}')) {
            this.warnings.push(`${filename} - "${snippetName}": Contains potentially broken reference 'b5\${0}'`);
        }

        // Check for proper tab stops
        const tabStops = bodyText.match(/\${\d+[^}]*}/g) || [];
        const tabStopNumbers = tabStops.map(ts => {
            const match = ts.match(/\${(\d+)/);
            return match ? parseInt(match[1]) : 0;
        });

        // Check if tab stops are sequential (allowing for 0)
        const uniqueNumbers = [...new Set(tabStopNumbers)].sort((a, b) => a - b);
        for (let i = 0; i < uniqueNumbers.length - 1; i++) {
            if (uniqueNumbers[i + 1] - uniqueNumbers[i] > 1 && uniqueNumbers[i] !== 0) {
                this.warnings.push(`${filename} - "${snippetName}": Non-sequential tab stops detected`);
                break;
            }
        }

        // Check for Bootstrap class validation (basic)
        this.validateBootstrapClasses(filename, snippetName, bodyText);
    }

    validateBootstrapClasses(filename, snippetName, bodyText) {
        // Common Bootstrap class patterns
        const bootstrapPatterns = [
            /class="[^"]*\bbtn-(?!primary|secondary|success|danger|warning|info|light|dark|outline-\w+|sm|lg|close|group|toolbar)[^\s"]+/g,
            /class="[^"]*\bcard-(?!body|title|subtitle|text|img|img-top|img-bottom|header|footer|link|deck|group|columns)[^\s"]+/g,
            /class="[^"]*\bnavbar-(?!brand|nav|toggler|toggler-icon|collapse|text|light|dark|expand|expand-sm|expand-md|expand-lg|expand-xl|expand-xxl)[^\s"]+/g
        ];

        bootstrapPatterns.forEach(pattern => {
            const matches = bodyText.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    this.warnings.push(`${filename} - "${snippetName}": Potentially invalid Bootstrap class in "${match}"`);
                });
            }
        });
    }

    isValidPrefix(prefix) {
        // Check if prefix follows naming conventions
        if (prefix.startsWith('!bs5-') || prefix.startsWith('bs5-') || prefix.startsWith('!form-') || prefix.startsWith('fa-')) {
            return true;
        }
        return false;
    }

    checkForDuplicatePrefixes() {
        if (this.duplicatePrefixes.size > 0) {
            logError(`Found ${this.duplicatePrefixes.size} duplicate prefixes:`);
            this.duplicatePrefixes.forEach(prefix => {
                console.log(`  - ${prefix}`);
            });
        }
    }

    printResults() {
        console.log('\n' + '='.repeat(60));
        logInfo(`Validation Results for ${this.snippetCount} snippets`);
        console.log('='.repeat(60));

        if (this.errors.length === 0) {
            logSuccess('✅ No errors found!');
        } else {
            logError(`❌ Found ${this.errors.length} error(s):`);
            this.errors.forEach(error => console.log(`  ${error}`));
        }

        if (this.warnings.length === 0) {
            logSuccess('✅ No warnings!');
        } else {
            logWarning(`⚠️  Found ${this.warnings.length} warning(s):`);
            this.warnings.forEach(warning => console.log(`  ${warning}`));
        }

        console.log('='.repeat(60));
        logInfo(`Total prefixes: ${this.allPrefixes.size}`);
        logInfo(`Unique prefixes: ${this.allPrefixes.size - this.duplicatePrefixes.size}`);
        
        if (this.errors.length === 0) {
            logSuccess('🎉 All snippets are valid!');
        } else {
            logError('💥 Validation failed! Please fix the errors above.');
        }
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new SnippetValidator();
    validator.validateAllSnippets().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        logError(`Validation failed: ${error.message}`);
        process.exit(1);
    });
}

module.exports = SnippetValidator;