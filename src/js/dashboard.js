const apiMovimientos = "http://localhost:3000/movimientos";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const respuesta = await fetch(apiMovimientos);
    const movimientos = await respuesta.json();

    // Filter movements type sales 
    const ingresos = movimientos.filter(movimiento => movimiento.tipo === "venta");

    // Calculate the total value
    const totalIngresos = ingresos.reduce((suma, movimiento) => suma + movimiento.importe, 0);
    document.getElementById("ingresos").textContent = `$${totalIngresos}`;

    // Filter movements of type buys
    const gastos = movimientos.filter(movimiento => movimiento.tipo === "compra");

    // Calculate the total bills
    const totalGastos = gastos.reduce((suma, movimiento) => suma + movimiento.importe, 0);
    document.getElementById("gastos").textContent = `$${totalGastos}`;

    // Calculate the general balance
    const balance = totalIngresos - totalGastos;
    document.getElementById("balance").textContent = `$${balance}`;

    // Show the last movement registered
    if (movimientos.length > 0) {
      const ultimoMovimiento = movimientos[movimientos.length - 1];
      document.getElementById("ultimoMovimiento").textContent =
        `${ultimoMovimiento.tipo.toUpperCase()}: ${ultimoMovimiento.descripcion} - $${ultimoMovimiento.importe}`;
      console.log("Último movimiento:", ultimoMovimiento);
    } else {
      document.getElementById("ultimoMovimiento").textContent = "No hay movimientos registrados.";
    }

  } catch (error) {
    console.error("Error al cargar los datos del dashboard:", error);
  }
});