/**
 * Dashboard interactivity & filter dropdown handling
 */
document.addEventListener("DOMContentLoaded", () => {
    const filterBtn = document.getElementById("filter-btn");
    const filterMenu = document.getElementById("filter-menu");
    const filterOptions = document.querySelectorAll("#filter-options li");

    if (filterBtn && filterMenu) {
        // Toggle dropdown when clicking filter button
        filterBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            filterMenu.classList.toggle("hidden");
            filterBtn.classList.toggle("active");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (event) => {
            if (!filterMenu.contains(event.target) && !filterBtn.contains(event.target)) {
                filterMenu.classList.add("hidden");
                filterBtn.classList.remove("active");
            }
        });

        // Option selection & sorting
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
     * Sort book cards in #content-box
     * @param {string} type - "a-z", "z-a", "latest", "oldest"
     */
    function sortCards(type) {
        const contentBox = document.getElementById("content-box");
        if (!contentBox) return;

        const cards = Array.from(contentBox.querySelectorAll(".book-card"));
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

        cards.forEach((card) => contentBox.appendChild(card));
    }
});
