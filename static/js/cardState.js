/**
 * Card state management, visual syncing, and menu dismissals
 */

/**
 * Synchronize card visual icons and menu checkboxes with dataset state.
 * @param {HTMLElement} card - The .book-card element.
 */
export function syncCardVisuals(card) {
    const isBookmarked = card.dataset.bookmarked === "true";
    const isRead = card.dataset.read === "true";

    // Sync bookmark icon
    const bookmarkDiv = card.querySelector(".book-mark");
    if (bookmarkDiv) {
        bookmarkDiv.innerHTML = isBookmarked
            ? '<i class="fa-solid fa-bookmark" style="color: var(--primary);"></i>'
            : '<i class="fa-regular fa-bookmark"></i>';
    }

    // Sync read icon
    const readDiv = card.querySelector(".read-mark");
    if (readDiv) {
        readDiv.innerHTML = isRead
            ? '<i class="fa-solid fa-book-open-reader" style="color: var(--primary);"></i>'
            : '<i class="fa-solid fa-book-open"></i>';
    }

    // Sync menu checkboxes
    const bookmarkCheckbox = card.querySelector(".card-opt-bookmark");
    if (bookmarkCheckbox) {
        bookmarkCheckbox.checked = isBookmarked;
    }

    const readCheckbox = card.querySelector(".card-opt-read");
    if (readCheckbox) {
        readCheckbox.checked = isRead;
    }
}

/**
 * Update card bookmark state and refresh visuals.
 * @param {HTMLElement} card
 * @param {boolean} val
 */
export function setBookmark(card, val) {
    card.dataset.bookmarked = String(val);
    syncCardVisuals(card);
}

/**
 * Update card read state and refresh visuals.
 * @param {HTMLElement} card
 * @param {boolean} val
 */
export function setRead(card, val) {
    card.dataset.read = String(val);
    syncCardVisuals(card);
}

/**
 * Close all open card dropdown menus, optionally excluding one.
 * @param {HTMLElement|null} exceptMenu
 */
export function closeAllCardMenus(exceptMenu = null) {
    document.querySelectorAll(".card-options-menu").forEach((menu) => {
        if (menu !== exceptMenu) {
            menu.classList.add("hidden");
        }
    });
}
