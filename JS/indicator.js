//this section runs the indicator element when surah is loading
audioPlayer.onloadstart = () => {
  audioPlayer.classList.add("animate-bounce");
};

audioPlayer.oncanplaythrough = () => {
  audioPlayer.classList.remove("animate-bounce");
};

audioPlayer.addEventListener("loadedmetadata", function () {
  audioPlayer.classList.remove("animate-bounce");
});
