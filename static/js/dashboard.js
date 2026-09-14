/**
 * ==========================================================================
 * Dashboard Controller Module
 * ==========================================================================
 * Organized into focused modules for clean separation of concerns:
 *   1. Card Visuals & State Sync
 *   2. Card Events & Interactions
 *   3. Card CRUD Operations (addBookCard, clearCards)
 *   4. Filter & Sorting Handling
 *   5. Add Book Form Handling
 *   6. Initialization & Global Exports
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------------
    // DOM Elements Cache
    // ----------------------------------------------------------------------
    const contentBox = document.getElementById("content-box");
    const template = document.getElementById("book-card-template");
    const filterBtn = document.getElementById("filter-btn");
    const filterMenu = document.getElementById("filter-menu");
    const filterOptions = document.querySelectorAll("#filter-options li");
    const addBookBtn = document.querySelector("#control-btn button");
    const bookUrlInput = document.getElementById("book-url-input");

    // ======================================================================
    // 1. Card Visuals & State Sync
    // ======================================================================

    /**
     * Synchronize card visual icons and menu checkboxes with dataset state.
     * @param {HTMLElement} card - The .book-card element.
     */
    function syncCardVisuals(card) {
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
    function setBookmark(card, val) {
        card.dataset.bookmarked = String(val);
        syncCardVisuals(card);
    }

    /**
     * Update card read state and refresh visuals.
     * @param {HTMLElement} card
     * @param {boolean} val
     */
    function setRead(card, val) {
        card.dataset.read = String(val);
        syncCardVisuals(card);
    }

    /**
     * Close all open card dropdown menus, optionally excluding one.
     * @param {HTMLElement|null} exceptMenu
     */
    function closeAllCardMenus(exceptMenu = null) {
        document.querySelectorAll(".card-options-menu").forEach((menu) => {
            if (menu !== exceptMenu) {
                menu.classList.add("hidden");
            }
        });
    }

    // ======================================================================
    // 2. Card Events & Interactions
    // ======================================================================

    /**
     * Bind all event listeners to a book card (dropdown, checkboxes, icons, delete).
     * @param {HTMLElement} card
     */
    function setupCardEvents(card) {
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

    // ======================================================================
    // 3. Card CRUD Operations
    // ======================================================================

    /**
     * Create a fresh card DOM element from template or fallback HTML.
     * @returns {HTMLElement}
     */
    function createCardElement() {
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
     * Dynamically add a new book card to #content-box.
     * @param {Object} bookData - { uuid, title, description, tags, read, bookmarked }
     * @returns {HTMLElement|null} The created card element.
     */
    function addBookCard(bookData = {}) {
        if (!contentBox) return null;

        const card = createCardElement();
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

        // Attach event handlers and insert card at the top
        setupCardEvents(card);
        contentBox.prepend(card);
        return card;
    }

    /**
     * Clear all book cards from #content-box.
     */
    function clearCards() {
        if (!contentBox) return;
        contentBox.innerHTML = "";
    }

    // ======================================================================
    // 4. Filter & Sorting Handling
    // ======================================================================

    /**
     * Sort book cards in #content-box by given criterion.
     * @param {string} type - "a-z", "z-a", "latest", "oldest"
     */
    function sortCards(type) {
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
     */
    function initFilterMenu() {
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

                sortCards(option.dataset.sort);
            });
        });
    }

    // ======================================================================
    // 5. Add Book Form Handling
    // ======================================================================

    /**
     * Derive a clean book title and description from a user-entered URL.
     * @param {string} rawUrl
     * @returns {{ title: string, description: string }}
     */
    function parseBookUrl(rawUrl) {
        let title = "New Book";
        let description = "Added from library collection.";

        if (!rawUrl) return { title, description };

        try {
            const parsed = new URL(rawUrl);
            const pathSegments = parsed.pathname.split("/").filter(Boolean);
            if (pathSegments.length > 0) {
                title = decodeURIComponent(pathSegments[pathSegments.length - 1]).replace(/[-_]/g, " ");
                title = title.charAt(0).toUpperCase() + title.slice(1);
            } else {
                title = parsed.hostname;
            }
            description = `Resource from ${parsed.hostname}`;
        } catch {
            title = rawUrl;
        }

        return { title, description };
    }

    /**
     * Initialize the control-bar "Add Book" button and input listeners.
     */
    function initAddBookControl() {
        if (!addBookBtn) return;

        addBookBtn.addEventListener("click", () => {
            const rawUrl = bookUrlInput ? bookUrlInput.value.trim() : "";
            const { title, description } = parseBookUrl(rawUrl);

            addBookCard({
                uuid: "",
                title,
                description,
                tags: ["Web", "Reading"],
                read: false,
                bookmarked: false
            });

            if (bookUrlInput) bookUrlInput.value = "";
        });
    }

    // ======================================================================
    // 6. Initialization & Global Exports
    // ======================================================================

    // Dismiss open menus when clicking outside
    document.addEventListener("click", (event) => {
        if (filterMenu && !filterMenu.contains(event.target) && !filterBtn?.contains(event.target)) {
            filterMenu.classList.add("hidden");
            filterBtn?.classList.remove("active");
        }

        if (!event.target.closest(".card-options")) {
            closeAllCardMenus();
        }
    });

    // Bind event handlers to all pre-rendered cards
    document.querySelectorAll(".book-card").forEach((card) => {
        setupCardEvents(card);
    });

    // Initialize UI controls
    initFilterMenu();
    initAddBookControl();

    // Export helpers globally
    window.addBookCard = addBookCard;
    window.clearCards = clearCards;
});
