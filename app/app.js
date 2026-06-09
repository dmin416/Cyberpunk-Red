// Application State
let allItems = [];
let filteredItems = [];
let currentFilters = {
    search: '',
    category: '',
    subcategory: '',
    availability: ''
};
let currentSort = 'name';

// DOM Elements (will be initialized after DOM loads)
let searchInput;
let categoryFilter;
let subcategoryFilter;
let availabilityFilter;
let sortBySelect;
let resetButton;
let itemsGrid;
let itemCountSpan;
let filteredCountSpan;
let itemModal;
let modalBody;
let closeModal;
let hoverTooltip;

// Initialize the application
function init() {
    // Get DOM elements after DOM is ready
    searchInput = document.getElementById('searchInput');
    categoryFilter = document.getElementById('categoryFilter');
    subcategoryFilter = document.getElementById('subcategoryFilter');
    availabilityFilter = document.getElementById('availabilityFilter');
    sortBySelect = document.getElementById('sortBy');
    resetButton = document.getElementById('resetFilters');
    itemsGrid = document.getElementById('itemsGrid');
    itemCountSpan = document.getElementById('itemCount');
    filteredCountSpan = document.getElementById('filteredCount');
    itemModal = document.getElementById('itemModal');
    modalBody = document.getElementById('modalBody');
    closeModal = document.getElementById('closeModal');
    hoverTooltip = document.getElementById('hoverTooltip');

    allItems = [...itemsDatabase];
    filteredItems = [...allItems];

    setupEventListeners();
    populateSubcategoryFilter();
    updateStats();
    renderItems();
}

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearchInput);
    categoryFilter.addEventListener('change', handleCategoryChange);
    subcategoryFilter.addEventListener('change', handleSubcategoryChange);
    availabilityFilter.addEventListener('change', handleAvailabilityChange);
    sortBySelect.addEventListener('change', handleSortChange);
    resetButton.addEventListener('click', resetFilters);
    closeModal.addEventListener('click', closeItemModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === itemModal) {
            closeItemModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && itemModal.style.display === 'block') {
            closeItemModal();
        }
    });
}

// Search Handler
function handleSearchInput(e) {
    currentFilters.search = e.target.value.toLowerCase().trim();
    applyFilters();
}

// Category Filter Handler
function handleCategoryChange(e) {
    currentFilters.category = e.target.value;
    currentFilters.subcategory = ''; // Reset subcategory when category changes
    subcategoryFilter.value = '';
    populateSubcategoryFilter();
    applyFilters();
}

// Subcategory Filter Handler
function handleSubcategoryChange(e) {
    currentFilters.subcategory = e.target.value;
    applyFilters();
}

// Availability Filter Handler
function handleAvailabilityChange(e) {
    currentFilters.availability = e.target.value;
    applyFilters();
}

// Sort Handler
function handleSortChange(e) {
    currentSort = e.target.value;
    sortItems();
    renderItems();
}

// Populate subcategory dropdown based on selected category
function populateSubcategoryFilter() {
    const category = currentFilters.category;
    const subcategories = new Set();

    if (category) {
        allItems
            .filter(item => item.category === category)
            .forEach(item => subcategories.add(item.subcategory));
    } else {
        allItems.forEach(item => subcategories.add(item.subcategory));
    }

    subcategoryFilter.innerHTML = '<option value="">All Subcategories</option>';
    [...subcategories].sort().forEach(subcat => {
        const option = document.createElement('option');
        option.value = subcat;
        option.textContent = subcat;
        subcategoryFilter.appendChild(option);
    });
}

// Apply all filters
function applyFilters() {
    filteredItems = allItems.filter(item => {
        // Search filter
        if (currentFilters.search) {
            const searchMatch =
                item.name.toLowerCase().includes(currentFilters.search) ||
                item.description.toLowerCase().includes(currentFilters.search) ||
                item.tags.some(tag => tag.toLowerCase().includes(currentFilters.search)) ||
                item.category.toLowerCase().includes(currentFilters.search) ||
                item.subcategory.toLowerCase().includes(currentFilters.search);

            if (!searchMatch) return false;
        }

        // Category filter
        if (currentFilters.category && item.category !== currentFilters.category) {
            return false;
        }

        // Subcategory filter
        if (currentFilters.subcategory && item.subcategory !== currentFilters.subcategory) {
            return false;
        }

        // Availability filter
        if (currentFilters.availability && item.availability !== currentFilters.availability) {
            return false;
        }

        return true;
    });

    sortItems();
    updateStats();
    renderItems();
}

