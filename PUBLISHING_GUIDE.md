# 🚀 Publishing Guide - Bootstrap 5 Snippets Extension

This guide explains how to publish your enhanced Bootstrap 5 extension to both VS Code Marketplace and OpenVSX Registry.

## 📋 Prerequisites

1. ✅ **Tools Installed**: `vsce` and `ovsx` CLI tools
2. ✅ **Extension Packaged**: `bootstrap5snippets-2.0.0.vsix`
3. 🔑 **Access Tokens**: Required for both marketplaces

## 🏪 VS Code Marketplace Publishing

### Step 1: Get Personal Access Token (PAT)

1. Visit [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft account
3. Create or select publisher `Nishikanta12`
4. Go to "Personal Access Tokens" tab
5. Click "New Token"
6. Configure token:
   - **Name**: `Bootstrap5-Snippets-Publishing`
   - **Organization**: Select your organization
   - **Scopes**: Select "Marketplace (Manage)"
   - **Expiration**: 1 year (recommended)
7. Copy the generated token (save it securely!)

### Step 2: Login and Publish

```bash
# Login with vsce
vsce login Nishikanta12
# Enter your PAT when prompted

# Publish the extension
cd /Users/nishikantaray/Desktop/Vs-code-extension-for-Bootstrap5
vsce publish

# Or use npm script
npm run publish:vscode
```

## 🌐 OpenVSX Registry Publishing

### Step 1: Get OpenVSX Access Token

1. Visit [OpenVSX Registry](https://open-vsx.org/)
2. Sign in with your GitHub account
3. Go to your profile page (click your avatar)
4. Click "Access Tokens" tab
5. Click "Generate New Token"
6. Configure token:
   - **Description**: `Bootstrap5-Snippets-Publishing`
   - **Scopes**: Select appropriate scopes
7. Copy the generated token

### Step 2: Login and Publish

```bash
# Login with ovsx
ovsx login
# Enter your OpenVSX token when prompted

# Publish the extension
ovsx publish bootstrap5snippets-2.0.0.vsix

# Or use npm script
npm run publish:ovsx
```

## 🔄 Automated Publishing

Use the provided script for streamlined publishing to both marketplaces:

```bash
# Make script executable (if not already done)
chmod +x publish.sh

# Run automated publishing
./publish.sh

# Or use npm script
npm run publish:all
```

## 📱 Manual Upload Alternative

If you prefer manual uploads:

### VS Code Marketplace
1. Go to [marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)
2. Select your publisher
3. Click "New extension"
4. Upload `bootstrap5snippets-2.0.0.vsix`
5. Fill in any additional details
6. Publish

### OpenVSX Registry
1. Go to [open-vsx.org](https://open-vsx.org/)
2. Sign in with GitHub
3. Click "Publish Extension"
4. Upload `bootstrap5snippets-2.0.0.vsix`
5. Confirm and publish

## 🔧 Version Management

For future updates:

```bash
# Patch version (2.0.0 → 2.0.1)
npm run version:patch

# Minor version (2.0.0 → 2.1.0)
npm run version:minor

# Major version (2.0.0 → 3.0.0)
npm run version:major
```

## 📊 Post-Publishing

After successful publishing:

1. **VS Code Marketplace**: https://marketplace.visualstudio.com/items?itemName=Nishikanta12.bootstrap5snippets
2. **OpenVSX Registry**: https://open-vsx.org/extension/Nishikanta12/bootstrap5snippets

### Monitor Your Extension

- Check download statistics
- Respond to user reviews
- Monitor GitHub issues
- Update documentation as needed

## 🛠️ Troubleshooting

### Common Issues:

1. **"Publisher not found"**: Ensure you're using the correct publisher name (`Nishikanta12`)
2. **"Invalid token"**: Check token expiration and scopes
3. **"Extension already exists"**: Use `vsce publish --force` to overwrite
4. **"File size too large"**: Check `.vscodeignore` file to exclude unnecessary files

### Useful Commands:

```bash
# List files included in package
vsce ls --tree

# Validate package without publishing
vsce package --no-update-package-json

# Check extension info
vsce show Nishikanta12.bootstrap5snippets

# Unpublish extension (use carefully!)
vsce unpublish Nishikanta12.bootstrap5snippets
```

## 📈 Success Metrics

Your enhanced Bootstrap 5 extension includes:

- ✅ **57+ Professional Snippets**
- ✅ **Full Accessibility Support** (ARIA, WCAG 2.1)
- ✅ **Multi-Framework Support** (Vue, Angular, Svelte, PHP)
- ✅ **Modern Developer Experience**
- ✅ **SEO-Optimized Documentation**

Expected impact:
- **Target Audience**: 100K+ web developers
- **Use Cases**: Rapid Bootstrap development with accessibility
- **Competitive Advantage**: Only accessibility-first Bootstrap extension

---

## 🎉 You're Ready to Publish!

Your Bootstrap 5 extension has been transformed into a professional, market-ready product. Follow the steps above to share your accessibility-first Bootstrap snippets with the developer community!

**Happy Publishing! 🚀**