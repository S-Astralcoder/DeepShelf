/**
 * Status Dashboard tab switching logic
 */
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll("#book-options li");
    const sections = document.querySelectorAll("#option-contents > section");

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
});
