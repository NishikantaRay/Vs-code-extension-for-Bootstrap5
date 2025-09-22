#!/usr/bin/env node

const SnippetValidator = require('./validateSnippets');
const SnippetLinter = require('./lintSnippets');

// ANSI color codes
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bright: '\x1b[1m'
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
    console.log('\n' + '='.repeat(80));
    log('bright', `🧪 ${message}`);
    console.log('='.repeat(80));
}

async function runAllTests() {
    console.log(`${colors.cyan}${colors.bright}
██████╗  ██████╗  ██████╗ ████████╗███████╗████████╗██████╗  █████╗ ██████╗     ███████╗
██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗    ██╔════╝
██████╔╝██║   ██║██║   ██║   ██║   ███████╗   ██║   ██████╔╝███████║██████╔╝    ███████╗
██╔══██╗██║   ██║██║   ██║   ██║   ╚════██║   ██║   ██╔══██╗██╔══██║██╔═══╝     ╚════██║
██████╔╝╚██████╔╝╚██████╔╝   ██║   ███████║   ██║   ██║  ██║██║  ██║██║         ███████║
╚═════╝  ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝         ╚══════╝

BOOTSTRAP 5 SNIPPETS - TEST SUITE
${colors.reset}`);

    const testResults = {
        validation: false,
        linting: false,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        startTime: Date.now()
    };

    try {
        // Run validation tests
        logHeader('SNIPPET VALIDATION TESTS');
        const validator = new SnippetValidator();
        testResults.validation = await validator.validateAllSnippets();
        testResults.totalTests++;
        if (testResults.validation) testResults.passedTests++;
        else testResults.failedTests++;

        console.log('\n');

        // Run linting tests
        logHeader('SNIPPET LINTING TESTS');
        const linter = new SnippetLinter();
        testResults.linting = await linter.lintAllSnippets();
        testResults.totalTests++;
        if (testResults.linting) testResults.passedTests++;
        else testResults.failedTests++;

        console.log('\n');

        // Additional integration tests
        logHeader('INTEGRATION TESTS');
        const integrationResults = await runIntegrationTests();
        testResults.totalTests += integrationResults.total;
        testResults.passedTests += integrationResults.passed;
        testResults.failedTests += integrationResults.failed;

    } catch (error) {
        log('red', `❌ Test execution failed: ${error.message}`);
        testResults.failedTests++;
    }

    // Print final results
    printFinalResults(testResults);
    
    // Exit with appropriate code
    process.exit(testResults.failedTests === 0 ? 0 : 1);
}

async function runIntegrationTests() {
    const fs = require('fs');
    const path = require('path');
    
    const results = { total: 0, passed: 0, failed: 0 };
    
    // Test 1: Package.json validation
    log('blue', 'ℹ️  Testing package.json configuration...');
    try {
        const packagePath = path.join(__dirname, '../package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        const requiredFields = ['name', 'displayName', 'description', 'version', 'publisher', 'contributes'];
        const missingFields = requiredFields.filter(field => !packageJson[field]);
        
        results.total++;
        if (missingFields.length === 0) {
            log('green', '✅ Package.json has all required fields');
            results.passed++;
        } else {
            log('red', `❌ Package.json missing fields: ${missingFields.join(', ')}`);
            results.failed++;
        }
        
        // Check snippet file references
        const snippetFiles = packageJson.contributes?.snippets || [];
        let allFilesExist = true;
        
        results.total++;
        snippetFiles.forEach(snippet => {
            const filePath = path.join(__dirname, '..', snippet.path);
            if (!fs.existsSync(filePath)) {
                log('red', `❌ Snippet file not found: ${snippet.path}`);
                allFilesExist = false;
            }
        });
        
        if (allFilesExist) {
            log('green', '✅ All snippet files referenced in package.json exist');
            results.passed++;
        } else {
            results.failed++;
        }
        
    } catch (error) {
        log('red', `❌ Package.json test failed: ${error.message}`);
        results.total++;
        results.failed++;
    }
    
    // Test 2: File structure validation
    log('blue', 'ℹ️  Testing file structure...');
    try {
        const requiredFiles = [
            'package.json',
            'README.md',
            'CHANGELOG.md',
            'LICENSE',
            'icon.png'
        ];
        
        results.total++;
        const missingFiles = requiredFiles.filter(file => {
            return !fs.existsSync(path.join(__dirname, '..', file));
        });
        
        if (missingFiles.length === 0) {
            log('green', '✅ All required files present');
            results.passed++;
        } else {
            log('red', `❌ Missing files: ${missingFiles.join(', ')}`);
            results.failed++;
        }
        
    } catch (error) {
        log('red', `❌ File structure test failed: ${error.message}`);
        results.total++;
        results.failed++;
    }

    // Test 3: Bootstrap version consistency
    log('blue', 'ℹ️  Testing Bootstrap version consistency...');
    try {
        results.total++;
        
        // Check snippets.code-snippets for Bootstrap version
        const snippetsPath = path.join(__dirname, '../snippets/snippets.code-snippets');
        const snippetsContent = fs.readFileSync(snippetsPath, 'utf8');
        
        // Check if Bootstrap 5.3.2 is referenced
        if (snippetsContent.includes('bootstrap@5.3.2')) {
            log('green', '✅ Bootstrap version is up to date (5.3.2)');
            results.passed++;
        } else {
            log('red', '❌ Bootstrap version is outdated in snippets');
            results.failed++;
        }
        
    } catch (error) {
        log('red', `❌ Bootstrap version test failed: ${error.message}`);
        results.total++;
        results.failed++;
    }

    return results;
}

function printFinalResults(results) {
    const endTime = Date.now();
    const duration = ((endTime - results.startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(80));
    log('bright', '🎯 FINAL TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log(`⏱️  Test Duration: ${duration}s`);
    console.log(`📊 Total Tests: ${results.totalTests}`);
    
    if (results.passedTests > 0) {
        log('green', `✅ Passed: ${results.passedTests}`);
    }
    
    if (results.failedTests > 0) {
        log('red', `❌ Failed: ${results.failedTests}`);
    }
    
    console.log('='.repeat(80));
    
    if (results.failedTests === 0) {
        log('green', '🎉 ALL TESTS PASSED! Extension is ready for release! 🚀');
    } else {
        log('red', '💥 SOME TESTS FAILED! Please fix the issues above before releasing.');
        console.log('\nFailed test categories:');
        if (!results.validation) console.log('  - Snippet validation');
        if (!results.linting) console.log('  - Code linting');
    }
    
    console.log('='.repeat(80));
}

// Run tests if called directly
if (require.main === module) {
    runAllTests().catch(error => {
        log('red', `❌ Test suite failed: ${error.message}`);
        process.exit(1);
    });
}

module.exports = { runAllTests };