function loadSurah(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const surahs = data.data;
      surahs.forEach((surah) => {
        const option = document.createElement("option");
        option.value = surah.number;
        option.text = `${surah.number}. ${surah.englishName} (${surah.englishNameTranslation})`;
        surahList.appendChild(option);
      });

      surahs.forEach((surah) => {
        const option = document.createElement("option");
        option.value = surah.number;
        option.text = `${surah.number}. ${surah.englishName} (${surah.englishNameTranslation})`;
        surahListModal.appendChild(option);
      });
    })
    .catch((error) => {
      console.log(error);
      alert("error 404 not found!");
    });
}

function setAyahSajdaCount(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const surah = data.data;
      const ayahCount = surah.ayahs.length;
      const sujudCount = surah.ayahs.filter((ayah) => ayah.sajda).length;

      surahInfo.innerHTML = `
			       
			        <p class="text-sm font-bold sm:text-lg">Number of ayahs: ${ayahCount}</p>
			        <p class="text-sm font-bold sm:text-lg">Number of sujud: ${sujudCount}</p>
			      
			      `;

      surahSpan.innerText = ` ${surah.englishName} `;
      document.title = `Quran | ${surah.englishName}`;
    })
    .catch((error) => {
      console.log(error);
      alert("error 404 not found!");
    });
}

function loadAyahList(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const ayahs = data.data.ayahs;
      ayahList.innerHTML = ""; // Clear previous options
      const option = document.createElement("option");
      option.text = ``;
      ayahList.appendChild(option);
      ayahs.forEach((ayah) => {
        const option = document.createElement("option");
        option.value = ayah.numberInSurah;
        option.text = `${ayah.numberInSurah}`;
        ayahList.appendChild(option);
      });
    })
    .catch((error) => {
      console.log(error);
      alert("error 404 not found!");
      console.error(error);
    });
}

function loadAyahListModal(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const ayahs = data.data.ayahs;
      ayahListModal.innerHTML = ""; // Clear previous options
      const option = document.createElement("option");
      option.text = ``;
      ayahListModal.appendChild(option);
      ayahs.forEach((ayah) => {
        const option = document.createElement("option");
        option.value = ayah.numberInSurah;
        option.text = `${ayah.numberInSurah}`;
        ayahListModal.appendChild(option);
      });
    })
    .catch((error) => {
      console.log(error);
      alert("error 404 not found!");
      console.error(error);
    });
}

function setMainQuranPage(url, chooser = 0) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const surah = data.data;
      let surahHTML = "";
      surah[chooser].ayahs.forEach((ayah) => {
        if (surah[0].ayahs[ayah.numberInSurah - 1].sajda == false) {
          surahHTML += `
        <h1 class="text-xl   font-extrabold">${ayah.numberInSurah}</h1> 
        <p id="ayah-${ayah.numberInSurah}" class="text-center mt-2 mb-4 font-bold">${ayah.text}</p>
        `;
        } else {
          surahHTML += `
        
        <h1 class="text-xl   font-extrabold">${ayah.numberInSurah}</h1> 
        <h1 class="text-sm   font-extrabold">* SAJDA *</h1>  
        <p "ayah-${ayah.numberInSurah}" class="text-center mt-2 mb-4 font-bold">${ayah.text}</p>
        `;
        }
      });
      quran.innerHTML = surahHTML;
      language.classList.remove("animate-bounce");
      languageListModal.classList.remove("animate-bounce");

      surahList.classList.remove("animate-bounce");
      surahListModal.classList.remove("animate-bounce");
    })
    .catch((error) => {
      console.log(error);
      alert("error 404 not found!");
    });
}

function chooser() {
  const selectElement = document.getElementById("language");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const selectedText = selectedOption.textContent;
  let chooser = -1;
  if (selectedText == "English Transliteration") chooser = 1;
  else if (selectedText == "English") chooser = 2;
  else if (selectedText == "Bengali") chooser = 3;
  else if (selectedText == "Albanian") chooser = 4;
  else if (selectedText == "Azerbaijani") chooser = 5;
  else if (selectedText == "Bosnian") chooser = 6;
  else if (selectedText == "Bulgarian") chooser = 7;
  else if (selectedText == "Chinese") chooser = 8;
  else if (selectedText == "Czech") chooser = 9;
  else if (selectedText == "Dutch") chooser = 10;
  else if (selectedText == "Farsi") chooser = 11;
  else if (selectedText == "French") chooser = 12;
  else if (selectedText == "German") chooser = 13;
  else if (selectedText == "Hindi") chooser = 14;
  else if (selectedText == "Indonesian") chooser = 15;
  else if (selectedText == "Italian") chooser = 16;
  else if (selectedText == "Japanese") chooser = 17;
  else if (selectedText == "Korean") chooser = 18;
  else if (selectedText == "Malay") chooser = 19;
  else if (selectedText == "Norwegian") chooser = 20;
  else if (selectedText == "Polish") chooser = 21;
  else if (selectedText == "Portuguese") chooser = 22;
  else if (selectedText == "Romanian") chooser = 23;
  else if (selectedText == "Russian") chooser = 24;
  else if (selectedText == "Spanish") chooser = 25;
  else if (selectedText == "Swedish") chooser = 26;
  else if (selectedText == "Turkish") chooser = 27;
  else if (selectedText == "Urdu") chooser = 28;
  else chooser = 0;

  return chooser;
}

function chooserModal() {
  const selectElement = document.getElementById("language-modal");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const selectedText = selectedOption.textContent;
  let chooser = -1;
  if (selectedText == "English Transliteration") chooser = 1;
  else if (selectedText == "English") chooser = 2;
  else if (selectedText == "Bengali") chooser = 3;
  else if (selectedText == "Albanian") chooser = 4;
  else if (selectedText == "Azerbaijani") chooser = 5;
  else if (selectedText == "Bosnian") chooser = 6;
  else if (selectedText == "Bulgarian") chooser = 7;
  else if (selectedText == "Chinese") chooser = 8;
  else if (selectedText == "Czech") chooser = 9;
  else if (selectedText == "Dutch") chooser = 10;
  else if (selectedText == "Farsi") chooser = 11;
  else if (selectedText == "French") chooser = 12;
  else if (selectedText == "German") chooser = 13;
  else if (selectedText == "Hindi") chooser = 14;
  else if (selectedText == "Indonesian") chooser = 15;
  else if (selectedText == "Italian") chooser = 16;
  else if (selectedText == "Japanese") chooser = 17;
  else if (selectedText == "Korean") chooser = 18;
  else if (selectedText == "Malay") chooser = 19;
  else if (selectedText == "Norwegian") chooser = 20;
  else if (selectedText == "Polish") chooser = 21;
  else if (selectedText == "Portuguese") chooser = 22;
  else if (selectedText == "Romanian") chooser = 23;
  else if (selectedText == "Russian") chooser = 24;
  else if (selectedText == "Spanish") chooser = 25;
  else if (selectedText == "Swedish") chooser = 26;
  else if (selectedText == "Turkish") chooser = 27;
  else if (selectedText == "Urdu") chooser = 28;
  else chooser = 0;

  return chooser;
}
