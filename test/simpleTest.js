const fs = require('fs');
const path = require('path');

console.log('🧪 Running Basic Snippet Tests...\n');

const snippetsDir = path.join(__dirname, '../snippets');
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(testName, testFn) {
    totalTests++;
    try {
        const result = testFn();
        if (result) {
            console.log(`✅ ${testName}`);
            passedTests++;
        } else {
            console.log(`❌ ${testName}`);
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ ${testName} - Error: ${error.message}`);
        failedTests++;
    }
}

// Test 1: Check if snippets directory exists
runTest('Snippets directory exists', () => {
    return fs.existsSync(snippetsDir);
});

// Test 2: Check if snippet files exist
runTest('Snippet files exist', () => {
    const files = fs.readdirSync(snippetsDir).filter(f => f.endsWith('.code-snippets'));
    return files.length > 0;
});

// Test 3: Validate JSON syntax in all snippet files
const files = fs.readdirSync(snippetsDir).filter(f => f.endsWith('.code-snippets'));
files.forEach(file => {
    runTest(`JSON syntax valid in ${file}`, () => {
        const content = fs.readFileSync(path.join(snippetsDir, file), 'utf8');
        JSON.parse(content); // This will throw if invalid
        return true;
    });
});

// Test 4: Check for required snippet properties
files.forEach(file => {
    runTest(`Required properties in ${file}`, () => {
        const content = fs.readFileSync(path.join(snippetsDir, file), 'utf8');
        const snippets = JSON.parse(content);
        
        for (const [name, snippet] of Object.entries(snippets)) {
            if (!snippet.prefix || !snippet.body || !Array.isArray(snippet.body)) {
                console.log(`    Missing required properties in snippet "${name}"`);
                return false;
            }
        }
        return true;
    });
});

// Test 5: Check package.json
runTest('Package.json validation', () => {
    const packagePath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const required = ['name', 'displayName', 'version', 'publisher', 'contributes'];
    for (const field of required) {
        if (!packageJson[field]) {
            console.log(`    Missing field: ${field}`);
            return false;
        }
    }
    return true;
});

// Print results
console.log('\n' + '='.repeat(50));
console.log(`📊 Test Results: ${passedTests}/${totalTests} passed`);
if (failedTests > 0) {
    console.log(`❌ ${failedTests} tests failed`);
    process.exit(1);
} else {
    console.log('🎉 All tests passed!');
    process.exit(0);
}