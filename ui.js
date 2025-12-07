// ui.js - Handles toggle UI and settings panel

// ui.js - Handles toggle UI and settings panel

/**
 * Creates the OR mode toggle switch.
 * @param {boolean} initialState - Whether the toggle is on or off.
 * @param {Function} onToggle - Callback when toggled.
 * @returns {HTMLElement} The container element.
 */
function createToggleSwitch(initialState, onToggle) {
    const container = document.createElement('div');
    container.id = 'ao3-or-tag-toggle-container';
    container.style.margin = '10px 0';
    container.style.padding = '5px';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '3px';
    container.style.backgroundColor = '#f0f0f0';

    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.cursor = 'pointer';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'ao3-or-tag-toggle';
    checkbox.checked = initialState;
    checkbox.style.marginRight = '8px';

    const text = document.createElement('span');
    text.innerText = "Enable OR Mode";
    text.style.fontWeight = 'bold';

    checkbox.addEventListener('change', (e) => {
        onToggle(e.target.checked);
    });

    label.appendChild(checkbox);
    label.appendChild(text);
    container.appendChild(label);

    // Add a small tooltip or help text
    const help = document.createElement('div');
    help.innerText = "Combine selected filters with OR logic.";
    help.style.fontSize = '0.85em';
    help.style.color = '#666';
    help.style.marginTop = '4px';
    help.style.marginLeft = '20px';
    container.appendChild(help);

    return container;
}
