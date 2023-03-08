// function to handle the orientation change event
function handleOrientationChange() {
  // Check the current orientation of the screen
  if (
    (window.orientation === -90 || window.orientation === 90) &&
    screen.width <= 915
  ) {
    // landscape
    document.getElementById("content").classList.add("hidden");
    document.getElementById("footer").classList.add("hidden");
    document.getElementById("audio-div").classList.add("hidden");
    document.getElementById("audio-section").classList.add("border-0");
    // console.log("ls");
  } else {
    // landscape
    document.getElementById("content").classList.remove("hidden");
    document.getElementById("footer").classList.remove("hidden");
    document.getElementById("audio-div").classList.remove("hidden");
    document.getElementById("audio-section").classList.remove("border-0");
    // console.log("pt");
  }
}

// event listener for the orientation change event
window.addEventListener("orientationchange", handleOrientationChange);
