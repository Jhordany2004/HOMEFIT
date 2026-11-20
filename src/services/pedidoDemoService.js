const Pedido = require("../models/PedidoDemo");
const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");
const { listarPaginado } = require("../compartido/paginacion");
async function confirmar(idUsuario, claveIdempotencia) {
  if (claveIdempotencia) {
    const previo = await Pedido.findOne({ idUsuario, claveIdempotencia });
    if (previo) return previo;
  }
  const carrito = await Carrito.findOne({ idUsuario });
  if (!carrito?.articulos.length)
    throw new ErrorAplicacion(422, "El carrito está vacío");
  const productos = await Producto.find({
    _id: { $in: carrito.articulos.map((a) => a.idProducto) },
    activo: true,
  });
  if (productos.length !== carrito.articulos.length)
    throw new ErrorAplicacion(422, "Hay productos no disponibles");
  const mapa = new Map(productos.map((p) => [p.id, p]));
  const articulos = carrito.articulos.map((a) => {
    const p = mapa.get(String(a.idProducto));
    return {
      idProducto: p.id,
      nombreProducto: p.nombre,
      precioUnitarioCentimos: p.precioCentimos,
      cantidad: a.cantidad,
      subtotalCentimos: p.precioCentimos * a.cantidad,
    };
  });
  const pedido = await Pedido.create({
    idUsuario,
    articulos,
    totalCentimos: articulos.reduce((s, a) => s + a.subtotalCentimos, 0),
    claveIdempotencia,
  });
  await Carrito.deleteOne({ _id: carrito.id });
  return pedido;
}
async function listar(idUsuario, consulta) {
  return listarPaginado(Pedido, { idUsuario }, consulta);
}
async function obtener(idUsuario, id) {
  const pedido = await Pedido.findOne({ _id: id, idUsuario });
  if (!pedido) throw new ErrorAplicacion(404, "Pedido no encontrado");
  return pedido;
}
module.exports = { confirmar, listar, obtener };
