document.addEventListener("DOMContentLoaded", function () {
  fetch("/json/quotes.json")
    .then((response) => response.json())
    .then((data) => {
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      document.getElementById("sub").innerHTML = randomQuote;

      document.getElementById("hero-description").addEventListener("click", function () {
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        document.getElementById("sub").innerHTML = randomQuote;
      });
    })
    .catch((error) => {
      document.getElementById("sub").innerHTML =
        "idk what happened something broke";
    });
});
