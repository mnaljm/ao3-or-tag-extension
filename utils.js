// utils.js - Helper functions for tag parsing, quoting, and DOM scanning

/**
 * Collects checked filter inputs from the sidebar.
 * Scans for checkboxes in the filters sidebar and extracts the tag name from the label.
 * @param {HTMLElement} [root] - The root element to search within. Defaults to #work_filters.
 * @returns {Array<Object>} Array of tag objects { id, value, name, category }
 */
function collectCheckedFilters(root) {
    const tags = [];
    // Target the filters form. Usually #work_filters or similar.
    // We look for checked inputs that are NOT the rating/warning/category/status toggles if we want to be specific,
    // but the user wants to OR "tags".
    // AO3 structure: <dt class="filter-toggle">...</dt><dd><ul><li><label><input ...> Tag Name (Count)</label></li>...</ul></dd>

    // Select all checked checkboxes within the sidebar filters
    const sidebar = root || document.querySelector('#work_filters');
    if (!sidebar) return [];

    // 1. Collect checkbox-based tags
    const checkedInputs = sidebar.querySelectorAll('input[type="checkbox"]:checked');

    console.log(`Found ${checkedInputs.length} checked checkboxes`);

    checkedInputs.forEach((input, index) => {
        // Skip our own toggle checkbox!
        if (input.id && input.id.startsWith('ao3-or-tag-toggle')) {
            console.log(`Checkbox ${index}: Skipping OR mode toggle`);
            return;
        }

        console.log(`Checkbox ${index}:`, {
            id: input.id,
            name: input.name,
            value: input.value,
            parentTag: input.parentElement?.tagName
        });

        // We need to get the label text.
        // The input is usually inside the label or the label has a 'for' attribute.
        let labelText = "";

        // Check if parent is label
        if (input.parentElement.tagName === 'LABEL') {
            labelText = input.parentElement.innerText;
        } else {
            // Try to find label by 'for' attribute
            const id = input.id;
            if (id) {
                const label = sidebar.querySelector(`label[for="${id}"]`);
                if (label) labelText = label.innerText;
            }
        }

        console.log(`  Label text: "${labelText}"`);

        if (labelText) {
            // Clean up label text: remove the count " (123)" at the end
            labelText = labelText.trim();
            const match = labelText.match(/^(.*?)\s*\(\d+\)$/);
            const tagName = match ? match[1] : labelText;

            // Determine category if possible (from the group header)
            // This is a bit heuristic.
            let category = "unknown";
            const group = input.closest('dd');
            if (group) {
                const dt = group.previousElementSibling;
                if (dt && dt.tagName === 'DT') {
                    category = dt.innerText.trim().toLowerCase();
                }
            }

            console.log(`  Adding tag: "${tagName}" (category: ${category})`);

            tags.push({
                id: input.id,
                value: input.value,
                name: tagName.trim(),
                category: category
            });
        } else {
            console.log(`  Skipping - no label text found`);
        }
    });

    // 2. Collect tags from text input fields (e.g., "Other tags to include")
    const tagInputs = sidebar.querySelectorAll('input[name="work_search[other_tag_names]"]');
    tagInputs.forEach(input => {
        const value = input.value.trim();
        if (value) {
            // Tags are comma-separated in the input
            const tagNames = value.split(',').map(t => t.trim()).filter(t => t);
            console.log(`Found ${tagNames.length} tags in text input:`, tagNames);

            tagNames.forEach(tagName => {
                tags.push({
                    id: '',
                    value: tagName,
                    name: tagName,
                    category: 'other_tags' // These go to "other tags to include"
                });
            });
        }
    });

    return tags;
}

/**
 * Builds the query string from an array of tags, respecting category preferences.
 * @param {Array<Object>} tags - List of tag objects
 * @param {Object} categoryPrefs - Map of category -> boolean (true for OR, false for AND)
 * @returns {string} The constructed query string
 */
function buildComplexQuery(tags, categoryPrefs) {
    if (!tags || tags.length === 0) return "";

    // Group tags by category
    const grouped = {};
    tags.forEach(tag => {
        // Normalize category name to match preferences keys if possible
        // Pref keys: tropes, characters, relationships, fandoms
        // Tag categories from AO3: "additional tags", "characters", "relationships", "fandoms"
        let key = tag.category;
        if (key === 'additional tags') key = 'tropes';

        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(tag);
    });

    const parts = [];

    for (const [cat, catTags] of Object.entries(grouped)) {
        const useOr = categoryPrefs[cat] !== false; // Default to OR if not specified? Or check prefs?
        // User prefs in options.js: tropes: true, characters: false, etc.
        // We should probably default to AND if unknown, or follow the "OR Mode" intent.
        // Let's assume if it's in the prefs and true, use OR. Else AND.
        // Wait, the user wants "OR Mode" to be the main feature.
        // But the options page has checkboxes for "OR Logic Categories".

        const quotedTags = catTags.map(tag => quoteTag(tag.name));

        if (useOr && quotedTags.length > 1) {
            parts.push(`(${quotedTags.join(" OR ")})`);
        } else {
            // AND logic (or single tag)
            if (quotedTags.length > 1) {
                parts.push(`(${quotedTags.join(" AND ")})`);
            } else {
                parts.push(quotedTags[0]);
            }
        }
    }

    return parts.join(" AND ");
}

/**
 * Properly quotes and escapes a tag for AO3 search.
 * @param {string} tag - The tag text
 * @returns {string} Quoted tag
 */
function quoteTag(tag) {
    // Escape internal quotes
    const escaped = tag.replace(/"/g, '\\"');
    return `"${escaped}"`;
}
