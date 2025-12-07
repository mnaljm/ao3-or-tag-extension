const { execSync } = require('child_process');

console.log('🔨 Building AO3 OR-Tag Extension\n');

try {
    console.log('Building Chrome version...');
    execSync('node scripts/build-chrome.js', { stdio: 'inherit' });

    console.log('\nBuilding Firefox version...');
    execSync('node scripts/build-firefox.js', { stdio: 'inherit' });

    console.log('\n✨ All builds completed successfully!\n');
    console.log('📦 Chrome: build/ao3-or-tag-chrome.zip');
    console.log('📦 Firefox: build/ao3-or-tag-firefox.zip');
} catch (error) {
    console.error('\n❌ Build failed');
    process.exit(1);
}
