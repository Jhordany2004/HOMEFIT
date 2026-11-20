const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const TokenRenovacion = require("../models/TokenRenovacion");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");
const camposEditables = [
  "nombre",
  "fechaNacimiento",
  "estaturaCm",
  "pesoInicialKg",
  "nivelFisico",
  "objetivo",
  "minutosDisponibles",
  "equipamiento",
  "metaSemanal",
];
async function obtenerPerfil(idUsuario) {
  const usuario = await Usuario.findById(idUsuario);
  if (!usuario) throw new ErrorAplicacion(404, "Usuario no encontrado");
  return usuario;
}
async function actualizarPerfil(idUsuario, datos) {
  const cambios = Object.fromEntries(
    camposEditables
      .filter((campo) => datos[campo] !== undefined)
      .map((campo) => [campo, datos[campo]]),
  );
  const usuario = await Usuario.findByIdAndUpdate(idUsuario, cambios, {
    new: true,
    runValidators: true,
  });
  if (!usuario) throw new ErrorAplicacion(404, "Usuario no encontrado");
  return usuario;
}
async function cambiarContrasena(idUsuario, contrasenaActual, contrasenaNueva) {
  const usuario = await Usuario.findById(idUsuario).select("+contrasenaHash");
  if (
    !usuario ||
    !(await bcrypt.compare(contrasenaActual, usuario.contrasenaHash))
  )
    throw new ErrorAplicacion(400, "La contraseña actual es incorrecta");
  usuario.contrasenaHash = await bcrypt.hash(contrasenaNueva, 12);
  await usuario.save();
  await TokenRenovacion.updateMany(
    { idUsuario },
    { fechaRevocacion: new Date() },
  );
}
module.exports = { obtenerPerfil, actualizarPerfil, cambiarContrasena };
