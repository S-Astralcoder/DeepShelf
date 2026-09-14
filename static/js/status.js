/**
 * Status Dashboard tab switching & filter dropdown logic
 */
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll("#book-options li");
    const sections = document.querySelectorAll("#option-contents > section");
    const filterBtn = document.getElementById("filter-btn");
    const filterMenu = document.getElementById("filter-menu");
    const filterOptions = document.querySelectorAll("#filter-options li");

    // Tab switching
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const targetId = tab.dataset.target || (
                tab.textContent.trim().toLowerCase() === "read"
                    ? "read-contents"
                    : tab.textContent.trim().toLowerCase() === "unread"
                    ? "unread-contents"
                    : "book-marked-contents"
            );

            // Toggle tab active indicator
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            // Toggle content visibility
            sections.forEach((section) => {
                if (section.id === targetId) {
                    section.classList.add("active");
                } else {
                    section.classList.remove("active");
                }
            });
        });
    });

    // Filter dropdown toggle & sort handling
    if (filterBtn && filterMenu) {
        filterBtn.addEventListener("click", (event) => {
            event.stopPropagation();
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
                sortActiveCards(sortType);
            });
        });
    }

    /**
     * Sort book cards inside the currently active status tab
     * @param {string} type - "a-z", "z-a", "latest", "oldest"
     */
    function sortActiveCards(type) {
        const activeSection = document.querySelector("#option-contents > section.active");
        if (!activeSection) return;

        const cards = Array.from(activeSection.querySelectorAll(".book-card"));
        if (!cards.length) return;

        if (type === "a-z") {
            cards.sort((a, b) => {
                const titleA = (a.querySelector(".title")?.textContent || "").trim().toLowerCase();
                const titleB = (b.querySelector(".title")?.textContent || "").trim().toLowerCase();
                return titleA.localeCompare(titleB);
            });
        } else if (type === "z-a") {
            cards.sort((a, b) => {
                const titleA = (a.querySelector(".title")?.textContent || "").trim().toLowerCase();
                const titleB = (b.querySelector(".title")?.textContent || "").trim().toLowerCase();
                return titleB.localeCompare(titleA);
            });
        } else if (type === "oldest") {
            cards.reverse();
        }

        cards.forEach((card) => activeSection.appendChild(card));
    }
});
