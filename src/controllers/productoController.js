const servicio = require("../services/productoService");
const { responderExito } = require("../compartido/respuesta");
async function listar(req, res, next) {
  try {
    const resultado = await servicio.listar(
      req.query,
      req.usuario?.rol === "ADMINISTRADOR",
    );
    return responderExito(
      res,
      resultado.datos,
      "Productos obtenidos",
      200,
      resultado.paginacion,
    );
  } catch (error) {
    return next(error);
  }
}
async function obtener(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.obtener(
        req.params.id,
        req.usuario?.rol === "ADMINISTRADOR",
      ),
    );
  } catch (error) {
    return next(error);
  }
}
async function crear(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.crear(req.body, req.usuario.sub),
      "Producto creado",
      201,
    );
  } catch (error) {
    return next(error);
  }
}
async function actualizar(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.actualizar(req.params.id, req.body),
      "Producto actualizado",
    );
  } catch (error) {
    return next(error);
  }
}
async function cambiarEstado(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.cambiarEstado(req.params.id, req.body.activo),
      "Estado actualizado",
    );
  } catch (error) {
    return next(error);
  }
}
module.exports = { listar, obtener, crear, actualizar, cambiarEstado };
