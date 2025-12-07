const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building Chrome extension...');

// Create build directory
const buildDir = path.join(__dirname, '..', 'build', 'chrome');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

// Files to include in Chrome build
const files = [
    'manifest.json',
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

// Create ZIP
try {
    execSync(`cd ${buildDir} && zip -r ../ao3-or-tag-chrome.zip .`, { stdio: 'inherit' });
    console.log('\n✅ Chrome extension built successfully!');
    console.log(`📦 Output: build/ao3-or-tag-chrome.zip`);
} catch (error) {
    console.error('❌ Failed to create ZIP file');
    process.exit(1);
}
