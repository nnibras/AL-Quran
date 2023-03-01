//this section runs the indicator element when surah is loading
audioPlayer.onloadstart = () => {
  audioPlayer.classList.add("animate-pulse");
};

audioPlayer.oncanplaythrough = () => {
  audioPlayer.classList.remove("animate-pulse");
};

audioPlayer.addEventListener("loadedmetadata", function () {
  audioPlayer.classList.remove("animate-pulse");
});
