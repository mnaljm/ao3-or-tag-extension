// options.js

// Saves options to chrome.storage
const saveOptions = () => {
    const tropes = document.getElementById('cat-tropes').checked;
    const characters = document.getElementById('cat-characters').checked;
    const relationships = document.getElementById('cat-relationships').checked;
    const fandoms = document.getElementById('cat-fandoms').checked;
    const defaultEnabled = document.getElementById('default-enabled').checked;

    chrome.storage.sync.set(
        {
            categories: {
                tropes,
                characters,
                relationships,
                fandoms
            },
            defaultEnabled
        },
        () => {
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 750);
        }
    );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.sync.get(
        {
            categories: {
                tropes: true,
                characters: false,
                relationships: false,
                fandoms: false
            },
            defaultEnabled: false
        },
        (items) => {
            document.getElementById('cat-tropes').checked = items.categories.tropes;
            document.getElementById('cat-characters').checked = items.categories.characters;
            document.getElementById('cat-relationships').checked = items.categories.relationships;
            document.getElementById('cat-fandoms').checked = items.categories.fandoms;
            document.getElementById('default-enabled').checked = items.defaultEnabled;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('options-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveOptions();
});
