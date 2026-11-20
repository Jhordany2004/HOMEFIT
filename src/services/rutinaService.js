const Rutina = require("../models/Rutina");
const Ejercicio = require("../models/Ejercicio");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");
const { listarPaginado } = require("../compartido/paginacion");

async function validarEjercicios(ejercicios) {
  if (!Array.isArray(ejercicios) || !ejercicios.length)
    throw new ErrorAplicacion(422, "La rutina debe incluir ejercicios");
  const ordenes = ejercicios.map((ejercicio) => ejercicio.orden);
  if (new Set(ordenes).size !== ordenes.length)
    throw new ErrorAplicacion(422, "No puede repetir el orden de ejercicios");
  const ids = ejercicios.map((ejercicio) => ejercicio.idEjercicio);
  const total = await Ejercicio.countDocuments({
    _id: { $in: ids },
    activo: true,
  });
  if (total !== new Set(ids.map(String)).size)
    throw new ErrorAplicacion(
      422,
      "La rutina contiene ejercicios inexistentes o inactivos",
    );
}

async function listar(consulta, esAdministrador) {
  const filtro = esAdministrador ? {} : { publicada: true, activa: true };
  for (const campo of ["categoria", "dificultad", "objetivo"])
    if (consulta[campo]) filtro[campo] = consulta[campo];
  if (consulta.duracionMaxima)
    filtro.duracionEstimadaMinutos = { $lte: Number(consulta.duracionMaxima) };
  return listarPaginado(Rutina, filtro, consulta);
}

async function obtener(id, esAdministrador) {
  const rutina = await Rutina.findOne({
    _id: id,
    ...(esAdministrador ? {} : { publicada: true, activa: true }),
  }).populate("ejercicios.idEjercicio");
  if (!rutina) throw new ErrorAplicacion(404, "Rutina no encontrada");
  return rutina;
}

async function crear(datos, idAdministrador) {
  return Rutina.create({
    ...datos,
    creadaPor: undefined,
    creadoPor: idAdministrador,
    publicada: false,
  });
}
async function actualizar(id, datos) {
  if (datos.ejercicios) await validarEjercicios(datos.ejercicios);
  const rutina = await Rutina.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  });
  if (!rutina) throw new ErrorAplicacion(404, "Rutina no encontrada");
  return rutina;
}
async function cambiarPublicacion(id, publicada) {
  const rutina = await Rutina.findById(id);
  if (!rutina) throw new ErrorAplicacion(404, "Rutina no encontrada");
  if (publicada) await validarEjercicios(rutina.ejercicios);
  rutina.publicada = publicada;
  return rutina.save();
}
async function cambiarEstado(id, activa) {
  const rutina = await Rutina.findByIdAndUpdate(id, { activa }, { new: true });
  if (!rutina) throw new ErrorAplicacion(404, "Rutina no encontrada");
  return rutina;
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  cambiarPublicacion,
  cambiarEstado,
};
