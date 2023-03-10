const modalBtn = document.getElementById("modal-btn");
const escBtn = document.getElementById("esc-btn");
const openModal = document.querySelector(".modal-open");
const closeModal = document.querySelector(".modal-close");
const modal = document.getElementById("modal-id");
const headerDiv = document.getElementById("content");
const footerDiv = document.getElementById("footer");

// adds the maximize button when it hits the header
window.addEventListener("scroll", function () {
  let scrollTop = window.scrollY;

  if (scrollTop >= 278) {
    modalBtn.classList.remove("hidden");
    headerDiv.classList.remove("py-5");
    headerDiv.classList.add("py-2");
    headerDiv.classList.remove("mb-5");
    headerDiv.classList.add("mb-0");
    footerDiv.classList.add("hidden");
  } else {
    modalBtn.classList.add("hidden");
    headerDiv.classList.add("py-5");
    headerDiv.classList.remove("py-2");
    footerDiv.classList.remove("hidden");
  }
});

function openTheModal() {
  modal.classList.add("active");
}

function closeTheModal() {
  modal.classList.remove("active");
}

// close modal
escBtn.addEventListener("click", function () {
  closeTheModal();
});

// show modal
modalBtn.addEventListener("click", function () {
  openTheModal();
});
