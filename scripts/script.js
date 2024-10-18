const jsonUrl = "../assets/data/data.json";
let currentAudio = null;
let clickCounts = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

const fetchData = async () => {
  try {
    const response = await fetch(jsonUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Datos cargados", data);
    displayData(data);
  } catch (error) {
    console.error("Error en cargar la data", error);
  }
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const playNextAudio = (letter, audioSrcs) => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  if (!clickCounts[letter]) {
    clickCounts[letter] = 0;
  }

  const currentIndex = clickCounts[letter] % audioSrcs.length;
  const nextAudioSrc = audioSrcs[currentIndex];

  currentAudio = new Audio(nextAudioSrc);
  currentAudio.play();

  clickCounts[letter]++;
};

const displayData = (data) => {
  const containerAbc = document.getElementById("list-abc");
  containerAbc.innerHTML = "";

  Object.keys(data).forEach((letter) => {
    const newDiv = document.createElement("div");
    const titleDynamic = document.createElement("h2");

    const audioSrcs = [data[letter].audio.letra, ...data[letter].audio.nombres];

    newDiv.addEventListener("click", () => {
      playNextAudio(letter, audioSrcs);
    });

    titleDynamic.innerText = `${letter}`;

    newDiv.classList.add("grid-items");
    titleDynamic.classList.add("title-dynamic");

    newDiv.style.backgroundColor = getRandomColor();
    titleDynamic.style.color = getRandomColor();

    newDiv.innerHTML = `
      <img src="${data[letter].imagen}" alt="${letter}" width="100" />
    `;
    newDiv.appendChild(titleDynamic);
    containerAbc.appendChild(newDiv);
  });
};

// Esta función ya no se usa, pero la mantenemos por si se necesita en el futuro
const playAudio = (src) => {
  const audio = new Audio(src);
  audio.play();
};
