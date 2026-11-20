const servicio = require("../services/administracionService");
const { responderExito } = require("../compartido/respuesta");
async function obtenerResumen(req, res, next) {
  try {
    return responderExito(res, await servicio.obtenerResumen());
  } catch (e) {
    return next(e);
  }
}
async function listarUsuarios(req, res, next) {
  try {
    const r = await servicio.listarUsuarios(req.query);
    return responderExito(
      res,
      r.datos,
      "Usuarios obtenidos",
      200,
      r.paginacion,
    );
  } catch (e) {
    return next(e);
  }
}
async function cambiarEstadoUsuario(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.cambiarEstadoUsuario(
        req.usuario.sub,
        req.params.id,
        req.body.activo,
      ),
      "Estado actualizado",
    );
  } catch (e) {
    return next(e);
  }
}
module.exports = { obtenerResumen, listarUsuarios, cambiarEstadoUsuario };
