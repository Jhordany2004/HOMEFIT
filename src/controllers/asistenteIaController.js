const servicio = require("../services/asistenteIaService");
const { responderExito } = require("../compartido/respuesta");

async function conversar(req, res, next) {
  try {
    return responderExito(
      res,
      await servicio.conversar(req.usuario.sub, req.body.pregunta, req.body.historial),
      "Respuesta generada",
    );
  } catch (error) {
    return next(error);
  }
}

module.exports = { conversar };
