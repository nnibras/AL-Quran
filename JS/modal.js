const modalBtn = document.getElementById("modal-btn");
const escBtn = document.getElementById("esc-btn");
const openModal = document.querySelector(".modal-open");
const closeModal = document.querySelector(".modal-close");
const modal = document.getElementById("modal-id");

// adds the maximize button when it hits the header
window.addEventListener("scroll", function () {
  let scrollTop = window.scrollY;

  if (scrollTop >= 278) {
    modalBtn.classList.remove("hidden");
  } else {
    modalBtn.classList.add("hidden");
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
