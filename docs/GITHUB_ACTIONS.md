# GitHub Actions Setup Guide

This guide explains how to set up automatic builds for the AO3 OR-Tag Extension using GitHub Actions.

## Initial Setup

1. **Create a GitHub repository** for your extension
2. **Push your code** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ao3-or-tag-extension.git
   git push -u origin main
   ```

## Automatic Builds

The GitHub Actions workflow (`.github/workflows/build-extension.yml`) will automatically:

- ✅ Build on every push to `main`/`master` branch
- ✅ Build on every pull request
- ✅ Create downloadable artifacts for Chrome and Firefox
- ✅ Create GitHub releases when you tag a version

## How to Use

### Get Build Artifacts (Every Push)

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Click on the latest workflow run
4. Scroll down to **Artifacts**
5. Download:
   - `ao3-or-tag-chrome.zip` for Chrome/Edge
   - `ao3-or-tag-firefox.zip` for Firefox

### Create a Release (Version Tags)

When you're ready to release a version:

```bash
# Tag your release
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will automatically:
1. Build both Chrome and Firefox versions
2. Create a GitHub Release
3. Attach the ZIP files to the release
4. Generate release notes

Users can then download the extension from the **Releases** page!

## Local Building

You can also build locally without GitHub Actions:

```bash
# Build both versions
npm run build

# Or build individually
npm run build:chrome
npm run build:firefox
```

Output files will be in the `build/` directory:
- `build/ao3-or-tag-chrome.zip`
- `build/ao3-or-tag-firefox.zip`

## Sharing with Others

### Option 1: GitHub Releases (Recommended)
1. Create a release as described above
2. Share the release URL: `https://github.com/YOUR_USERNAME/ao3-or-tag-extension/releases`
3. Users download the ZIP for their browser

### Option 2: Direct Download
1. Users can download artifacts from the Actions tab
2. Or clone the repo and build locally

### Option 3: Browser Extension Stores (Future)
- **Chrome Web Store**: Requires developer account ($5 one-time fee)
- **Firefox Add-ons**: Free, but requires code review

## Troubleshooting

### Build fails on GitHub Actions
- Check the Actions tab for error logs
- Ensure all required files are committed
- Verify `scripts/` directory is not in `.gitignore`

### ZIP files are empty
- Check that file paths in build scripts are correct
- Ensure `zip` command is available (it is on GitHub Actions runners)

### Firefox extension won't load
- Firefox requires Manifest V2 (the build script handles this)
- Check `browser_specific_settings.gecko.id` is unique
- For permanent installation, extension must be signed by Mozilla

## Next Steps

1. **Customize**: Update `manifest.json` with your details
2. **Version**: Update version number before each release
3. **Share**: Share your releases with the AO3 community!
4. **Publish**: Consider publishing to browser extension stores

## Questions?

Check the main [README.md](../README.md) for more information about the extension itself.
