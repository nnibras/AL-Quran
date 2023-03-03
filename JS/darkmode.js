let darkModeButton = document.querySelector("#mode-btn");
let bodyElement = document.querySelector("body");

darkModeButton.addEventListener("click", function () {
  bodyElement.classList.toggle("dark-mode");
});
