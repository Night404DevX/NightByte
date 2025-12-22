document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("page-container");

  // Load default page
  loadPage("home.html");

  window.loadPage = function (page) {
    fetch(page)
      .then(res => {
        if (!res.ok) throw new Error("Page not found");
        return res.text();
      })
      .then(html => {
        container.innerHTML = html;
      })
      .catch(() => {
        container.innerHTML = "<h2>Page failed to load</h2>";
      });
  };
});
