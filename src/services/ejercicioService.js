const Ejercicio = require("../models/Ejercicio");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");
const { listarPaginado } = require("../compartido/paginacion");

async function listar(consulta, esAdministrador) {
  const filtro = esAdministrador ? {} : { activo: true };
  if (consulta.grupoMuscular) filtro.grupoMuscular = consulta.grupoMuscular;
  if (consulta.dificultad) filtro.dificultad = consulta.dificultad;
  if (consulta.nombre) filtro.nombre = new RegExp(consulta.nombre, "i");
  return listarPaginado(Ejercicio, filtro, consulta, { nombre: 1 });
}

async function obtener(id, esAdministrador) {
  const ejercicio = await Ejercicio.findOne({
    _id: id,
    ...(esAdministrador ? {} : { activo: true }),
  });
  if (!ejercicio) throw new ErrorAplicacion(404, "Ejercicio no encontrado");
  return ejercicio;
}

function crear(datos, idAdministrador) {
  return Ejercicio.create({ ...datos, creadoPor: idAdministrador });
}
function actualizar(id, datos) {
  return Ejercicio.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  });
}
function cambiarEstado(id, activo) {
  return actualizar(id, { activo });
}

module.exports = { listar, obtener, crear, actualizar, cambiarEstado };
