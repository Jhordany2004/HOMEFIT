const Usuario = require("./Usuario");
const TokenRenovacion = require("./TokenRenovacion");
const Ejercicio = require("./Ejercicio");
const Rutina = require("./Rutina");
const Sesion = require("./SesionEntrenamiento");
const Progreso = require("./RegistroProgreso");
const Producto = require("./Producto");
const Carrito = require("./Carrito");
const Pedido = require("./PedidoDemo");

module.exports = {
  Usuario,
  TokenRenovacion,
  Ejercicio,
  Rutina,
  Sesion,
  Progreso,
  Producto,
  Carrito,
  Pedido,
  E: Usuario.nivelesFisicos,
  O: Usuario.objetivos,
};
