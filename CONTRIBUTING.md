# Contributing to Bootstrap 5 Snippets

Thank you for considering contributing to the Bootstrap 5 Snippets extension! We welcome contributions from the community.

## 🚀 How to Contribute

### Reporting Issues
1. Search existing issues to avoid duplicates
2. Use the issue templates when available
3. Provide clear reproduction steps
4. Include VS Code version and extension version

### Suggesting Features
1. Check existing feature requests
2. Explain the use case and benefits
3. Provide examples if possible

### Code Contributions

#### Prerequisites
- VS Code installed
- Basic knowledge of JSON and snippet syntax
- Familiarity with Bootstrap 5.3 components

#### Development Setup
1. Fork the repository
2. Clone your fork locally
3. Open the project in VS Code
4. Make your changes
5. Test the snippets

#### Snippet Guidelines
1. **Prefixes**: Use consistent `!bs5-` pattern for HTML snippets
2. **JavaScript**: Use `bs5-` pattern (without exclamation)
3. **Descriptions**: Be clear and descriptive
4. **Tab stops**: Use `${1:placeholder}` for meaningful placeholders
5. **Options**: Use `${1|option1,option2|}` for multiple choices
6. **Bootstrap version**: Ensure compatibility with Bootstrap 5.3

#### Example Snippet Format
```json
{
    "Bootstrap 5 Component": {
        "prefix": "!bs5-component",
        "body": [
            "<div class=\"${1|class1,class2|}\">",
            "    ${2:content}",
            "</div>"
        ],
        "description": "Clear description of what this snippet does"
    }
}
```

#### Testing Your Changes
1. Install the extension locally (`F5` in VS Code)
2. Test snippets in different file types (HTML, JS, TS, React)
3. Verify tab stops work correctly
4. Check that all options are valid

#### Pull Request Process
1. Create a feature branch from main
2. Make your changes following the guidelines
3. Update documentation if needed
4. Test thoroughly
5. Submit a pull request with:
   - Clear title and description
   - Reference any related issues
   - List of changes made
   - Screenshots/GIFs if UI-related

## 📋 Types of Contributions Needed

### High Priority
- New Bootstrap 5.3 components
- Missing utility classes
- JavaScript initialization snippets
- Form validation patterns
- Accessibility improvements

### Medium Priority
- Better tab stop placement
- More comprehensive examples
- Component variations
- Documentation improvements

### Low Priority
- Code organization
- Performance optimizations
- Additional language support

## 🎯 Snippet Categories

When adding snippets, place them in the appropriate file:

- **Components**: `snippets/[ComponentName].code-snippets`
- **Utilities**: `snippets/utilities.code-snippets`
- **JavaScript**: `snippets/javascript.code-snippets`
- **Forms**: `snippets/forms.code-snippets` or `snippets/formgroup.code-snippets`
- **Bootstrap 5.3 specific**: `snippets/bootstrap5-3.code-snippets`

## ✅ Code Style

### JSON Files
- Use 4 spaces for indentation
- Keep descriptions concise but clear
- Use double quotes consistently
- Maintain alphabetical order when possible

### Snippet Bodies
- Use semantic HTML
- Include accessibility attributes
- Follow Bootstrap's class naming conventions
- Use meaningful placeholder text

## 📝 Documentation

When adding new features:
1. Update the README.md
2. Add entries to CHANGELOG.md
3. Update the snippet tables
4. Include usage examples

## 🔄 Release Process

Maintainers handle releases, but contributors should:
1. Follow semantic versioning principles
2. Document breaking changes
3. Update version numbers appropriately

## 📞 Getting Help

- Create an issue for questions
- Use GitHub Discussions for broader topics
- Check existing documentation first

## 🏆 Recognition

Contributors will be acknowledged in:
- README.md credits section
- Release notes
- GitHub contributors list

## 📜 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

Thank you for helping make Bootstrap development faster and more enjoyable! 🎉