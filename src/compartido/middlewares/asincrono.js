function asincrono(manejador) {
  return (solicitud, respuesta, siguiente) =>
    Promise.resolve(manejador(solicitud, respuesta, siguiente)).catch(
      siguiente,
    );
}

module.exports = { asincrono };
