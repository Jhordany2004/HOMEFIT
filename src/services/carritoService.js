const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");

async function obtener(idUsuario) {
  const carrito = await Carrito.findOne({ idUsuario }).populate(
    "articulos.idProducto",
  );
  if (!carrito) return { articulos: [], totalCentimos: 0 };
  const articulos = carrito.articulos
    .filter((articulo) => articulo.idProducto?.activo)
    .map((articulo) => ({
      idProducto: articulo.idProducto.id,
      nombre: articulo.idProducto.nombre,
      cantidad: articulo.cantidad,
      precioUnitarioCentimos: articulo.idProducto.precioCentimos,
      subtotalCentimos: articulo.idProducto.precioCentimos * articulo.cantidad,
    }));
  return {
    id: carrito.id,
    articulos,
    totalCentimos: articulos.reduce(
      (total, articulo) => total + articulo.subtotalCentimos,
      0,
    ),
    fechaActualizacion: carrito.fechaActualizacion,
  };
}
async function guardarArticulo(idUsuario, idProducto, cantidad) {
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99)
    throw new ErrorAplicacion(
      422,
      "La cantidad debe ser un entero entre 1 y 99",
    );
  const producto = await Producto.findOne({ _id: idProducto, activo: true });
  if (!producto) throw new ErrorAplicacion(404, "Producto no encontrado");
  let carrito = await Carrito.findOne({ idUsuario });
  if (!carrito) carrito = new Carrito({ idUsuario, articulos: [] });
  const articulo = carrito.articulos.find(
    (item) => String(item.idProducto) === producto.id,
  );
  if (articulo) articulo.cantidad = cantidad;
  else carrito.articulos.push({ idProducto: producto.id, cantidad });
  await carrito.save();
  return obtener(idUsuario);
}
async function eliminarArticulo(idUsuario, idProducto) {
  const carrito = await Carrito.findOne({ idUsuario });
  if (carrito) {
    carrito.articulos = carrito.articulos.filter(
      (item) => String(item.idProducto) !== idProducto,
    );
    await carrito.save();
  }
  return obtener(idUsuario);
}
async function vaciar(idUsuario) {
  await Carrito.deleteOne({ idUsuario });
}
module.exports = { obtener, guardarArticulo, eliminarArticulo, vaciar };