// Sort items
function sortItems() {
    switch (currentSort) {
        case 'name':
            filteredItems.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredItems.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'cost-asc':
            filteredItems.sort((a, b) => (a.cost || 0) - (b.cost || 0));
            break;
        case 'cost-desc':
            filteredItems.sort((a, b) => (b.cost || 0) - (a.cost || 0));
            break;
        case 'category':
            filteredItems.sort((a, b) => {
                const catCompare = a.category.localeCompare(b.category);
                if (catCompare !== 0) return catCompare;
                return a.name.localeCompare(b.name);
            });
            break;
    }
}

// Reset all filters
function resetFilters() {
    currentFilters = {
        search: '',
        category: '',
        subcategory: '',
        availability: ''
    };
    currentSort = 'name';

    searchInput.value = '';
    categoryFilter.value = '';
    subcategoryFilter.value = '';
    availabilityFilter.value = '';
    sortBySelect.value = 'name';

    populateSubcategoryFilter();
    applyFilters();
}

// Update statistics
function updateStats() {
    itemCountSpan.textContent = `Total Items: ${allItems.length}`;
    filteredCountSpan.textContent = `Showing: ${filteredItems.length}`;
}

// Render items to the grid
function renderItems() {
    if (filteredItems.length === 0) {
        itemsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠</div>
                <div class="empty-state-text">No items found matching your criteria</div>
            </div>
        `;
        return;
    }

    itemsGrid.innerHTML = filteredItems.map(item => createItemCard(item)).join('');

    // Add click and hover listeners to cards
    document.querySelectorAll('.item-card').forEach(card => {
        const itemId = parseInt(card.dataset.itemId);

        // Click to show modal
        card.addEventListener('click', () => {
            showItemDetail(itemId);
        });

        // Hover to show tooltip
        card.addEventListener('mouseenter', (e) => {
            showTooltip(itemId, e);
        });

        card.addEventListener('mousemove', (e) => {
            updateTooltipPosition(e);
        });

        card.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
}

// Create an item card HTML
function createItemCard(item) {
    const stats = getItemStats(item);
    const availabilityClass = item.availability ? `availability-${item.availability}` : '';

    return `
        <div class="item-card" data-item-id="${item.id}">
            ${item.availability ? `<div class="availability-badge ${availabilityClass}">${item.availability}</div>` : ''}

            <div class="item-header">
                <div class="item-name">${item.name}</div>
                <div class="item-category">
                    ${item.category} <span class="item-subcategory">/ ${item.subcategory}</span>
                </div>
            </div>

            <div class="item-body">
                ${stats.length > 0 ? stats.map(stat => `
                    <div class="item-stat">
                        <span class="stat-label">${stat.label}:</span>
                        <span class="stat-value">${stat.value}</span>
                    </div>
                `).join('') : ''}

                <div class="item-description">
                    ${truncateText(item.description, 100)}
                </div>
            </div>

            <div class="item-footer">
                ${item.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                ${item.tags.length > 3 ? `<span class="tag">+${item.tags.length - 3} more</span>` : ''}
            </div>
        </div>
    `;
}

// Get relevant stats for an item
function getItemStats(item) {
    const stats = [];

    if (item.cost !== undefined) {
        stats.push({ label: 'Cost', value: `${item.cost} eb` });
    }
    if (item.damage) {
        stats.push({ label: 'Damage', value: item.damage });
    }
    if (item.sp !== undefined) {
        stats.push({ label: 'SP', value: item.sp });
    }
    if (item.rof !== undefined) {
        stats.push({ label: 'ROF', value: item.rof });
    }
    if (item.humanity_loss) {
        stats.push({ label: 'HL', value: item.humanity_loss });
    }

    return stats;
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Show item detail in modal
function showItemDetail(itemId) {
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;

    const stats = getDetailedStats(item);
    const availabilityClass = item.availability ? `availability-${item.availability}` : '';

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${item.name}</h2>
            <div class="modal-category">
                ${item.category} / ${item.subcategory}
                ${item.availability ? `<span class="availability-badge ${availabilityClass}" style="position: relative; top: 0; right: 0; margin-left: 15px;">${item.availability}</span>` : ''}
            </div>
        </div>

        ${stats.length > 0 ? `
            <div class="modal-stats">
                ${stats.map(stat => `
                    <div class="modal-stat">
                        <div class="modal-stat-label">${stat.label}</div>
                        <div class="modal-stat-value">${stat.value}</div>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        <div class="modal-description">
            ${item.description}
        </div>

        ${item.tags.length > 0 ? `
            <div class="modal-tags">
                ${item.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
            </div>
        ` : ''}
    `;

    itemModal.style.display = 'block';
}

// Get detailed stats for modal
function getDetailedStats(item) {
    const stats = [];

    if (item.cost !== undefined) {
        stats.push({ label: 'Cost', value: `${item.cost} eb` });
    }
    if (item.damage) {
        stats.push({ label: 'Damage', value: item.damage });
    }
    if (item.sp !== undefined) {
        stats.push({ label: 'Stopping Power', value: item.sp });
    }
    if (item.rof !== undefined) {
        stats.push({ label: 'Rate of Fire', value: item.rof });
    }
    if (item.hands !== undefined) {
        stats.push({ label: 'Hands Required', value: item.hands });
    }
    if (item.concealable) {
        stats.push({ label: 'Concealable', value: item.concealable });
    }
    if (item.humanity_loss) {
        stats.push({ label: 'Humanity Loss', value: item.humanity_loss });
    }
    if (item.penalty !== undefined) {
        stats.push({ label: 'Penalty', value: item.penalty === 0 ? 'None' : item.penalty });
    }
    if (item.slot) {
        stats.push({ label: 'Slot', value: item.slot });
    }
    if (item.move !== undefined) {
        stats.push({ label: 'Move', value: item.move });
    }
    if (item.seats !== undefined) {
        stats.push({ label: 'Seats', value: item.seats });
    }
    if (item.quantity !== undefined) {
        stats.push({ label: 'Quantity', value: item.quantity });
    }

    return stats;
}

// Close modal
function closeItemModal() {
    itemModal.style.display = 'none';
}

// Show tooltip on hover
function showTooltip(itemId, event) {
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;

    const stats = getDetailedStats(item);
    const availabilityClass = item.availability ? `availability-${item.availability}` : '';

    hoverTooltip.innerHTML = `
        <div class="tooltip-header">
            <div class="tooltip-name">${item.name}</div>
            <div class="tooltip-category">
                ${item.category} / ${item.subcategory}
                ${item.availability ? `<span class="availability-badge ${availabilityClass}" style="position: relative; top: 0; right: 0; margin-left: 10px; font-size: 0.65rem; padding: 3px 8px;">${item.availability}</span>` : ''}
            </div>
        </div>

        ${stats.length > 0 ? `
            <div class="tooltip-stats">
                ${stats.slice(0, 6).map(stat => `
                    <div class="tooltip-stat">
                        <span class="tooltip-stat-label">${stat.label}:</span>
                        <span class="tooltip-stat-value">${stat.value}</span>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        <div class="tooltip-description">
            ${item.description}
        </div>

        ${item.tags.length > 0 ? `
            <div class="tooltip-tags">
                ${item.tags.slice(0, 5).map(tag => `<span class="tooltip-tag">${tag}</span>`).join('')}
                ${item.tags.length > 5 ? `<span class="tooltip-tag">+${item.tags.length - 5}</span>` : ''}
            </div>
        ` : ''}

        <div class="tooltip-hint">Click for full details</div>
    `;

    hoverTooltip.style.display = 'block';
    updateTooltipPosition(event);
}

// Update tooltip position
function updateTooltipPosition(event) {
    const tooltipRect = hoverTooltip.getBoundingClientRect();
    const margin = 15;

    let x = event.clientX + margin;
    let y = event.clientY + margin;

    // Prevent tooltip from going off-screen right
    if (x + tooltipRect.width > window.innerWidth) {
        x = event.clientX - tooltipRect.width - margin;
    }

    // Prevent tooltip from going off-screen bottom
    if (y + tooltipRect.height > window.innerHeight) {
        y = event.clientY - tooltipRect.height - margin;
    }

    // Ensure tooltip doesn't go off-screen left
    if (x < 0) {
        x = margin;
    }

    // Ensure tooltip doesn't go off-screen top
    if (y < 0) {
        y = margin;
    }

    hoverTooltip.style.left = x + 'px';
    hoverTooltip.style.top = y + 'px';
}

// Hide tooltip
function hideTooltip() {
    hoverTooltip.style.display = 'none';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
