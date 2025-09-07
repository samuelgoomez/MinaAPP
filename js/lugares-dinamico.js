// Crear contenedor de fotos dinámico
const contenedor = document.createElement("div");
contenedor.classList.add("fotos-container");
contenedor.style.display = "none";
contenedor.innerHTML = `
  <h1 id="nombre-pueblo"></h1>
  <p id="descripcion-pueblo"></p>
  <div class="fotos-grid" id="fotos-grid"></div>
  <button id="volver-menu" class="btn-volver">Volver al menú</button>
`;
document.body.appendChild(contenedor);

const nombre = document.getElementById("nombre-pueblo");
const descripcion = document.getElementById("descripcion-pueblo");
const grid = document.getElementById("fotos-grid");
const botonVolver = document.getElementById("volver-menu");

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

// Variables para carrusel
let fotosActuales = [];
let indiceFoto = 0;

// Función para abrir modal con la imagen
function abrirModal(index) {
  indiceFoto = index;
  modal.style.display = "flex";
  modalImg.src = fotosActuales[indiceFoto];
  modalImg.alt = "Foto ampliada";
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

// Navegar con flechas del teclado
document.addEventListener("keydown", (e) => {
  if (modal.style.display === "flex") {
    if (e.key === "ArrowRight") {
      indiceFoto = (indiceFoto + 1) % fotosActuales.length;
      modalImg.src = fotosActuales[indiceFoto];
    } else if (e.key === "ArrowLeft") {
      indiceFoto = (indiceFoto - 1 + fotosActuales.length) % fotosActuales.length;
      modalImg.src = fotosActuales[indiceFoto];
    } else if (e.key === "Escape") {
      modal.style.display = "none";
    }
  }
});

// Cargar JSON
fetch("json/fotos.json")
  .then(res => res.json())
  .then(data => {
    const pueblos = data.pueblos;

    // Convertimos las cards en botones dinámicos
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
      const key = card.dataset.pueblo;
      if (pueblos[key]) {
        card.addEventListener("click", e => {
          e.preventDefault();
          mostrarPueblo(pueblos[key]);
        });
      }
    });

    // Función para mostrar un pueblo
    function mostrarPueblo(lugar) {
      document.querySelector(".menu-container").style.display = "none";
      nombre.textContent = lugar.nombre;
      descripcion.textContent = lugar.descripcion || "";
      grid.innerHTML = "";
      fotosActuales = []; // reiniciamos

      if (lugar.fotos.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No hay fotos todavía";
        msg.classList.add("no-fotos");
        grid.appendChild(msg);
      } else {
        lugar.fotos.forEach((f, index) => {
          const img = document.createElement("img");
          img.src = lugar.folder + f;
          img.alt = lugar.nombre;
          fotosActuales.push(img.src);

          // Evento para abrir modal al hacer click
          img.addEventListener("click", () => {
            abrirModal(index);
          });

          grid.appendChild(img);
        });
      }

      contenedor.style.display = "block";
      contenedor.scrollIntoView({ behavior: "smooth" });
    }

    // Botón para volver al menú
    botonVolver.addEventListener("click", () => {
      contenedor.style.display = "none";
      document.querySelector(".menu-container").style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

  })
  .catch(err => console.error("Error cargando fotos.json:", err));
