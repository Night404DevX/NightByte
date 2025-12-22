function OpenSavedFrame(url, id) {
    let frame = document.querySelector(".pages#"+id);
    document.querySelector(`.pages[data-shown="true"]`).setAttribute("data-shown", "false");
    if (frame == null) {
        frame = document.createElement("iframe");
        frame.className = "pages";
        frame.id = id;
        frame.src = url;
        frame.setAttribute("data-shown", "true");
        document.body.appendChild(frame);
    } else {
        frame.setAttribute("data-shown", "true");
    }
}

function initNavbar() {
    const navbar = document.querySelector(".nav");
    const navitems = navbar.querySelectorAll(".nav-links");
    const frame = document.querySelector(".pages");

    navitems.forEach(navitem => {
        navitem.addEventListener("click", e => {
            if (navitem.getAttribute("data-href") != null) {
                if (navbar.querySelector("#page")) navbar.querySelector("#page").id = "";
                navitem.id = "page";
                localStorage.setItem("savedPage", navitem.getAttribute("data-href"));
                let r = new URL(localStorage.getItem("savedPage"), location.origin).pathname.split(".html")[0];
                r = r.substring(1, r.length);
                OpenSavedFrame(localStorage.getItem("savedPage"), r);
            } else if (navitem.getAttribute("data-popup") != null) {
                window.open(navitem.getAttribute("data-popup"), "_blank");
            }
        })
    })

    navbar.querySelector(".logo").addEventListener("click", e => {
        if (navbar.querySelector("#page")) navbar.querySelector("#page").id = "";
        document.querySelector(`.navitem[data-href="/index.html"]`).id = "page";
        localStorage.setItem("savedPage", "/index.html");
        OpenSavedFrame("/index.html", "index");
        document.querySelectorAll(".pages:not(#index)").forEach(e => e.remove());
    });
}

addEventListener("DOMContentLoaded", () => {
    initNavbar();
    if (localStorage.getItem("savedPage") == null) localStorage.setItem("savedPage", "/index.html");
    document.querySelector(`.navitem[data-href="${localStorage.getItem("savedPage")}"]`).id = "page";
    document.querySelector(".pages").src = localStorage.getItem("savedPage");
})
