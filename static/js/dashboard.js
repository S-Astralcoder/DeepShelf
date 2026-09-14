/**
 * Dashboard interactivity, card actions, options menu, and filter handling
 */
document.addEventListener("DOMContentLoaded", () => {
    const filterBtn = document.getElementById("filter-btn");
    const filterMenu = document.getElementById("filter-menu");
    const filterOptions = document.querySelectorAll("#filter-options li");
    const contentBox = document.getElementById("content-box");
    const template = document.getElementById("book-card-template");
    const addBookBtn = document.querySelector("#control-btn button");
    const bookUrlInput = document.getElementById("book-url-input");

    // Filter dropdown toggle
    if (filterBtn && filterMenu) {
        filterBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            closeAllCardMenus();
            filterMenu.classList.toggle("hidden");
            filterBtn.classList.toggle("active");
        });

        document.addEventListener("click", (event) => {
            if (!filterMenu.contains(event.target) && !filterBtn.contains(event.target)) {
                filterMenu.classList.add("hidden");
                filterBtn.classList.remove("active");
            }
        });

        filterOptions.forEach((option) => {
            option.addEventListener("click", () => {
                filterOptions.forEach((opt) => opt.classList.remove("selected"));
                option.classList.add("selected");

                filterMenu.classList.add("hidden");
                filterBtn.classList.remove("active");

                const sortType = option.dataset.sort;
                sortCards(sortType);
            });
        });
    }

    /**
     * Close all open card options menus
     */
    function closeAllCardMenus(exceptMenu = null) {
        document.querySelectorAll(".card-options-menu").forEach((menu) => {
            if (menu !== exceptMenu) {
                menu.classList.add("hidden");
            }
        });
    }

    // Close card menus on outside click
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".card-options")) {
            closeAllCardMenus();
        }
    });

    /**
     * Update card visual icons to match data attributes
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

        // Sync checkboxes in menu
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
     * Set bookmark state on a card
     */
    function setBookmark(card, val) {
        card.dataset.bookmarked = String(val);
        syncCardVisuals(card);
    }

    /**
     * Set read state on a card
     */
    function setRead(card, val) {
        card.dataset.read = String(val);
        syncCardVisuals(card);
    }

    /**
     * Bind events to a single book card
     */
    function setupCardEvents(card) {
        const optionsBtn = card.querySelector(".card-options-btn");
        const optionsMenu = card.querySelector(".card-options-menu");
        const bookmarkCheckbox = card.querySelector(".card-opt-bookmark");
        const readCheckbox = card.querySelector(".card-opt-read");
        const deleteBtn = card.querySelector(".card-opt-delete");
        const bookMarkIcon = card.querySelector(".book-mark");
        const readMarkIcon = card.querySelector(".read-mark");

        // Toggle card options menu
        if (optionsBtn && optionsMenu) {
            optionsBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (filterMenu) filterMenu.classList.add("hidden");
                const willOpen = optionsMenu.classList.contains("hidden");
                closeAllCardMenus(willOpen ? optionsMenu : null);
                if (willOpen) {
                    optionsMenu.classList.remove("hidden");
                } else {
                    optionsMenu.classList.add("hidden");
                }
            });

            optionsMenu.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        }

        // Checkbox: Bookmark
        if (bookmarkCheckbox) {
            bookmarkCheckbox.addEventListener("change", () => {
                setBookmark(card, bookmarkCheckbox.checked);
            });
        }

        // Checkbox: Read
        if (readCheckbox) {
            readCheckbox.addEventListener("change", () => {
                setRead(card, readCheckbox.checked);
            });
        }

        // Delete card
        if (deleteBtn) {
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                card.remove();
            });
        }

        // Direct icon click: Bookmark toggle
        if (bookMarkIcon) {
            bookMarkIcon.addEventListener("click", (e) => {
                e.stopPropagation();
                const current = card.dataset.bookmarked === "true";
                setBookmark(card, !current);
            });
        }

        // Direct icon click: Read toggle
        if (readMarkIcon) {
            readMarkIcon.addEventListener("click", (e) => {
                e.stopPropagation();
                const current = card.dataset.read === "true";
                setRead(card, !current);
            });
        }

        // Initial visual sync
        syncCardVisuals(card);
    }

    // Attach event listeners to all pre-rendered cards
    document.querySelectorAll(".book-card").forEach((card) => {
        setupCardEvents(card);
    });

    /**
     * Generate standard UUID v4
     */
    function generateUUID() {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * Dynamically add a new book card to #content-box
     * @param {Object} bookData - { uuid, id, title, description, tags, read, bookmarked }
     * @returns {HTMLElement} The created card element
     */
    function addBookCard(bookData = {}) {
        if (!contentBox) return null;

        const uuid = bookData.uuid || generateUUID();
        const id = bookData.id || uuid;
        const title = bookData.title || "Untitled Book";
        const description = bookData.description || "No description provided.";
        const tags = Array.isArray(bookData.tags) ? bookData.tags : (bookData.tags ? [bookData.tags] : ["General"]);
        const read = Boolean(bookData.read);
        const bookmarked = Boolean(bookData.bookmarked);

        let card;
        if (template && template.content) {
            const clone = template.content.cloneNode(true);
            card = clone.querySelector(".book-card");
        } else {
            card = document.createElement("section");
            card.className = "book-card";
            card.innerHTML = `
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
        }

        // Populate dataset
        card.removeAttribute("id");
        card.dataset.uuid = uuid;
        card.dataset.id = id;
        card.dataset.title = title;
        card.dataset.read = String(read);
        card.dataset.bookmarked = String(bookmarked);

        // Populate content
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

        // Setup events and insert at the top of contentBox
        setupCardEvents(card);
        contentBox.prepend(card);
        return card;
    }

    /**
     * Clear all book cards from #content-box
     */
    function clearCards() {
        if (!contentBox) return;
        contentBox.innerHTML = "";
    }

    // Connect middle bar "Add Book" button
    if (addBookBtn) {
        addBookBtn.addEventListener("click", () => {
            const rawUrl = bookUrlInput ? bookUrlInput.value.trim() : "";
            let derivedTitle = "New Book";
            let derivedDesc = "Added from library collection.";

            if (rawUrl) {
                try {
                    const parsed = new URL(rawUrl);
                    const pathSegments = parsed.pathname.split("/").filter(Boolean);
                    if (pathSegments.length > 0) {
                        derivedTitle = decodeURIComponent(pathSegments[pathSegments.length - 1]).replace(/[-_]/g, " ");
                        derivedTitle = derivedTitle.charAt(0).toUpperCase() + derivedTitle.slice(1);
                    } else {
                        derivedTitle = parsed.hostname;
                    }
                    derivedDesc = `Resource from ${parsed.hostname}`;
                } catch {
                    derivedTitle = rawUrl;
                }
            }

            addBookCard({
                title: derivedTitle,
                description: derivedDesc,
                tags: ["Web", "Reading"],
                read: false,
                bookmarked: false
            });

            if (bookUrlInput) bookUrlInput.value = "";
        });
    }

    /**
     * Sort book cards in #content-box
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

    // Expose helpers globally
    window.addBookCard = addBookCard;
    window.clearCards = clearCards;
});
