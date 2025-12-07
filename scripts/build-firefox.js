const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building Firefox extension...');

// Create build directory
const buildDir = path.join(__dirname, '..', 'build', 'firefox');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

// Files to include in Firefox build
const files = [
    'content.js',
    'utils.js',
    'ui.js',
    'options.html',
    'options.js',
    'options.css'
];

// Copy files
files.forEach(file => {
    const src = path.join(__dirname, '..', file);
    const dest = path.join(buildDir, file);
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file}`);
});

// Convert manifest for Firefox
console.log('Converting manifest for Firefox...');
const chromeManifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'manifest.json'), 'utf8'));

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
            strict_min_version: "57.0",
            data_collection_permissions: {
                builtin: false
            }
        }
    }
};

fs.writeFileSync(
    path.join(buildDir, 'manifest.json'),
    JSON.stringify(firefoxManifest, null, 2)
);
console.log('Created Firefox manifest.json');

// Create ZIP
try {
    execSync(`cd ${buildDir} && zip -r ../ao3-or-tag-firefox.zip .`, { stdio: 'inherit' });
    console.log('\n✅ Firefox extension built successfully!');
    console.log(`📦 Output: build/ao3-or-tag-firefox.zip`);
} catch (error) {
    console.error('❌ Failed to create ZIP file');
    process.exit(1);
}
