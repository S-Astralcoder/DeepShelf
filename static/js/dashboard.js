/**
 * Main dashboard coordinator module
 */
import { closeAllCardMenus } from "./cardState.js";
import { setupCardEvents } from "./cardEvents.js";
import { addBookCard, clearCards } from "./cardManager.js";
import { initFilterMenu } from "./filter.js";

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

    // ----------------------------------------------------------------------
    // Outside Click Handling
    // ----------------------------------------------------------------------
    document.addEventListener("click", (event) => {
        if (filterMenu && !filterMenu.contains(event.target) && !filterBtn?.contains(event.target)) {
            filterMenu.classList.add("hidden");
            filterBtn?.classList.remove("active");
        }

        if (!event.target.closest(".card-options")) {
            closeAllCardMenus();
        }
    });

    // ----------------------------------------------------------------------
    // Pre-rendered Cards Initialization
    // ----------------------------------------------------------------------
    document.querySelectorAll(".book-card").forEach((card) => {
        setupCardEvents(card, filterMenu);
    });

    // ----------------------------------------------------------------------
    // Filter & Sorting Initialization
    // ----------------------------------------------------------------------
    initFilterMenu(filterBtn, filterMenu, filterOptions, contentBox);

    // ----------------------------------------------------------------------
    // Add Book Form Handling
    // ----------------------------------------------------------------------
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

    if (addBookBtn) {
        addBookBtn.addEventListener("click", () => {
            const rawUrl = bookUrlInput ? bookUrlInput.value.trim() : "";
            const { title, description } = parseBookUrl(rawUrl);

            addBookCard(contentBox, template, {
                uuid: "",
                title,
                description,
                tags: ["Web", "Reading"],
                read: false,
                bookmarked: false
            }, filterMenu);

            if (bookUrlInput) bookUrlInput.value = "";
        });
    }

    // ----------------------------------------------------------------------
    // Global API Exposure
    // ----------------------------------------------------------------------
    window.addBookCard = (bookData) => addBookCard(contentBox, template, bookData, filterMenu);
    window.clearCards = () => clearCards(contentBox);
});
