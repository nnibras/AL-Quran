// variables & constants
const surahList = document.getElementById("surah-list");
const surahListModal = document.getElementById("surah-list-modal");
const surahInfo = document.getElementById("surah-info");
const languageList = document.getElementById("language");
const languageListModal = document.getElementById("language-modal");
const audioPlayer = document.getElementById("audio-player");
const surahSpan = document.getElementById("surah-name");
const ayahList = document.getElementById("ayahs-container");
const ayahListModal = document.getElementById("ayahs-container-modal");
const ping = document.getElementById("ping");

// when loading screen, load surah
window.addEventListener("load", () => {
  const url = "https://api.alquran.cloud/v1/surah";
  loadSurah(url);
});

//when loading set ayah and sajda count for first surah
window.addEventListener("load", () => {
  const url = `https://api.alquran.cloud/v1/surah/1`;
  setAyahSajdaCount(url);
});

//when loading load ayah list based on surah
window.addEventListener("load", () => {
  const url = `https://api.alquran.cloud/v1/surah/1`;
  loadAyahList(url);
  ayahList.selectedIndex = 0;
  loadAyahListModal(url);
});

//on loading set the main quran page
window.addEventListener("load", () => {
  const url = `https://api.alquran.cloud/v1/surah/1/editions/quran-simple,en.sahih,bn.bengali`;

  setMainQuranPage(url);
  // Set the retrieved URL as the src attribute of the audio element
  audioPlayer.src = `https://github.com/Treposting/Surah-API/blob/main/Surah/1.mp3?raw=true`;
});

//when surah changes load ayah list based on surah
surahList.addEventListener("change", () => {
  const surahNumber = surahList.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}`;
  loadAyahList(url);
  surahListModal.selectedIndex = surahNumber - 1;
  loadAyahListModal(url);
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
    ayahList.selectedIndex = 0;
  } else {
    ayahElement2.scrollIntoView({ behavior: "smooth" });
    ayahList.selectedIndex = 0;
  }
});

ayahListModal.addEventListener("change", () => {
  const ayahNumber = document.getElementById("ayahs-container-modal").value;
  const ayahElement = document.getElementById(`ayah-${ayahNumber - 3}`);
  const ayahElement2 = document.getElementById(`ayah-${ayahNumber}`);
  const surahNumber = surahListModal.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}`;

  if (ayahElement || ayahNumber > 3) {
    ayahElement.scrollIntoView({ behavior: "smooth" });
    ayahListModal.selectedIndex = 0;
  } else {
    ayahElement2.scrollIntoView({ behavior: "smooth" });
    ayahListModal.selectedIndex = 0;
  }

  closeTheModal();
});

//when surah changed, set ayah and sajda count for the selected surah
surahList.addEventListener("change", () => {
  languageList.selectedIndex = 0;
  const surahNumber = surahList.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}`;
  setAyahSajdaCount(url);

  // Set the retrieved URL as the src attribute of the audio element
  audioPlayer.src = `https://github.com/Treposting/Surah-API/blob/main/Surah/${surahNumber}.mp3?raw=true`;
});

surahListModal.addEventListener("change", () => {
  languageListModal.selectedIndex = 0;
  languageList.selectedIndex = 0;
  const surahNumber = surahListModal.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}`;
  setAyahSajdaCount(url);

  // Set the retrieved URL as the src attribute of the audio element
  audioPlayer.src = `https://github.com/Treposting/Surah-API/blob/main/Surah/${surahNumber}.mp3?raw=true`;

  surahList.selectedIndex = surahNumber - 1;
  loadAyahListModal(url);
  loadAyahList(url);
});

// when surah is changed set the main quran page for that surah
surahList.addEventListener("change", () => {
  surahList.classList.add("animate-bounce");
  const surahNumber = surahList.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,en.sahih,bn.bengali`;

  setMainQuranPage(url);
  // Set the retrieved URL as the src attribute of the audio element
  audioPlayer.src = `https://github.com/Treposting/Surah-API/blob/main/Surah/${surahNumber}.mp3?raw=true`;
});

surahListModal.addEventListener("change", () => {
  surahListModal.classList.add("animate-bounce");
  const surahNumber = surahListModal.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,en.sahih,bn.bengali`;

  setMainQuranPage(url);
  // Set the retrieved URL as the src attribute of the audio element
  audioPlayer.src = `https://github.com/Treposting/Surah-API/blob/main/Surah/${surahNumber}.mp3?raw=true`;
});

//when language is selected, based on the selection the quran main page is updated.
languageList.addEventListener("change", () => {
  language.classList.add("animate-bounce");
  const surahNumber = surahList.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,en.transliteration,en.sahih,bn.bengali,sq.ahmeti,az.mammadaliyev,bs.mlivo,bg.theophanov,zh.jian,cs.hrbek,nl.keyzer,fa.ayati,fr.hamidullah,de.aburida,hi.farooq,id.indonesian,it.piccardo,ja.japanese,ko.korean,ms.basmeih,no.berg,pl.bielawskiego,pt.elhayek,ro.grigore,ru.kuliev,es.asad,sv.bernstrom,tr.ates,ur.ahmedali`;

  const choice = chooser();
  setMainQuranPage(url, choice);
  languageListModal.selectedIndex = choice;
});

languageListModal.addEventListener("change", () => {
  languageListModal.classList.add("animate-bounce");
  const surahNumber = surahListModal.value;
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,en.transliteration,en.sahih,bn.bengali,sq.ahmeti,az.mammadaliyev,bs.mlivo,bg.theophanov,zh.jian,cs.hrbek,nl.keyzer,fa.ayati,fr.hamidullah,de.aburida,hi.farooq,id.indonesian,it.piccardo,ja.japanese,ko.korean,ms.basmeih,no.berg,pl.bielawskiego,pt.elhayek,ro.grigore,ru.kuliev,es.asad,sv.bernstrom,tr.ates,ur.ahmedali`;

  const choice = chooserModal();
  setMainQuranPage(url, choice);
  languageList.selectedIndex = choice;
});
