const surahList = document.getElementById("surah-list");
const surahInfo = document.getElementById("surah-info");
const languageList = document.getElementById("language");
const audioPlayer = document.getElementById("audio-player");
const surahSpan = document.getElementById("surah-name");
const ayahList = document.getElementById("ayahs-container");

// load surah
loadSurah("https://api.alquran.cloud/v1/surah");

//when loading set ayah and sajda count for first surah
window.addEventListener("load", () => {
  const url = `https://api.alquran.cloud/v1/surah/1`;
  setAyahSajdaCount(url);
});

//when loading load ayah list based on surah
window.addEventListener("load", () => {
  const url = `https://api.alquran.cloud/v1/surah/1`;
  loadAyahList(url);
});

//when surah changes load ayah list based on surah
surahList.addEventListener("change", () => {
  const surahNumber = surahList.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}`;
  loadAyahList(url);
});

//when ayah is selected, take the user to that ayah
ayahList.addEventListener("change", () => {
  const ayahNumber = document.getElementById("ayahs-container").value;
  const ayahElement = document.getElementById(`ayah-${ayahNumber - 3}`);
  const ayahElement2 = document.getElementById(`ayah-${ayahNumber}`);
  const surahNumber = surahList.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}`;

  if (ayahElement || ayahNumber > 3) {
    ayahElement.scrollIntoView({ behavior: "smooth" });
    loadAyahList(url);
  } else {
    ayahElement2.scrollIntoView({ behavior: "smooth" });
    loadAyahList(url);
  }
});

//when surah changed, set ayah and sajda count for the selected surah
surahList.addEventListener("change", () => {
  languageList.value = "Arabic";
  const surahNumber = surahList.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}`;
  setAyahSajdaCount(url);

  // Set the retrieved URL as the src attribute of the audio element
  audioPlayer.src = `https://github.com/Treposting/Surah-API/blob/main/Surah/${surahNumber}.mp3?raw=true`;
});

//on loading set the main quran page
window.addEventListener("load", () => {
  const url = `https://api.alquran.cloud/v1/surah/1/editions/quran-simple,en.sahih,bn.bengali`;

  setMainQuranPage(url);
  // Set the retrieved URL as the src attribute of the audio element
  audioPlayer.src = `https://github.com/Treposting/Surah-API/blob/main/Surah/1.mp3?raw=true`;
});

// when surah is changed set the main quran page for that surah
surahList.addEventListener("change", () => {
  const surahNumber = surahList.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,en.sahih,bn.bengali`;

  setMainQuranPage(url);
  // Set the retrieved URL as the src attribute of the audio element
  audioPlayer.src = `https://github.com/Treposting/Surah-API/blob/main/Surah/${surahNumber}.mp3?raw=true`;
});

//
languageList.addEventListener("change", () => {
  const surahNumber = surahList.value;
  const selectElement = document.getElementById("language");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const selectedText = selectedOption.textContent;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,en.sahih,bn.bengali`;
  let chooser = -1;
  if (selectedText == "English") chooser = 1;
  else if (selectedText == "Bengali") chooser = 2;
  else chooser = 0;

  setMainQuranPage(url, chooser);
});

//spinner for loading
if (
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
  /FBAN/i.test(navigator.userAgent) ||
  /Instagram/i.test(navigator.userAgent) ||
  /discord/i.test(navigator.userAgent) ||
  /LinkedIn/.test(navigator.userAgent)
) {
  audioPlayer.addEventListener("loadedmetadata", () => {
    audioPlayer.classList.remove("animate-bounce");
  });
} else {
  // Add  indicator element
  audioPlayer.onloadstart = () => {
    // audioPlayer.classList.add("animate-bounce");
    audioPlayer.classList.add("animate-bounce");
  };

  audioPlayer.oncanplaythrough = () => {
    audioPlayer.classList.remove("animate-bounce");
  };
}
