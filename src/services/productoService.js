const Producto = require("../models/Producto");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");
const { listarPaginado } = require("../compartido/paginacion");

async function listar(consulta, esAdministrador) {
  const filtro = esAdministrador ? {} : { activo: true };
  if (consulta.categoria) filtro.categoria = consulta.categoria;
  if (consulta.buscar)
    filtro.$or = ["nombre", "descripcion"].map((campo) => ({
      [campo]: new RegExp(consulta.buscar, "i"),
    }));
  return listarPaginado(Producto, filtro, consulta, { nombre: 1 });
}
async function obtener(id, esAdministrador) {
  const producto = await Producto.findOne({
    _id: id,
    ...(esAdministrador ? {} : { activo: true }),
  });
  if (!producto) throw new ErrorAplicacion(404, "Producto no encontrado");
  return producto;
}
function crear(datos, idAdministrador) {
  return Producto.create({ ...datos, creadoPor: idAdministrador });
}
async function actualizar(id, datos) {
  const producto = await Producto.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  });
  if (!producto) throw new ErrorAplicacion(404, "Producto no encontrado");
  return producto;
}
function cambiarEstado(id, activo) {
  return actualizar(id, { activo });
}
module.exports = { listar, obtener, crear, actualizar, cambiarEstado };
