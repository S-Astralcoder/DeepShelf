/**
 * Card DOM creation, dynamic addition (addBookCard), and clearing (clearCards)
 */
import { setupCardEvents } from "./cardEvents.js";

/**
 * Create a fresh card DOM element from template or fallback HTML.
 * @param {HTMLTemplateElement|null} template
 * @returns {HTMLElement}
 */
export function createCardElement(template = null) {
    if (template && template.content) {
        const clone = template.content.cloneNode(true);
        return clone.querySelector(".book-card");
    }

    const fallback = document.createElement("section");
    fallback.className = "book-card";
    fallback.innerHTML = `
        <div class="upper">
            <div class="book-info">
                <p class="title"></p>
                <p class="description"></p>
            </div>
            <div class="card-options">
                <button type="button" class="card-options-btn" title="Card Options">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>
                <div class="card-options-menu hidden">
                    <label class="card-opt-item">
                        <input type="checkbox" class="card-opt-bookmark">
                        <span>Bookmark</span>
                    </label>
                    <label class="card-opt-item">
                        <input type="checkbox" class="card-opt-read">
                        <span>Read</span>
                    </label>
                    <button type="button" class="card-opt-delete">
                        <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
                </div>
            </div>
        </div>
        <div class="lower">
            <ul class="tags"></ul>
            <div class="mark-options">
                <div class="book-mark"><i class="fa-regular fa-bookmark"></i></div>
                <div class="read-mark"><i class="fa-solid fa-book-open"></i></div>
            </div>
        </div>
    `;
    return fallback;
}

/**
 * Dynamically add a new book card to the container.
 * @param {HTMLElement} contentBox - Target container.
 * @param {HTMLTemplateElement|null} template - Template element.
 * @param {Object} bookData - { uuid, title, description, tags, read, bookmarked }
 * @param {HTMLElement|null} filterMenu - Optional filter menu reference.
 * @returns {HTMLElement|null} The created card element.
 */
export function addBookCard(contentBox, template, bookData = {}, filterMenu = null) {
    if (!contentBox) return null;

    const card = createCardElement(template);
    const uuid = bookData.uuid || "";
    const title = bookData.title || "Untitled Book";
    const description = bookData.description || "No description provided.";
    const tags = Array.isArray(bookData.tags) ? bookData.tags : (bookData.tags ? [bookData.tags] : ["General"]);
    const read = Boolean(bookData.read);
    const bookmarked = Boolean(bookData.bookmarked);

    // Assign dataset attributes
    card.removeAttribute("id");
    card.dataset.uuid = uuid;
    card.dataset.title = title;
    card.dataset.read = String(read);
    card.dataset.bookmarked = String(bookmarked);

    // Populate card content
    const titleEl = card.querySelector(".title");
    if (titleEl) titleEl.textContent = title;

    const descEl = card.querySelector(".description");
    if (descEl) descEl.textContent = description;

    const tagsUl = card.querySelector(".tags");
    if (tagsUl) {
        tagsUl.innerHTML = "";
        tags.forEach((tagText) => {
            const li = document.createElement("li");
            li.textContent = tagText;
            tagsUl.appendChild(li);
        });
    }

    // Attach event handlers and insert card at top
    setupCardEvents(card, filterMenu);
    contentBox.prepend(card);
    return card;
}

/**
 * Clear all book cards from the container.
 * @param {HTMLElement} contentBox
 */
export function clearCards(contentBox) {
    if (!contentBox) return;
    contentBox.innerHTML = "";
}
