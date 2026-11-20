const servicio = require("../services/ejercicioService");
const { responderExito } = require("../compartido/respuesta");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");

async function listar(solicitud, respuesta, siguiente) {
  try {
    const resultado = await servicio.listar(
      solicitud.query,
      solicitud.usuario?.rol === "ADMINISTRADOR",
    );
    return responderExito(
      respuesta,
      resultado.datos,
      "Ejercicios obtenidos",
      200,
      resultado.paginacion,
    );
  } catch (error) {
    return siguiente(error);
  }
}
async function obtener(solicitud, respuesta, siguiente) {
  try {
    return responderExito(
      respuesta,
      await servicio.obtener(
        solicitud.params.id,
        solicitud.usuario?.rol === "ADMINISTRADOR",
      ),
    );
  } catch (error) {
    return siguiente(error);
  }
}
async function crear(solicitud, respuesta, siguiente) {
  try {
    return responderExito(
      respuesta,
      await servicio.crear(solicitud.body, solicitud.usuario.sub),
      "Ejercicio creado",
      201,
    );
  } catch (error) {
    return siguiente(error);
  }
}
async function actualizar(solicitud, respuesta, siguiente) {
  try {
    const ejercicio = await servicio.actualizar(
      solicitud.params.id,
      solicitud.body,
    );
    if (!ejercicio) throw new ErrorAplicacion(404, "Ejercicio no encontrado");
    return responderExito(respuesta, ejercicio, "Ejercicio actualizado");
  } catch (error) {
    return siguiente(error);
  }
}
async function cambiarEstado(solicitud, respuesta, siguiente) {
  try {
    const ejercicio = await servicio.cambiarEstado(
      solicitud.params.id,
      solicitud.body.activo,
    );
    if (!ejercicio) throw new ErrorAplicacion(404, "Ejercicio no encontrado");
    return responderExito(respuesta, ejercicio, "Estado actualizado");
  } catch (error) {
    return siguiente(error);
  }
}

module.exports = { listar, obtener, crear, actualizar, cambiarEstado };
