function responderExito(
  respuesta,
  datos,
  mensaje = "Operación exitosa",
  estado = 200,
  paginacion,
) {
  return respuesta
    .status(estado)
    .json({
      exito: true,
      mensaje,
      datos,
      ...(paginacion ? { paginacion } : {}),
    });
}

module.exports = { responderExito };
