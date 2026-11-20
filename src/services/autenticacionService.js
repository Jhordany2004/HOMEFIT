const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const TokenRenovacion = require("../models/TokenRenovacion");
const variables = require("../config/env");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
const perfilPublico = (usuario) => usuario.toJSON();
function crearAcceso(usuario) {
  return jwt.sign(
    { sub: usuario.id, rol: usuario.rol },
    variables.accessSecret,
    { expiresIn: variables.accessExpiresIn },
  );
}
async function emitirTokens(usuario, nombreDispositivo) {
  const jti = crypto.randomUUID();
  const tokenRenovacion = jwt.sign(
    { sub: usuario.id, jti },
    variables.refreshSecret,
    { expiresIn: variables.refreshExpiresIn },
  );
  const decodificado = jwt.decode(tokenRenovacion);
  await TokenRenovacion.create({
    idUsuario: usuario.id,
    tokenHash: hashToken(tokenRenovacion),
    fechaExpiracion: new Date(decodificado.exp * 1000),
    nombreDispositivo,
  });
  return { tokenAcceso: crearAcceso(usuario), tokenRenovacion };
}
async function registrar({ nombre, correo, contrasena }) {
  const correoNormalizado = correo.trim().toLowerCase();
  if (await Usuario.exists({ correo: correoNormalizado }))
    throw new ErrorAplicacion(409, "El correo ya está registrado");
  const usuario = await Usuario.create({
    nombre,
    correo: correoNormalizado,
    contrasenaHash: await bcrypt.hash(contrasena, 12),
  });
  return perfilPublico(usuario);
}
async function ingresar({ correo, contrasena, nombreDispositivo }) {
  const usuario = await Usuario.findOne({
    correo: correo.trim().toLowerCase(),
    activo: true,
  }).select("+contrasenaHash");
  if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasenaHash)))
    throw new ErrorAplicacion(401, "Correo o contraseña incorrectos");
  return {
    usuario: perfilPublico(usuario),
    ...(await emitirTokens(usuario, nombreDispositivo)),
  };
}
async function renovar(tokenRenovacion) {
  try {
    const contenido = jwt.verify(tokenRenovacion, variables.refreshSecret);
    const token = await TokenRenovacion.findOne({
      idUsuario: contenido.sub,
      tokenHash: hashToken(tokenRenovacion),
      fechaRevocacion: null,
    });
    if (!token) throw new Error();
    token.fechaRevocacion = new Date();
    await token.save();
    const usuario = await Usuario.findById(contenido.sub);
    if (!usuario?.activo) throw new Error();
    return emitirTokens(usuario, token.nombreDispositivo);
  } catch {
    throw new ErrorAplicacion(401, "Token de renovación inválido o vencido");
  }
}
async function salir(tokenRenovacion) {
  if (tokenRenovacion)
    await TokenRenovacion.updateOne(
      { tokenHash: hashToken(tokenRenovacion) },
      { fechaRevocacion: new Date() },
    );
}
module.exports = { registrar, ingresar, renovar, salir };
