let darkModeButton = document.querySelector("#mode-btn");
let darkModeButtonModal = document.querySelector("#mode-btn-modal");
let bodyElement = document.querySelector("body");

darkModeButton.addEventListener("click", function () {
  bodyElement.classList.toggle("dark-mode");
});

darkModeButtonModal.addEventListener("click", function () {
  bodyElement.classList.toggle("dark-mode");
});
