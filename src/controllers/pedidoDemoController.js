const servicio = require("../services/pedidoDemoService");
const { responderExito } = require("../compartido/respuesta");
async function confirmar(req, res, next) {
  try {
    const pedido = await servicio.confirmar(
      req.usuario.sub,
      req.get("Idempotency-Key"),
    );
    return responderExito(
      res,
      {
        ...pedido.toJSON(),
        mensajeAviso: "Compra simulada: no se realizará ningún cobro",
      },
      "Pedido simulado creado",
      201,
    );
  } catch (e) {
    return next(e);
  }
}
async function listar(req, res, next) {
  try {
    const r = await servicio.listar(req.usuario.sub, req.query);
    return responderExito(res, r.datos, "Pedidos obtenidos", 200, r.paginacion);
  } catch (e) {
    return next(e);
  }
}
async function obtener(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.obtener(req.usuario.sub, req.params.id),
    );
  } catch (e) {
    return next(e);
  }
}
module.exports = { confirmar, listar, obtener };
