const Usuario = require("../models/Usuario");
const Ejercicio = require("../models/Ejercicio");
const Rutina = require("../models/Rutina");
const Producto = require("../models/Producto");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");
const { listarPaginado } = require("../compartido/paginacion");
async function obtenerResumen() {
  const [usuarios, ejercicios, rutinas, productos] = await Promise.all([
    Usuario.countDocuments({ activo: true }),
    Ejercicio.countDocuments({ activo: true }),
    Rutina.countDocuments({ activa: true }),
    Producto.countDocuments({ activo: true }),
  ]);
  return { usuarios, ejercicios, rutinas, productos };
}
async function listarUsuarios(consulta) {
  const filtro = {};
  if (consulta.buscar)
    filtro.$or = ["nombre", "correo"].map((campo) => ({
      [campo]: new RegExp(consulta.buscar, "i"),
    }));
  return listarPaginado(Usuario, filtro, consulta);
}
async function cambiarEstadoUsuario(idAdministrador, idUsuario, activo) {
  if (String(idAdministrador) === String(idUsuario))
    throw new ErrorAplicacion(409, "No puede desactivar su propia cuenta");
  const usuario = await Usuario.findByIdAndUpdate(
    idUsuario,
    { activo },
    { new: true },
  );
  if (!usuario) throw new ErrorAplicacion(404, "Usuario no encontrado");
  return usuario;
}
module.exports = { obtenerResumen, listarUsuarios, cambiarEstadoUsuario };
