const Sesion = require("../models/SesionEntrenamiento");
const Rutina = require("../models/Rutina");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");
const { listarPaginado } = require("../compartido/paginacion");
async function iniciar(idUsuario, idRutina) {
  const rutina = await Rutina.findOne({
    _id: idRutina,
    publicada: true,
    activa: true,
  }).populate("ejercicios.idEjercicio");
  if (!rutina) throw new ErrorAplicacion(404, "Rutina no encontrada");
  return Sesion.create({
    idUsuario,
    idRutina: rutina.id,
    nombreRutina: rutina.nombre,
    ejerciciosRealizados: rutina.ejercicios.map((item) => ({
      idEjercicio: item.idEjercicio.id,
      nombreEjercicio: item.idEjercicio.nombre,
      orden: item.orden,
      seriesCompletadas: 0,
      repeticionesCompletadas: 0,
      duracionRealSegundos: 0,
      completado: false,
    })),
  });
}
async function listar(idUsuario, consulta) {
  const filtro = { idUsuario };
  if (consulta.estado) filtro.estado = consulta.estado;
  return listarPaginado(Sesion, filtro, consulta, { fechaInicio: -1 });
}
async function obtener(idUsuario, id) {
  const sesion = await Sesion.findOne({ _id: id, idUsuario });
  if (!sesion) throw new ErrorAplicacion(404, "Entrenamiento no encontrado");
  return sesion;
}
async function registrarAvance(idUsuario, id, datos) {
  const sesion = await obtener(idUsuario, id);
  if (sesion.estado !== "EN_PROGRESO")
    throw new ErrorAplicacion(409, "El entrenamiento ya fue cerrado");
  sesion.ejerciciosRealizados = datos.ejerciciosRealizados;
  await sesion.save();
  return sesion;
}
async function cerrar(idUsuario, id, estado, datos = {}) {
  const sesion = await obtener(idUsuario, id);
  if (sesion.estado !== "EN_PROGRESO")
    throw new ErrorAplicacion(409, "El entrenamiento ya fue cerrado");
  sesion.estado = estado;
  if (estado === "COMPLETADA") {
    sesion.ejerciciosRealizados = sesion.ejerciciosRealizados.map((ejercicio) => ({
      ...ejercicio.toObject(),
      completado: true,
    }));
  }
  sesion.fechaFin = new Date();
  sesion.duracionRealSegundos =
    datos.duracionRealSegundos ??
    Math.max(0, Math.floor((sesion.fechaFin - sesion.fechaInicio) / 1000));
  sesion.observaciones = datos.observaciones;
  return sesion.save();
}
module.exports = { iniciar, listar, obtener, registrarAvance, cerrar };
