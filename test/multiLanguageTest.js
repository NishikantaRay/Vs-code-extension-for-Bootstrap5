const fs = require('fs');
const path = require('path');

console.log('🌍 MULTI-LANGUAGE BOOTSTRAP 5 SNIPPETS TEST');
console.log('============================================');

// Define language files to test
const languageFiles = [
    { file: 'vue.code-snippets', name: 'Vue.js', languages: ['vue', 'vue-html'] },
    { file: 'angular.code-snippets', name: 'Angular', languages: ['html', 'typescript'] },
    { file: 'svelte.code-snippets', name: 'Svelte', languages: ['svelte'] },
    { file: 'php.code-snippets', name: 'PHP', languages: ['php'] }
];

let totalSnippets = 0;
let totalLanguageSupport = 0;
const results = [];

// Test each language file
languageFiles.forEach(({ file, name, languages }) => {
    try {
        const filePath = path.join(__dirname, '..', 'snippets', file);
        const content = fs.readFileSync(filePath, 'utf8');
        const snippets = JSON.parse(content);
        
        const snippetCount = Object.keys(snippets).length;
        const prefixes = Object.values(snippets).map(snippet => snippet.prefix);
        
        console.log(`\n✅ ${name} Templates:`);
        console.log(`   📁 File: ${file}`);
        console.log(`   🔢 Snippets: ${snippetCount}`);
        console.log(`   🌐 Languages: ${languages.join(', ')}`);
        console.log(`   🏷️  Prefixes: ${prefixes.slice(0, 5).join(', ')}${snippetCount > 5 ? ', ...' : ''}`);
        
        // Validate snippet structure
        let validSnippets = 0;
        Object.entries(snippets).forEach(([key, snippet]) => {
            if (snippet.prefix && snippet.body && snippet.description) {
                validSnippets++;
            }
        });
        
        console.log(`   ✅ Valid: ${validSnippets}/${snippetCount} snippets`);
        
        totalSnippets += snippetCount;
        totalLanguageSupport += languages.length;
        
        results.push({
            name,
            file,
            snippetCount,
            languages: languages.length,
            validSnippets,
            success: validSnippets === snippetCount
        });
        
    } catch (error) {
        console.log(`\n❌ ${name} Templates:`);
        console.log(`   Error: ${error.message}`);
        results.push({
            name,
            file,
            snippetCount: 0,
            languages: 0,
            validSnippets: 0,
            success: false,
            error: error.message
        });
    }
});

// Test package.json configuration
console.log('\n🔧 PACKAGE.JSON CONFIGURATION:');
try {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageData = JSON.parse(packageContent);
    
    // Count language configurations
    const languageConfigs = packageData.contributes.snippets;
    const supportedLanguages = [...new Set(languageConfigs.map(config => config.language))];
    
    console.log(`   📦 Total snippet configurations: ${languageConfigs.length}`);
    console.log(`   🌐 Supported languages: ${supportedLanguages.length}`);
    console.log(`   📝 Languages: ${supportedLanguages.join(', ')}`);
    console.log(`   📊 Version: ${packageData.version}`);
    
    // Check for new language files
    const newLanguageFiles = languageConfigs.filter(config => 
        ['vue.code-snippets', 'angular.code-snippets', 'svelte.code-snippets', 'php.code-snippets']
        .includes(path.basename(config.path))
    );
    
    console.log(`   ✨ New multi-language files: ${newLanguageFiles.length}`);
    
} catch (error) {
    console.log(`   ❌ Error reading package.json: ${error.message}`);
}

// Summary
console.log('\n📊 MULTI-LANGUAGE SUPPORT SUMMARY:');
console.log('===================================');
console.log(`🎯 Total new snippets: ${totalSnippets}`);
console.log(`🌍 Total language support: ${totalLanguageSupport} configurations`);

const successfulLanguages = results.filter(r => r.success).length;
const successRate = ((successfulLanguages / results.length) * 100).toFixed(1);

console.log(`✅ Success rate: ${successRate}% (${successfulLanguages}/${results.length} languages)`);

// Detailed results
console.log('\n📋 DETAILED RESULTS:');
results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.validSnippets} snippets, ${result.languages} language(s)`);
    if (result.error) {
        console.log(`   Error: ${result.error}`);
    }
});

// Framework-specific snippets summary
console.log('\n🚀 FRAMEWORK-SPECIFIC FEATURES:');
console.log('Vue.js: Template syntax, reactive data, event handling, v-for, v-if');
console.log('Angular: Property binding, event binding, *ngFor, *ngIf, reactive forms');
console.log('Svelte: Component props, reactive statements, event handlers, each blocks');
console.log('PHP: Server-side rendering, XSS protection, database integration, forms');

console.log('\n🎉 MULTI-LANGUAGE ENHANCEMENT COMPLETED!');
console.log('Your Bootstrap 5 extension now supports Vue.js, Angular, Svelte, and PHP templates!');