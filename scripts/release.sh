#!/bin/bash
# HymnFlow Release Script
# Creates a release package and git tag

set -e

# Get version from package.json
VERSION=$(grep '"version"' package.json | grep -o '"[^"]*"' | sed 's/"//g' | tail -1)

if [ -z "$VERSION" ]; then
    echo "Error: Could not read version from package.json"
    exit 1
fi

echo "🚀 Creating HymnFlow v$VERSION release..."

# Abort if there are uncommitted changes - tag must point to a clean commit
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Error: You have uncommitted changes. Commit everything before releasing."
    exit 1
fi

# Create release directory
RELEASE_DIR="hymnflow-v$VERSION"
if [ -d "$RELEASE_DIR" ]; then
    rm -rf "$RELEASE_DIR"
fi
mkdir -p "$RELEASE_DIR"

# Copy essential files
echo "📦 Packaging files..."
cp -r public/obs-dock "$RELEASE_DIR/"
cp -r public/obs-overlay "$RELEASE_DIR/"
cp -r public/data "$RELEASE_DIR/"
cp -r public/parsers "$RELEASE_DIR/"
cp -r public/i18n "$RELEASE_DIR/"
cp public/obs-setup.html "$RELEASE_DIR/"
cp public/validation.js "$RELEASE_DIR/"
cp README.md "$RELEASE_DIR/"
cp doc/SETUP.md "$RELEASE_DIR/"
cp doc/TROUBLESHOOTING.md "$RELEASE_DIR/"
cp doc/SECURITY.md "$RELEASE_DIR/"

# Create ZIP
ZIP_FILE="hymnflow-v$VERSION-plugin.zip"
echo "📦 Creating ZIP: $ZIP_FILE..."
zip -r "$ZIP_FILE" "$RELEASE_DIR" > /dev/null
du -h "$ZIP_FILE"

# Create git tag
echo "🏷️  Creating git tag v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION - HymnFlow OBS Plugin"

# Verify
echo ""
echo "✅ Release created successfully!"
echo ""
echo "📋 Summary:"
echo "   Version: v$VERSION"
echo "   Package: $ZIP_FILE"
echo "   Size: $(du -h "$ZIP_FILE" | cut -f1)"
echo "   Git Tag: v$VERSION"
echo ""
echo "📤 Next steps:"
echo "   1. Review the ZIP file contents"
echo "   2. Push tag: git push origin v$VERSION"
echo "   3. Create GitHub release with the ZIP file"
echo "   4. Announce release"
