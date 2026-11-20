const servicio = require("../services/carritoService");
const { responderExito } = require("../compartido/respuesta");
async function obtener(req, res, next) {
  try {
    return responderExito(res, await servicio.obtener(req.usuario.sub));
  } catch (error) {
    return next(error);
  }
}
async function guardarArticulo(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.guardarArticulo(
        req.usuario.sub,
        req.params.idProducto,
        Number(req.body.cantidad),
      ),
      "Carrito actualizado",
    );
  } catch (error) {
    return next(error);
  }
}
async function eliminarArticulo(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.eliminarArticulo(req.usuario.sub, req.params.idProducto),
      "Artículo eliminado",
    );
  } catch (error) {
    return next(error);
  }
}
async function vaciar(req, res, next) {
  try {
    await servicio.vaciar(req.usuario.sub);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
module.exports = { obtener, guardarArticulo, eliminarArticulo, vaciar };
