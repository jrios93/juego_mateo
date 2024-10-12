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

const playAudioSequentially = async (letter, audioSrcs) => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  if (!clickCounts[letter]) {
    clickCounts[letter] = 0;
  }

  clickCounts[letter]++;

  let audioToPlay;
  if (clickCounts[letter] % (audioSrcs.length + 1) === 1) {
    // Primer clic o después de un ciclo completo: reproducir solo el primer sonido
    audioToPlay = [audioSrcs[0]];
  } else {
    // Clics subsecuentes: reproducir el resto de los sonidos
    audioToPlay = audioSrcs.slice(1);
  }

  for (const src of audioToPlay) {
    currentAudio = new Audio(src);
    await new Promise((resolve) => {
      currentAudio.onended = resolve;
      currentAudio.play();
    });
  }
};

const displayData = (data) => {
  const containerAbc = document.getElementById("list-abc");
  containerAbc.innerHTML = "";

  Object.keys(data).forEach((letter) => {
    const newDiv = document.createElement("div");
    const titleDynamic = document.createElement("h2");

    const audioSrcs = [data[letter].audio.letra, ...data[letter].audio.nombres];

    newDiv.addEventListener("click", () => {
      playAudioSequentially(letter, audioSrcs);
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

const playAudio = (src) => {
  const audio = new Audio(src);
  audio.play();
};
