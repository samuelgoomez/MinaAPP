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

// Cargar JSON
fetch("json/fotos.json")
  .then(res => res.json())
  .then(data => {
    const pueblos = data.pueblos;

    // Convertimos las cards en botones dinámicos
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
      const key = card.dataset.pueblo;
      if(pueblos[key]){
        card.addEventListener("click", e => {
          e.preventDefault();
          mostrarPueblo(pueblos[key]);
        });
      }
    });

    // Función para mostrar un pueblo
    function mostrarPueblo(lugar){
      document.querySelector(".menu-container").style.display = "none";
      nombre.textContent = lugar.nombre;
      descripcion.textContent = lugar.descripcion || "";
      grid.innerHTML = "";

      if (lugar.fotos.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No hay fotos todavía";
        msg.classList.add("no-fotos");
        grid.appendChild(msg);
      } else {
        lugar.fotos.forEach(f => {
          const img = document.createElement("img");
          img.src = lugar.folder + f;
          img.alt = lugar.nombre;
          grid.appendChild(img);
        });
      }

      contenedor.style.display = "block";
      contenedor.scrollIntoView({behavior: "smooth"});
    }

    // Botón para volver al menú
    botonVolver.addEventListener("click", () => {
      contenedor.style.display = "none";
      document.querySelector(".menu-container").style.display = "block";
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  })
  .catch(err => console.error("Error cargando fotos.json:", err));
