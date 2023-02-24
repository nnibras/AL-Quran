const surahList = document.getElementById("surah-list");
const surahInfo = document.getElementById("surah-info");
const languageList = document.getElementById("language");

// load surah
fetch("https://api.alquran.cloud/v1/surah")
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
  .catch((error) => console.log(error));

//   when loading set ayah for first surah
window.addEventListener("load", () => {
  languageList.value = "Arabic";
  fetch(`https://api.alquran.cloud/v1/surah/1/editions/quran-simple,en.sahih`)
    .then((response) => response.json())
    .then((data) => {
      const surah = data.data[0];
      const ayahCount = surah.ayahs.length;
      const sujudCount = surah.ayahs.filter((ayah) => ayah.sajda).length;

      surahInfo.innerHTML = `
			       
			        <p class="text-sm">Number of ayahs: ${ayahCount}</p>
			        <p class="text-sm">Number of sujud: ${sujudCount}</p>
			      
			      `;

      const ayahs = surah.ayahs;
      const ayahText = ayahs.map((ayah) => ayah.text).join("<br>");
      document.getElementById("ayah-list").innerHTML = ayahText;
    })
    .catch((error) => console.log(error));
});

//on change update surah list
surahList.addEventListener("change", () => {
  languageList.value = "Arabic";
  const surahNumber = surahList.value;
  fetch(
    `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,en.sahih`
  )
    .then((response) => response.json())
    .then((data) => {
      const surah = data.data[0];
      const ayahCount = surah.ayahs.length;
      const sujudCount = surah.ayahs.filter((ayah) => ayah.sajda).length;

      surahInfo.innerHTML = `
			       
			        <p class="text-sm">Number of ayahs: ${ayahCount}</p>
			        <p class="text-sm">Number of sujud: ${sujudCount}</p>
            
			      
			      `;

      const ayahs = surah.ayahs;
      const ayahText = ayahs.map((ayah) => ayah.text).join("<br>");
      document.getElementById("ayah-list").innerHTML = ayahText;
    })
    .catch((error) => console.log(error));
});

//
window.addEventListener("load", () => {
  fetch(
    `https://api.alquran.cloud/v1/surah/1/editions/quran-simple,en.sahih,bn.bengali`
  )
    .then((response) => response.json())
    .then((data) => {
      const surah = data.data;
      console.log(surah);

      let surahHTML = "";
      surah[0].ayahs.forEach((ayah) => {
        if (surah[0].ayahs[ayah.numberInSurah - 1].sajda == false) {
          surahHTML += `
        <h1 class="text-xl   font-extrabold">${ayah.numberInSurah}</h1> 
        <p class="text-center mt-2 mb-4 font-bold">${ayah.text}</p>
        `;
        } else {
          surahHTML += `
        
        <h1 class="text-xl   font-extrabold">${ayah.numberInSurah}</h1> 
        <h1 class="text-xl   font-extrabold">[Sajda]</h1>  
        <p class="text-center mt-2 mb-4 font-bold">${ayah.text}</p>
        `;
        }
      });
      quran.innerHTML = surahHTML;
    })
    .catch((error) => console.log(error));
});

//
surahList.addEventListener("change", () => {
  const surahNumber = surahList.value;

  // // // const selectElement = document.getElementById("language");
  // // // const selectedOption = selectElement.options[selectElement.selectedIndex];
  // // // const selectedText = selectedOption.textContent;
  // // console.log(selectedText);
  // let chooser = -1;
  // if (selectedText == "English") chooser = 1;
  // else if (selectedText == "Bengali") chooser = 2;
  // else chooser = 0;
  fetch(
    `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,en.sahih,bn.bengali`
  )
    .then((response) => response.json())
    .then((data) => {
      const surah = data.data;

      let surahHTML = "";
      surah[0].ayahs.forEach((ayah) => {
        if (surah[0].ayahs[ayah.numberInSurah - 1].sajda == false) {
          surahHTML += `
        <h1 class="text-xl   font-extrabold">${ayah.numberInSurah}</h1> 
        <p class="text-center mt-2 mb-4 font-bold">${ayah.text}</p>
        `;
        } else {
          surahHTML += `
           
        <h1 class="text-xl   font-extrabold">${ayah.numberInSurah}</h1> 
              <h1 class="text-xl   font-extrabold">[Sajda]</h1> 
        <p class="text-center mt-2 mb-4 font-bold">${ayah.text}</p>
        `;
        }
      });
      quran.innerHTML = surahHTML;
    })
    .catch((error) => console.log(error));
});

//
languageList.addEventListener("change", () => {
  const surahNumber = surahList.value;

  const selectElement = document.getElementById("language");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const selectedText = selectedOption.textContent;
  console.log(selectedText);
  let chooser = -1;
  if (selectedText == "English") chooser = 1;
  else if (selectedText == "Bengali") chooser = 2;
  else chooser = 0;
  fetch(
    `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple,en.sahih,bn.bengali`
  )
    .then((response) => response.json())
    .then((data) => {
      const surah = data.data;

      let surahHTML = "";
      surah[chooser].ayahs.forEach((ayah) => {
        if (surah[0].ayahs[ayah.numberInSurah - 1].sajda == false) {
          surahHTML += `
        <h1 class="text-xl   font-extrabold">${ayah.numberInSurah}</h1> 
        <p class="text-center mt-2 mb-4 font-bold">${ayah.text}</p>
        `;
        } else {
          surahHTML += `
           
        <h1 class="text-xl   font-extrabold">${ayah.numberInSurah}</h1> 
              <h1 class="text-xl   font-extrabold">[Sajda]</h1> 
        <p class="text-center mt-2 mb-4 font-bold">${ayah.text}</p>
        `;
        }
      });
      quran.innerHTML = surahHTML;
    })
    .catch((error) => console.log(error));
});
