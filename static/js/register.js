/**
 * Display an error message in the error display box above the form card.
 * @param {string} message - The text message to display.
 */
function showError(message) {
    const errorBox = document.getElementById("error-box");
    if (!errorBox) {
        console.warn("Error box (#error-box) element not found in DOM.");
        return;
    }
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

/**
 * Clear and hide the error display box.
 */
function clearError() {
    const errorBox = document.getElementById("error-box");
    if (errorBox) {
        errorBox.textContent = "";
        errorBox.classList.add("hidden");
    }
}

// Aliases for developer convenience
const displayError = showError;
const addErrorMessage = showError;
const hideError = clearError;
