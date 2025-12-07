const fs = require('fs');
const path = require('path');

// Read the Chrome manifest
const chromeManifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

// Convert to Firefox manifest (Manifest V2 for better compatibility)
const firefoxManifest = {
    manifest_version: 2,
    name: chromeManifest.name,
    version: chromeManifest.version,
    description: chromeManifest.description,

    permissions: [
        "storage",
        "*://archiveofourown.org/*"
    ],

    content_scripts: [
        {
            matches: ["*://archiveofourown.org/*"],
            js: ["utils.js", "ui.js", "content.js"],
            run_at: "document_end"
        }
    ],

    options_ui: {
        page: "options.html",
        open_in_tab: false
    },

    browser_action: {
        default_title: "AO3 OR-Tag Settings",
        default_popup: "options.html"
    },

    browser_specific_settings: {
        gecko: {
            id: "ao3-or-tag@example.com",
            strict_min_version: "57.0"
        }
    }
};

// Write Firefox manifest
fs.writeFileSync(
    path.join('build', 'firefox', 'manifest.json'),
    JSON.stringify(firefoxManifest, null, 2)
);

console.log('Firefox manifest created successfully!');
