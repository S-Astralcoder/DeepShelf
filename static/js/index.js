function redirect_login() {
    let get_started_btn1 = document.querySelector("#start-btn")
    let get_started_btn2 = document.querySelector("#nav-start-btn")
    if (get_started_btn1 instanceof HTMLButtonElement && get_started_btn2 instanceof HTMLButtonElement) {
        get_started_btn1.addEventListener("click", () => {
            window.location.href = "signup.html"
        })
        get_started_btn2.addEventListener("click", () => {
            window.location.href = "signup.html"
        })
    }
}

redirect_login()