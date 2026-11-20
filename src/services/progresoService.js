const Progreso = require("../models/RegistroProgreso");
const Sesion = require("../models/SesionEntrenamiento");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");
const { listarPaginado } = require("../compartido/paginacion");
async function listar(idUsuario, consulta) {
  const filtro = { idUsuario };
  if (consulta.desde || consulta.hasta)
    filtro.fechaRegistro = {
      ...(consulta.desde ? { $gte: new Date(consulta.desde) } : {}),
      ...(consulta.hasta ? { $lte: new Date(consulta.hasta) } : {}),
    };
  return listarPaginado(Progreso, filtro, consulta, { fechaRegistro: -1 });
}
async function crear(idUsuario, datos) {
  if (!datos.pesoKg && !datos.estaturaCm && !datos.cinturaCm)
    throw new ErrorAplicacion(422, "Registre al menos peso, talla o cintura");
  return Progreso.create({
    ...datos,
    idUsuario,
    fechaRegistro: datos.fechaRegistro || new Date(),
  });
}
async function actualizar(idUsuario, id, datos) {
  const registro = await Progreso.findOneAndUpdate(
    { _id: id, idUsuario },
    datos,
    { new: true, runValidators: true },
  );
  if (!registro) throw new ErrorAplicacion(404, "Registro no encontrado");
  return registro;
}
async function eliminar(idUsuario, id) {
  const registro = await Progreso.findOneAndDelete({ _id: id, idUsuario });
  if (!registro) throw new ErrorAplicacion(404, "Registro no encontrado");
}
async function resumen(idUsuario) {
  const [totalSesiones, minutosTotales, registros] = await Promise.all([
    Sesion.countDocuments({ idUsuario, estado: "COMPLETADA" }),
    Sesion.aggregate([
      {
        $match: {
          idUsuario:
            require("mongoose").Types.ObjectId.createFromHexString(idUsuario),
          estado: "COMPLETADA",
        },
      },
      { $group: { _id: null, total: { $sum: "$duracionRealSegundos" } } },
    ]),
    Progreso.find({ idUsuario }).sort({ fechaRegistro: 1 }),
  ]);
  const ultimoRegistro = registros.at(-1);
  return {
    totalSesiones,
    minutosTotales: Math.round((minutosTotales[0]?.total || 0) / 60),
    requiereRegistroSemanal:
      !ultimoRegistro ||
      Date.now() - ultimoRegistro.fechaRegistro.getTime() >= 7 * 24 * 60 * 60 * 1000,
    ultimoRegistro: ultimoRegistro?.fechaRegistro || null,
    mediciones: registros.map((p) => ({
      fechaRegistro: p.fechaRegistro,
      pesoKg: p.pesoKg,
      estaturaCm: p.estaturaCm,
      cinturaCm: p.cinturaCm,
    })),
  };
}
module.exports = { listar, crear, actualizar, eliminar, resumen };
