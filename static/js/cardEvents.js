/**
 * Card event bindings (dropdown menu, bookmark/read toggles, delete action)
 */
import { syncCardVisuals, setBookmark, setRead, closeAllCardMenus } from "./cardState.js";

/**
 * Bind all event listeners to a book card.
 * @param {HTMLElement} card
 * @param {HTMLElement|null} filterMenu
 */
export function setupCardEvents(card, filterMenu = null) {
    const optionsBtn = card.querySelector(".card-options-btn");
    const optionsMenu = card.querySelector(".card-options-menu");
    const bookmarkCheckbox = card.querySelector(".card-opt-bookmark");
    const readCheckbox = card.querySelector(".card-opt-read");
    const deleteBtn = card.querySelector(".card-opt-delete");
    const bookMarkIcon = card.querySelector(".book-mark");
    const readMarkIcon = card.querySelector(".read-mark");

    // Options dropdown toggle
    if (optionsBtn && optionsMenu) {
        optionsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (filterMenu) filterMenu.classList.add("hidden");
            const willOpen = optionsMenu.classList.contains("hidden");
            closeAllCardMenus(willOpen ? optionsMenu : null);
            optionsMenu.classList.toggle("hidden", !willOpen);
        });

        optionsMenu.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    // Bookmark checkbox toggle
    if (bookmarkCheckbox) {
        bookmarkCheckbox.addEventListener("change", () => {
            setBookmark(card, bookmarkCheckbox.checked);
        });
    }

    // Read checkbox toggle
    if (readCheckbox) {
        readCheckbox.addEventListener("change", () => {
            setRead(card, readCheckbox.checked);
        });
    }

    // Delete card button
    if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            card.remove();
        });
    }

    // Direct bookmark icon toggle
    if (bookMarkIcon) {
        bookMarkIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            const current = card.dataset.bookmarked === "true";
            setBookmark(card, !current);
        });
    }

    // Direct read icon toggle
    if (readMarkIcon) {
        readMarkIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            const current = card.dataset.read === "true";
            setRead(card, !current);
        });
    }

    // Initial icon & checkbox synchronization
    syncCardVisuals(card);
}
