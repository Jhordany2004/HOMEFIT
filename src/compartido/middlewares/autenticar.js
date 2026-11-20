const jwt = require("jsonwebtoken");
const variables = require("../../config/env");
const { ErrorAplicacion } = require("../errores/ErrorAplicacion");

function autenticar(solicitud, respuesta, siguiente) {
  try {
    const autorizacion = solicitud.headers.authorization;
    if (!autorizacion?.startsWith("Bearer ")) {
      throw new ErrorAplicacion(401, "Token de acceso requerido");
    }
    solicitud.usuario = jwt.verify(
      autorizacion.slice(7),
      variables.accessSecret,
    );
    return siguiente();
  } catch (error) {
    return siguiente(
      error.estado
        ? error
        : new ErrorAplicacion(401, "Token de acceso inválido o vencido"),
    );
  }
}

function autorizar(...rolesPermitidos) {
  return (solicitud, respuesta, siguiente) =>
    rolesPermitidos.includes(
      solicitud.usuario.rol === "USUARIO" ? "CLIENTE" : solicitud.usuario.rol,
    )
      ? siguiente()
      : siguiente(
          new ErrorAplicacion(403, "No tiene permisos para esta operación"),
        );
}

module.exports = { autenticar, autorizar };
