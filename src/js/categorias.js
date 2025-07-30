const formCategoria = document.getElementById('formCategoria'); //form ID
const inputNombre = document.getElementById('nombreCategoria'); // Input ID
const listaCategorias = document.getElementById('listaCategorias'); // list ID

const API_URL = "http://localhost:3000/categories";
const API_MOVIMIENTOS = "http://localhost:3000/movimientos";

let categoriaEditando = null; //Variable that saves ID of the  category that is editing. 

document.addEventListener('DOMContentLoaded', cargarCategorias); //Cuando se carga el documento HTML, se ejecuta la función cargarCategorias()

async function cargarCategorias() { 
  listaCategorias.innerHTML = "";  //Limpia la lista primero

  try {
    const response = await fetch(API_URL);  //carry categories
    const categorias = await response.json();
     // carry categories in edit , add and delete button
    categorias.forEach(categoria => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${categoria.nombre}</span>
        <div>
          <button class="btn-agregar" data-id="${categoria.id}" data-nombre="${categoria.nombre}">Agregar</button>  //add 
          <button class="btn-editar" data-id="${categoria.id}" data-nombre="${categoria.nombre}">Editar</button>    //edit
          <button class="btn-eliminar" data-id="${categoria.id}" data-nombre="${categoria.nombre}">Eliminar</button> 
        </div>                                                                                                    //delete
      `;
      listaCategorias.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar las categorías", error);
  }
}


formCategoria.addEventListener('submit', async (event) => {
  event.preventDefault();  //Avoid the form recharge the page

  const nombre = inputNombre.value.trim();
  if (!nombre) return alert('El nombre no puede estar vacío');

  try {
    if (categoriaEditando) {
      // Update categorie
      await fetch(`${API_URL}/${categoriaEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      });
      categoriaEditando = null;
      document.getElementById('btn-submit').textContent = "Guardar"; // button restaure
    } else {
      // create new categorie
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      });
    }

    formCategoria.reset();  // clean the input
    cargarCategorias();      // show an update list 

  } catch (error) {
    console.error('Error al guardar categoría', error);
  }
});

listaCategorias.addEventListener('click', async (event) => {
  const boton = event.target;

  // Edit 
  if (boton.classList.contains('btn-editar')) {
    const id = boton.dataset.id;
    const nombre = boton.dataset.nombre;

    inputNombre.value = nombre;
    categoriaEditando = id;
    document.getElementById('btn-submit').textContent = "Actualizar";
  }

  // Delete 
  if (boton.classList.contains('btn-eliminar')) {
    const id = boton.dataset.id;
    const nombreCategoria = boton.dataset.nombre;

    const confirmar = confirm(`¿Eliminar la categoría "${nombreCategoria}" y sus movimientos asociados?`);
    if (!confirmar) return;

    try {
      // Get movements
      const resMov = await fetch(API_MOVIMIENTOS);
      const movimientos = await resMov.json();

      // Filter related
      const asociados = movimientos.filter(movimiento => movimiento.categoria === nombreCategoria);

      // Delete every movement
      for (const mov of asociados) {
        await fetch(`${API_MOVIMIENTOS}/${mov.id}`, { method: "DELETE" });
      }

      // Delete Categorie
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      cargarCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría y movimientos", error);
    }
  }
});