function manejarErrores(error, solicitud, respuesta, siguiente) {
  const estado = error.estado || 500;
  if (estado >= 500) console.error(error);
  return respuesta
    .status(estado)
    .json({
      exito: false,
      mensaje: error.message || "Error interno del servidor",
      ...(error.errores ? { errores: error.errores } : {}),
    });
}

module.exports = { manejarErrores };
