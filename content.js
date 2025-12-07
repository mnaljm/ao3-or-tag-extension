// content.js - Injected into AO3 pages; handles DOM reading & tag conversion

console.log("AO3 OR-Tag Extension loaded.");

window.onerror = function (msg, url, line) {
    alert("AO3 OR-Tag Error: " + msg + "\nLine: " + line);
};

let orModeEnabled = false;
let categoryPrefs = {
    tropes: true,
    characters: false,
    relationships: false,
    fandoms: false
};

function init() {
    try {
        console.log("AO3 OR-Tag: Init started");

        // Visual indicator that script is running
        const indicator = document.createElement('div');
        indicator.innerText = "OR-Tag Active";
        indicator.style.position = "fixed";
        indicator.style.bottom = "0";
        indicator.style.right = "0";
        indicator.style.background = "green";
        indicator.style.color = "white";
        indicator.style.padding = "2px 5px";
        indicator.style.fontSize = "10px";
        indicator.style.zIndex = "9999";
        document.body.appendChild(indicator);

        chrome.storage.sync.get(['defaultEnabled', 'categories'], (result) => {
            console.log("AO3 OR-Tag: Storage loaded", result);
            // Handle undefined result (storage not initialized)
            if (result && typeof result === 'object') {
                orModeEnabled = result.defaultEnabled || false;
                if (result.categories) {
                    categoryPrefs = result.categories;
                }
            }
            injectToggleUI();
            observePageChanges();
        });
    } catch (e) {
        alert("AO3 OR-Tag Init Error: " + e.message);
    }
}

function findAllFilterForms() {
    const candidates = [];

    // 1. Try IDs
    const id1 = document.getElementById('work_filters');
    if (id1) candidates.push(id1);
    const id2 = document.getElementById('work-filters'); // Confirmed ID
    if (id2 && !candidates.includes(id2)) candidates.push(id2);

    // 2. Try class
    const sidebar = document.querySelector('.filters');
    if (sidebar) {
        const formInSidebar = sidebar.querySelector('form');
        if (formInSidebar && !candidates.includes(formInSidebar)) candidates.push(formInSidebar);
    }

    // 3. Fallback scan
    const forms = document.querySelectorAll('form');
    for (const f of forms) {
        if (f.id === 'search') continue;
        if (candidates.includes(f)) continue;

        if (f.querySelector('dt.filter-toggle') ||
            f.querySelector('input[name="work_search[query]"]')) {
            candidates.push(f);
        }
    }

    return candidates;
}

function injectToggleUI() {
    // Inject toggle into filter forms
    const forms = findAllFilterForms();
    if (forms.length > 0) {
        forms.forEach((filtersForm, index) => {
            if (filtersForm.querySelector('#ao3-or-tag-toggle-container-' + index)) return;

            console.log(`AO3 OR-Tag: Injecting toggle into form ${index}`, filtersForm);

            // Insert at the very top of the form
            const target = filtersForm.firstChild;

            // Create a unique toggle for this form
            const toggle = createToggleSwitch(orModeEnabled, (enabled) => {
                orModeEnabled = enabled;
                console.log("OR Mode toggled:", orModeEnabled);
                updateVisualFeedback();
            });
            toggle.id = 'ao3-or-tag-toggle-container-' + index;

            filtersForm.insertBefore(toggle, target);

            filtersForm.addEventListener('submit', handleFilterSubmit);
        });
    }

    updateVisualFeedback();
}

function handleFilterSubmit(event) {
    console.log("Form submitted! OR Mode enabled:", orModeEnabled);

    if (!orModeEnabled) {
        console.log("OR Mode is disabled, allowing normal form submission");
        return;
    }

    const filtersForm = event.target; // The form that was submitted
    const tags = collectCheckedFilters(filtersForm);

    console.log("Collected tags:", tags);

    if (tags.length < 2) {
        console.log("Less than 2 tags selected, allowing normal submission");
        return;
    }

    event.preventDefault();
    console.log("Intercepting submit for OR Mode...");

    const query = buildComplexQuery(tags, categoryPrefs);
    console.log("Generated Query:", query);

    // Find "Search within results" input
    let searchInput = document.getElementById('work_search_query');
    if (!searchInput) {
        // Fallback
        searchInput = document.querySelector('input[name="work_search[query]"]');
    }

    if (searchInput) {
        let currentVal = searchInput.value.trim();
        if (currentVal) {
            // Avoid double-adding if we already did this (though usually page reloads)
            if (!currentVal.includes(query)) {
                searchInput.value = `(${currentVal}) AND(${query})`;
            }
        } else {
            searchInput.value = query;
        }
    } else {
        console.warn("AO3 OR-Tag: Search input not found!");
    }

    // Uncheck the original filters so they don't get sent as AND params
    tags.forEach(tag => {
        if (tag.id) {
            const input = document.getElementById(tag.id);
            if (input) input.checked = false;
        }
    });

    // Clear the "Other tags to include" text input field
    const otherTagsInput = filtersForm.querySelector('input[name="work_search[other_tag_names]"]');
    if (otherTagsInput) {
        console.log("Clearing other_tag_names input field");
        otherTagsInput.value = '';
    }

    // Now submit the form
    event.target.submit();
}

function updateVisualFeedback() {
    // Update all toggles
    const toggles = document.querySelectorAll('[id^="ao3-or-tag-toggle-container"]');
    toggles.forEach(container => {
        // Subtle visual feedback
        container.style.borderColor = orModeEnabled ? '#990000' : '#ddd';
        container.style.backgroundColor = orModeEnabled ? '#fff0f0' : '#f0f0f0';

        // Update checkbox state if needed
        const checkbox = container.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked !== orModeEnabled) {
            checkbox.checked = orModeEnabled;
        }
    });
}

function observePageChanges() {
    // Simple observer to handle if the form is replaced or loaded late
    const observer = new MutationObserver((mutations) => {
        // Check if any of our toggles are missing
        const forms = findAllFilterForms();
        let missing = false;
        forms.forEach((f, i) => {
            if (!f.querySelector('#ao3-or-tag-toggle-container-' + i)) {
                missing = true;
            }
        });

        if (missing) {
            injectToggleUI();
        }
    });

    const main = document.getElementById('main') || document.body;
    observer.observe(main, { childList: true, subtree: true });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
