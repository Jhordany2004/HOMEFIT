const servicio = require("../services/progresoService");
const { responderExito } = require("../compartido/respuesta");
async function listar(req, res, next) {
  try {
    const r = await servicio.listar(req.usuario.sub, req.query);
    return responderExito(res, r.datos, "Progreso obtenido", 200, r.paginacion);
  } catch (e) {
    return next(e);
  }
}
async function crear(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.crear(req.usuario.sub, req.body),
      "Medición registrada",
      201,
    );
  } catch (e) {
    return next(e);
  }
}
async function obtenerResumen(req, res, next) {
  try {
    return responderExito(res, await servicio.resumen(req.usuario.sub));
  } catch (e) {
    return next(e);
  }
}
async function actualizar(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.actualizar(req.usuario.sub, req.params.id, req.body),
      "Medición actualizada",
    );
  } catch (e) {
    return next(e);
  }
}
async function eliminar(req, res, next) {
  try {
    await servicio.eliminar(req.usuario.sub, req.params.id);
    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
}
module.exports = { listar, crear, obtenerResumen, actualizar, eliminar };
