const { responderExito } = require("../compartido/respuesta");

/**
 * Informa que la API está disponible. No requiere autenticación.
 */
function obtenerEstadoServicio(solicitud, respuesta) {
  return responderExito(
    respuesta,
    {
      estado: "ok",
      fecha: new Date().toISOString(),
    },
    "Servicio disponible",
  );
}

module.exports = { obtenerEstadoServicio };
