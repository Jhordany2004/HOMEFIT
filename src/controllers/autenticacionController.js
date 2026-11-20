const servicio = require("../services/autenticacionService");
const { responderExito } = require("../compartido/respuesta");
async function registrar(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.registrar(req.body),
      "Cuenta creada",
      201,
    );
  } catch (error) {
    return next(error);
  }
}
async function ingresar(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.ingresar(req.body),
      "Acceso correcto",
    );
  } catch (error) {
    return next(error);
  }
}
async function renovar(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.renovar(req.body.tokenRenovacion),
      "Tokens renovados",
    );
  } catch (error) {
    return next(error);
  }
}
async function salir(req, res, next) {
  try {
    await servicio.salir(req.body.tokenRenovacion);
    return responderExito(res, null, "Sesión cerrada");
  } catch (error) {
    return next(error);
  }
}
module.exports = { registrar, ingresar, renovar, salir };
