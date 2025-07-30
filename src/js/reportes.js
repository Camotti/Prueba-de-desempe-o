const apiMovimientos = "http://localhost:3000/movimientos"; 

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(apiMovimientos);
    const movimientos = await response.json();

    const tabla = document.getElementById("tablaReportes");

    movimientos.forEach(movimiento => {  //for each walk to every individual movement
      const fila = document.createElement("tr"); //create a new tr
      fila.innerHTML = ` 
        <td>${movimiento.tipo}</td>
        <td>${movimiento.descripcion}</td>
        <td>${movimiento.importe}</td>
        <td>${movimiento.fecha}</td>
        <td>${movimiento.categoria}</td>
      `;
      tabla.appendChild(fila); //add a new file 
    });

    // Categories with more sales and buys
    const conteoCategorias = {}; //empty object 
    movimientos.forEach(movimiento => {
      const categoria = movimiento.categoria;
      const tipo = movimiento.tipo;
      if (!conteoCategorias[categoria]) {
        conteoCategorias[categoria] = { compra: 0, venta: 0 }; 
      }
      conteoCategorias[categoria][tipo]++; //add 1
    });

    let masCompras = "", masVentas = "", maxCompras = 0, maxVentas = 0;
    for (let categoria in conteoCategorias) {
      if (conteoCategorias[categoria].compra > maxCompras) {
        maxCompras = conteoCategorias[categoria].compra;
        masCompras = categoria;
      }
      if (conteoCategorias[categoria].venta > maxVentas) {
        maxVentas = conteoCategorias[categoria].venta;
        masVentas = categoria;
      }
    }

    document.getElementById("categoriaMasCompras").textContent = masCompras || "Ninguna";
    document.getElementById("categoriaMasVentas").textContent = masVentas || "Ninguna";

    // most bought and most sell product 
    const conteoProductos = {};

    movimientos.forEach(m => { //for each walk all individual movement
      const descripcion = movement.descripcion.toLowerCase();
      const tipo = movement.tipo;
      if (!conteoProductos[descripcion]) {
        conteoProductos[descripcion] = { compra: 0, venta: 0 };
      }
      conteoProductos[descripcion][tipo]++;
    });

    let productoMasComprado = "", productoMasVendido = "";
    let maxComprado = 0, maxVendido = 0;

    for (let producto in conteoProductos) {
      if (conteoProductos[producto].compra > maxComprado) {
        maxComprado = conteoProductos[producto].compra;
        productoMasComprado = producto;
      }
      if (conteoProductos[producto].venta > maxVendido) {
        maxVendido = conteoProductos[producto].venta;
        productoMasVendido = producto;
      }
    }

    document.getElementById("productoMasComprado").textContent = productoMasComprado || "Ninguno";
    document.getElementById("productoMasVendido").textContent = productoMasVendido || "Ninguno";

  } catch (error) {
    console.error("Error cargando reportes:", error);
  }
});