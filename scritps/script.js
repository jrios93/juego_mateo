const jsonUrl = "../assets/data/data.json";
let currentAudio = null;

// Agregar el event listener para cargar los datos cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  fetchData(); // Llamar a fetchData aquí para cargar los datos al cargar la página
});

const fetchData = async () => {
  try {
    const response = await fetch(jsonUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`); // Cambiar 'error' a 'new Error'
    }

    const data = await response.json();
    console.log("Datos cargados", data);
    displayData(data); // Mover displayData aquí para asegurarte de que data está definida
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

const playAudioSequentially = async (audioSrcs) => {
  if (currentAudio) {
    currentAudio.pause(); // Detiene el audio actual si está reproduciéndose
    currentAudio.currentTime = 0; // Reinicia el tiempo del audio
  }

  for (const src of audioSrcs) {
    currentAudio = new Audio(src);
    await new Promise((resolve) => {
      currentAudio.onended = resolve; // Espera a que el audio termine
      currentAudio.play(); // Reproduce el audio
    });
  }
};

const displayData = (data) => {
  const containerAbc = document.getElementById("list-abc");
  containerAbc.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos datos

  // Iterar sobre las letras del abecedario
  Object.keys(data).map((letter) => {
    const newDiv = document.createElement("div");
    const titleDynamic = document.createElement("h2");

    const audioSrc = data[letter].audio.letra; // Obtén el audio de la letra
    const audioSrcs = data[letter].audio.nombres; // Obtén el audio de la letra

    // Al hacer clic en el div, reproducir el audio
    newDiv.addEventListener("click", () => {
      playAudioSequentially([audioSrc, ...audioSrcs]);
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

// Función para reproducir el audio
const playAudio = (src) => {
  const audio = new Audio(src);
  audio.play();
};
