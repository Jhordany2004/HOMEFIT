const servicio = require("../services/entrenamientoService");
const { responderExito } = require("../compartido/respuesta");
async function iniciar(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.iniciar(req.usuario.sub, req.body.idRutina),
      "Entrenamiento iniciado",
      201,
    );
  } catch (error) {
    return next(error);
  }
}
async function listar(req, res, next) {
  try {
    const r = await servicio.listar(req.usuario.sub, req.query);
    return responderExito(
      res,
      r.datos,
      "Historial obtenido",
      200,
      r.paginacion,
    );
  } catch (error) {
    return next(error);
  }
}
async function obtener(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.obtener(req.usuario.sub, req.params.id),
    );
  } catch (error) {
    return next(error);
  }
}
async function registrarAvance(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.registrarAvance(req.usuario.sub, req.params.id, req.body),
      "Avance registrado",
    );
  } catch (error) {
    return next(error);
  }
}
async function finalizar(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.cerrar(
        req.usuario.sub,
        req.params.id,
        "COMPLETADA",
        req.body,
      ),
      "Entrenamiento finalizado",
    );
  } catch (error) {
    return next(error);
  }
}
async function cancelar(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.cerrar(req.usuario.sub, req.params.id, "CANCELADA"),
      "Entrenamiento cancelado",
    );
  } catch (error) {
    return next(error);
  }
}
module.exports = {
  iniciar,
  listar,
  obtener,
  registrarAvance,
  finalizar,
  cancelar,
};
