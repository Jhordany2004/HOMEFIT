const servicio = require("../services/usuarioService");
const { responderExito } = require("../compartido/respuesta");
async function obtenerPerfil(req, res, next) {
  try {
    return responderExito(res, await servicio.obtenerPerfil(req.usuario.sub));
  } catch (error) {
    return next(error);
  }
}
async function actualizarPerfil(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.actualizarPerfil(req.usuario.sub, req.body),
      "Perfil actualizado",
    );
  } catch (error) {
    return next(error);
  }
}
async function cambiarContrasena(req, res, next) {
  try {
    await servicio.cambiarContrasena(
      req.usuario.sub,
      req.body.contrasenaActual,
      req.body.contrasenaNueva,
    );
    return responderExito(res, null, "Contraseña actualizada");
  } catch (error) {
    return next(error);
  }
}
module.exports = { obtenerPerfil, actualizarPerfil, cambiarContrasena };
