# Development Guide

This guide is for developers who want to contribute to or modify the AO3 OR-Tag Extension.

## 🏗️ Project Structure

```
.
├── manifest.json          # Chrome extension manifest (Manifest V3)
├── content.js            # Main content script (injected into AO3 pages)
├── utils.js              # Tag collection and query building utilities
├── ui.js                 # UI components (toggle switch)
├── options.html          # Options page HTML
├── options.js            # Options page logic
├── options.css           # Options page styling
├── scripts/              # Build scripts
│   ├── build.js         # Master build script
│   ├── build-chrome.js  # Chrome-specific build
│   ├── build-firefox.js # Firefox-specific build
│   └── convert-manifest-firefox.js  # Manifest converter
└── .github/
    └── workflows/
        └── build-extension.yml  # GitHub Actions CI/CD
```

## 🔧 Local Development

### Prerequisites

- Node.js (for build scripts)
- Chrome or Firefox browser
- Git

### Setup

1. **Clone the repository:**
   ```bash
   git clone git@github.com:mnaljm/ao3-or-tag-extension.git
   cd ao3-or-tag-extension
   ```

2. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the repository folder

3. **Load in Firefox:**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select `manifest.json` from the repository

### Making Changes

1. **Edit the code** in your preferred editor
2. **Reload the extension:**
   - Chrome: Click the reload icon on the extension card
   - Firefox: Click "Reload" in about:debugging
3. **Test on AO3** - Changes take effect immediately

### Debugging

- **Chrome:** Right-click the extension icon → "Inspect popup" or check the Console in DevTools
- **Firefox:** Use the Browser Console (Ctrl+Shift+J)
- **Content script logs:** Open DevTools on any AO3 page and check the Console

## 🏗️ Building

### Build Both Versions

```bash
npm run build
```

Output:
- `build/ao3-or-tag-chrome.zip`
- `build/ao3-or-tag-firefox.zip`

### Build Chrome Only

```bash
npm run build:chrome
```

### Build Firefox Only

```bash
npm run build:firefox
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Toggle appears in AO3 filter sidebar
- [ ] Toggle state persists across page loads
- [ ] Selecting 2+ tags with OR mode enabled generates correct query
- [ ] Tags are cleared from form after OR query is generated
- [ ] Query appears in "Search within results" field
- [ ] Results page shows works with ANY of the selected tags
- [ ] Options page saves and loads preferences correctly
- [ ] Extension works on different AO3 pages (works, bookmarks, series)

### Test Pages

- Works listing: https://archiveofourown.org/works
- Tag browse: https://archiveofourown.org/tags/[tag-name]/works
- Fandom browse: https://archiveofourown.org/tags/[fandom-name]/works

## 📝 Code Style

- Use consistent indentation (4 spaces)
- Add comments for complex logic
- Use descriptive variable names
- Follow existing code patterns

## 🔄 How It Works

### Architecture

1. **Injection (`content.js`):**
   - Script runs on all AO3 pages
   - Finds the filter form (`#work-filters`)
   - Injects the OR mode toggle

2. **Tag Collection (`utils.js`):**
   - Scans for checked checkboxes in the sidebar
   - Reads tags from text input fields
   - Extracts tag names and categories

3. **Query Building (`utils.js`):**
   - Groups tags by category
   - Applies OR/AND logic based on preferences
   - Quotes tags properly for AO3 search syntax

4. **Form Modification (`content.js`):**
   - Intercepts form submission when OR mode is enabled
   - Generates OR query and places it in search field
   - Clears original tag selections
   - Submits modified form

### Key Functions

- `injectToggleUI()` - Adds the toggle to the page
- `collectCheckedFilters()` - Gathers selected tags
- `buildComplexQuery()` - Creates the OR query string
- `handleFilterSubmit()` - Intercepts and modifies form submission

## 🚀 Deployment

### GitHub Actions

The repository uses GitHub Actions for automated builds:

- **On push to `production`:** Builds both versions and uploads artifacts
- **On version tag (`v*`):** Creates a GitHub release with ZIP files

See [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md) for details.

### Creating a Release

1. **Update version** in `manifest.json`
2. **Commit changes:**
   ```bash
   git add manifest.json
   git commit -m "Bump version to v1.1.0"
   ```
3. **Create and push tag:**
   ```bash
   git tag v1.1.0 -m "Release v1.1.0"
   git push origin production
   git push origin v1.1.0
   ```
4. **GitHub Actions** will automatically create the release

## 🐛 Common Issues

### Extension doesn't load
- Check for syntax errors in the console
- Verify `manifest.json` is valid JSON
- Ensure all files referenced in manifest exist

### Toggle doesn't appear
- Check if `#work-filters` form exists on the page
- Look for console errors
- Verify content script is injecting (check for "AO3 OR-Tag Extension loaded" log)

### OR query not working
- Verify tags are being collected (check console logs)
- Test query syntax manually in AO3 search
- Check if tags are being cleared from form

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit:** `git commit -m "Add amazing feature"`
6. **Push:** `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Contribution Guidelines

- Keep changes focused and atomic
- Add comments for complex logic
- Test on both Chrome and Firefox
- Update documentation if needed
- Follow existing code style

## 📚 Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Firefox Extension Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [AO3 Search Documentation](https://archiveofourown.org/faq/search)

## 💬 Questions?

- Open an [issue](../../issues) for bugs
- Start a [discussion](../../discussions) for questions
- Check existing issues for similar problems

---

Happy coding! 🚀
