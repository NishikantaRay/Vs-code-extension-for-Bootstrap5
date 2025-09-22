#!/bin/bash

# Bootstrap 5 Snippets Publishing Script
# Publishes to both VS Code Marketplace and OpenVSX Registry

set -e

echo "🚀 Bootstrap 5 Snippets Publishing Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from extension root directory."
    exit 1
fi

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME="bootstrap5snippets-${VERSION}.vsix"

echo "📦 Current version: $VERSION"

# Clean old packages
echo "🧹 Cleaning old VSIX packages..."
rm -f *.vsix

# Package the extension
echo "📦 Packaging extension..."
vsce package

# Check if package was created
if [ ! -f "$PACKAGE_NAME" ]; then
    echo "❌ Error: Package $PACKAGE_NAME was not created"
    exit 1
fi

echo "✅ Package created: $PACKAGE_NAME"

# Publish to VS Code Marketplace
echo ""
echo "🏪 Publishing to VS Code Marketplace..."
read -p "Do you want to publish to VS Code Marketplace? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Publishing to VS Code Marketplace..."
    if vsce publish; then
        echo "✅ Successfully published to VS Code Marketplace!"
    else
        echo "❌ Failed to publish to VS Code Marketplace"
    fi
else
    echo "⏭️  Skipping VS Code Marketplace"
fi

# Publish to OpenVSX Registry
echo ""
echo "🌐 Publishing to OpenVSX Registry..."
read -p "Do you want to publish to OpenVSX Registry? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Publishing to OpenVSX Registry..."
    if ovsx publish "$PACKAGE_NAME"; then
        echo "✅ Successfully published to OpenVSX Registry!"
    else
        echo "❌ Failed to publish to OpenVSX Registry"
    fi
else
    echo "⏭️  Skipping OpenVSX Registry"
fi

echo ""
echo "🎉 Publishing process completed!"
echo "📦 Package: $PACKAGE_NAME"
echo "🔗 VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=Nishikanta12.bootstrap5snippets"
echo "🔗 OpenVSX Registry: https://open-vsx.org/extension/Nishikanta12/bootstrap5snippets"