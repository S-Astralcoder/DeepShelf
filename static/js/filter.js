/**
 * Filter dropdown handling and card sorting logic
 */
import { closeAllCardMenus } from "./cardState.js";

/**
 * Sort book cards in the container by given criterion.
 * @param {HTMLElement} contentBox
 * @param {string} type - "a-z", "z-a", "latest", "oldest"
 */
export function sortCards(contentBox, type) {
    if (!contentBox) return;
    const cards = Array.from(contentBox.querySelectorAll(".book-card"));
    if (!cards.length) return;

    if (type === "a-z") {
        cards.sort((a, b) => {
            const titleA = (a.dataset.title || a.querySelector(".title")?.textContent || "").trim().toLowerCase();
            const titleB = (b.dataset.title || b.querySelector(".title")?.textContent || "").trim().toLowerCase();
            return titleA.localeCompare(titleB);
        });
    } else if (type === "z-a") {
        cards.sort((a, b) => {
            const titleA = (a.dataset.title || a.querySelector(".title")?.textContent || "").trim().toLowerCase();
            const titleB = (b.dataset.title || b.querySelector(".title")?.textContent || "").trim().toLowerCase();
            return titleB.localeCompare(titleA);
        });
    } else if (type === "oldest") {
        cards.reverse();
    }

    cards.forEach((card) => contentBox.appendChild(card));
}

/**
 * Initialize filter dropdown toggle and option selection.
 * @param {HTMLElement|null} filterBtn
 * @param {HTMLElement|null} filterMenu
 * @param {NodeListOf<HTMLElement>|Array<HTMLElement>} filterOptions
 * @param {HTMLElement|null} contentBox
 */
export function initFilterMenu(filterBtn, filterMenu, filterOptions, contentBox) {
    if (!filterBtn || !filterMenu) return;

    filterBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        closeAllCardMenus();
        filterMenu.classList.toggle("hidden");
        filterBtn.classList.toggle("active");
    });

    filterOptions.forEach((option) => {
        option.addEventListener("click", () => {
            filterOptions.forEach((opt) => opt.classList.remove("selected"));
            option.classList.add("selected");

            filterMenu.classList.add("hidden");
            filterBtn.classList.remove("active");

            sortCards(contentBox, option.dataset.sort);
        });
    });
}
