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
    })
    .catch((error) => {
      console.log(error);
      alert("error 404 not found!");
    });
}

function setAyahSajdaCount(url) {
  languageList.value = "Arabic";
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
    })
    .catch((error) => {
      console.log(error);
      alert("error 404 not found!");
    });
}
