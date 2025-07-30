const apiMovimientos = "http://localhost:3000/movimientos"; // API for movements 
const apiCategorias = "http://localhost:3000/categories";    // API for categories

// Connect the HTML with JS by ids
const formMovimiento = document.getElementById("formMovimientos");
const selecTipo = document.getElementById("selectTipo");
const inputDescripcion = document.getElementById("descripcion");
const inputImporte = document.getElementById("importe");
const inputFecha = document.getElementById("fecha");
const selectCategoria = document.getElementById("categoria");
const listaMovimientos = document.getElementById("listaMovimientos");

// Global varaible in null state 
let idEditando = null;

// Cuando the page recharged show all the categories and movements
document.addEventListener("DOMContentLoaded", () => {
  cargarCategorias(); //call function
  cargarMovimientos(); //call function
});

// recharge categories and add into the tag <select>
async function cargarCategorias() {
  const response = await fetch(apiCategorias);
  const categorias = await response.json();

  // Clean previous categories
  selectCategoria.innerHTML = '<option value="">Selecciona una categoría</option>';

  categorias.forEach(categoria => {
    const opcion = document.createElement("option");
    opcion.value = categoria.nombre;
    opcion.textContent = categoria.nombre;
    selectCategoria.appendChild(opcion);
  });
}

// Event to save a movement
formMovimiento.addEventListener("submit", async function (event) {
  event.preventDefault();

  const tipo = selecTipo.value;
  const descripcion = inputDescripcion.value.trim();
  const importe = parseFloat(inputImporte.value);
  const fecha = inputFecha.value;
  const categoria = selectCategoria.value;

  // Validations to descript,import,date and category 
  if (descripcion === "") return alert("La descripción no puede estar vacía.");
  if (isNaN(importe) || importe <= 0) return alert("El importe debe ser mayor a 0.");
  if (fecha === "") return alert("Debes seleccionar una fecha.");
  if (categoria === "") return alert("Debes elegir una categoría.");
  //an objet that save a new movement 
  const nuevoMovimiento = {
    tipo,
    descripcion,
    importe,
    fecha,
    categoria
  };
    //verify by try and catch possible mistakes 
  try {
    if (idEditando) {
      // Edited by method (PUT)
      await fetch(`${apiMovimientos}/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoMovimiento)
      });
      idEditando = null; // Clean edit state
    } else {
      // Create new by method (POST)
      await fetch(apiMovimientos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoMovimiento)
      });
    }

    formMovimiento.reset();  // Clean form
    cargarMovimientos();     // recharge a list 
  } catch (error) {
    console.error("Error al guardar movimiento:", error);
  }
});

// show all the saved movements
async function cargarMovimientos() {
  const response = await fetch(apiMovimientos);
  const movimientos = await response.json();

  listaMovimientos.innerHTML = ""; // Clean the previous list 

  movimientos.forEach(movimiento => {  // Method ForEach to walk every movement 
    const li = document.createElement("li"); //Create a list into the HTML document
    li.innerHTML = `  
      ${movimiento.tipo}: ${movimiento.descripcion} | $${movimiento.importe} | ${movimiento.fecha} | Categoría: ${movimiento.categoria}
      <button class="btn-editar" data-id="${movimiento.id}">Modificar</button>
      <button class="btn-eliminar" data-id="${movimiento.id}">Eliminar</button>
      <button class="btn-agregar" data-id="${movimiento.id}">Agregar</button>
    `;
    listaMovimientos.appendChild(li);

    // Edit Button 
    li.querySelector(".btn-editar").addEventListener("click", () => {
      selecTipo.value = movimiento.tipo;
      inputDescripcion.value = movimiento.descripcion;
      inputImporte.value = movimiento.importe;
      inputFecha.value = movimiento.fecha;
      selectCategoria.value = movimiento.categoria;
      idEditando = movimiento.id; // Guardar el id a editar
    });

    // Delete Button
    li.querySelector(".btn-eliminar").addEventListener("click", async () => {
      if (confirm("¿Estás seguro de eliminar este movimiento?")) {
        await fetch(`${apiMovimientos}/${movimiento.id}`, {
          method: "DELETE"
        });
        cargarMovimientos();
      }
    });
  });
}