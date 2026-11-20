function obtenerPaginacion(consulta) {
  const pagina = Math.max(1, Number(consulta.pagina) || 1);
  const limite = Math.min(100, Math.max(1, Number(consulta.limite) || 20));
  return { pagina, limite, salto: (pagina - 1) * limite };
}

async function listarPaginado(
  Modelo,
  filtro,
  consulta,
  orden = { fechaCreacion: -1 },
) {
  const { pagina, limite, salto } = obtenerPaginacion(consulta);
  const [datos, total] = await Promise.all([
    Modelo.find(filtro).sort(orden).skip(salto).limit(limite),
    Modelo.countDocuments(filtro),
  ]);
  return {
    datos,
    paginacion: { total, pagina, limite, paginas: Math.ceil(total / limite) },
  };
}

module.exports = { obtenerPaginacion, listarPaginado };
