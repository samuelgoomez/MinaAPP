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

// Crear modal para ver fotos ampliadas (si no existe)
let modal = document.querySelector(".modal-foto");
if (!modal) {
  modal = document.createElement("div");
  modal.classList.add("modal-foto");
  modal.style.display = "none";
  modal.innerHTML = `
    <span class="cerrar-modal">&times;</span>
    <img class="modal-contenido" id="img-ampliada" alt="Foto ampliada">
  `;
  document.body.appendChild(modal);
}

const modalImg = document.getElementById("img-ampliada");
const cerrarModal = modal.querySelector(".cerrar-modal");

// Función para abrir modal con la imagen
function abrirModal(src, alt) {
  modal.style.display = "flex";
  modalImg.src = src;
  modalImg.alt = alt;
}

// Evento de cerrar modal
cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cerrar si se hace clic fuera de la imagen
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

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

        // Evento para abrir modal al hacer click
        img.addEventListener("click", () => {
          abrirModal(img.src, img.alt);
        });

        grid.appendChild(img);
      });
    }

    contenedor.style.display = "flex";

    // Añadir listener solo una vez
    if (!botonVolver.dataset.listener) {
      botonVolver.addEventListener("click", () => {
        window.location.href = "menu.html";
      });
      botonVolver.dataset.listener = "true";
    }

  })
  .catch(err => console.error("Error cargando fotos.json:", err));
