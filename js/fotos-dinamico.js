// Verificar si ya existe el contenedor para no duplicarlo
let contenedor = document.querySelector(".fotos-container");

if (!contenedor) {
  contenedor = document.createElement("div");
  contenedor.classList.add("fotos-container");
  contenedor.style.display = "none";
  contenedor.innerHTML = `
    <h1 id="titulo-fotos"></h1>
    <p id="mensaje-fotos" class="mensaje"></p>
    <div class="fotos-grid" id="fotos-grid"></div>
    <button id="volver-menu" class="btn-volver">Volver al menú</button>
  `;
  document.body.appendChild(contenedor);
}

const grid = document.getElementById("fotos-grid");
const botonVolver = document.getElementById("volver-menu");
const titulo = document.getElementById("titulo-fotos");
const mensaje = document.getElementById("mensaje-fotos");

// Función para obtener parámetro de URL
function getParametro(nombre) {
  const params = new URLSearchParams(window.location.search);
  return params.get(nombre);
}

const categoria = getParametro("categoria") || "todas";

fetch("json/fotos.json")
  .then(res => res.json())
  .then(data => {
    let fotos = [];
    let mensajeBonito = "";

    if (categoria === "todas") {
      fotos = data.todas;
      mensajeBonito = "Estas son todas nuestras fotos, cada recuerdo guardado en un instante.";
      titulo.textContent = "Todas nuestras fotos";
    } else if (data[categoria]) {
      fotos = data[categoria].fotos || [];
      mensajeBonito = `Estas son nuestras fotos de ${categoria}, cada momento especial capturado en imágenes.`;
      titulo.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    } else {
      mensajeBonito = "No hay fotos para esta categoría.";
      titulo.textContent = "Fotos";
    }

    mensaje.textContent = mensajeBonito;

    // Limpiar grid antes de añadir fotos
    grid.innerHTML = "";

    if (fotos.length === 0) {
      const msg = document.createElement("p");
      msg.textContent = "Todavía no hay fotos en esta categoría.";
      msg.classList.add("no-fotos");
      grid.appendChild(msg);
    } else {
      fotos.forEach(f => {
        const img = document.createElement("img");
        if (categoria === "todas") {
          img.src = f;
        } else {
          img.src = data[categoria].folder + f;
        }
        img.alt = categoria;
        grid.appendChild(img);
      });
    }

    contenedor.style.display = "flex";

    // Añadir listener solo una vez
    if (!botonVolver.dataset.listener) {
      botonVolver.addEventListener("click", () => {
        window.location.href = "index.html";
      });
      botonVolver.dataset.listener = "true";
    }

  })
  .catch(err => console.error("Error cargando fotos.json:", err));
