# AO3 OR-Tag Extension

A browser extension that enables OR logic for tag filtering on Archive of Our Own (AO3).

## Features

- 🔀 **OR Logic**: Combine multiple tags with OR instead of AND
- 🎯 **Category Control**: Choose which tag categories use OR logic (tropes, characters, relationships, fandoms)
- 🎨 **Clean UI**: Simple toggle in the AO3 filter sidebar
- ⚙️ **Customizable**: Configure default behavior and category preferences

## Installation

### Chrome/Edge

#### From Release (Recommended)
1. Download `ao3-or-tag-chrome.zip` from the [latest release](../../releases)
2. Extract the ZIP file
3. Open Chrome/Edge and go to `chrome://extensions/` or `edge://extensions/`
4. Enable "Developer mode" (toggle in top-right)
5. Click "Load unpacked"
6. Select the extracted folder

#### From Source
1. Clone this repository
2. Open Chrome/Edge and go to `chrome://extensions/` or `edge://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the repository folder

### Firefox

#### From Release (Recommended)
1. Download `ao3-or-tag-firefox.zip` from the [latest release](../../releases)
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `ao3-or-tag-firefox.zip` file

**Note**: Firefox requires extensions to be signed for permanent installation. The temporary installation method above will work until you restart Firefox.

#### From Source
1. Clone this repository
2. Run `npm install` (if you want to build)
3. Run `node scripts/convert-manifest-firefox.js` to generate Firefox manifest
4. Open Firefox and go to `about:debugging#/runtime/this-firefox`
5. Click "Load Temporary Add-on"
6. Select the `manifest.json` file from the `build/firefox` folder

## Usage

1. **Navigate to AO3**: Go to any works listing page (e.g., browse by fandom, tag, etc.)
2. **Enable OR Mode**: Check the "Enable OR Mode" toggle in the filter sidebar
3. **Select Tags**: Add 2 or more tags using either:
   - The "Other tags to include" text input field (autocomplete)
   - Checkbox filters in the sidebar
4. **Submit**: Click "Sort and Filter"
5. **Results**: The extension will combine your tags with OR logic instead of AND

### Example

Without OR mode:
- Selecting "Harry Potter" + "Star Wars" = Works with BOTH tags (usually 0 results)

With OR mode:
- Selecting "Harry Potter" + "Star Wars" = Works with EITHER tag (many results!)

## Configuration

Click the extension icon or go to the options page to configure:

- **Enable OR Mode by default**: Automatically enable OR mode on page load
- **OR Logic Categories**: Choose which tag categories use OR logic:
  - Additional Tags (Tropes) - Default: ON
  - Characters - Default: OFF
  - Relationships - Default: OFF
  - Fandoms - Default: OFF

## Development

### Building

The extension is automatically built via GitHub Actions on every push. To build locally:

```bash
# Create Chrome build
mkdir -p build/chrome
cp manifest.json content.js utils.js ui.js options.* build/chrome/
cd build/chrome && zip -r ../ao3-or-tag-chrome.zip . && cd ../..

# Create Firefox build
mkdir -p build/firefox
cp content.js utils.js ui.js options.* build/firefox/
node scripts/convert-manifest-firefox.js
cd build/firefox && zip -r ../ao3-or-tag-firefox.zip . && cd ../..
```

### Project Structure

```
.
├── manifest.json          # Chrome extension manifest (Manifest V3)
├── content.js            # Main content script (injected into AO3 pages)
├── utils.js              # Tag collection and query building utilities
├── ui.js                 # UI components (toggle switch)
├── options.html          # Options page HTML
├── options.js            # Options page logic
├── options.css           # Options page styling
└── scripts/
    └── convert-manifest-firefox.js  # Firefox manifest converter
```

## How It Works

1. **Injection**: The extension injects a toggle switch into the AO3 filter sidebar
2. **Tag Collection**: When you submit the filter form with OR mode enabled, it collects all selected tags
3. **Query Generation**: Tags are converted to an OR query: `("Tag 1" OR "Tag 2" OR "Tag 3")`
4. **Form Modification**: The query is placed in the "Search within results" field, and original tag selections are cleared
5. **Submission**: The modified form is submitted to AO3, which processes the OR query

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use and modify as needed.

## Changelog

### v1.0.0
- Initial release
- OR logic for tag filtering
- Support for text input and checkbox tag selection
- Configurable category preferences
- Chrome and Firefox support
