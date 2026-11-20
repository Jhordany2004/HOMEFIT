const router = require("express").Router();
const controlador = require("../controllers/usuarioController");
const { autenticar } = require("../compartido/middlewares/autenticar");
router.get("/usuarios/mi-perfil", autenticar, controlador.obtenerPerfil);
router.patch("/usuarios/mi-perfil", autenticar, controlador.actualizarPerfil);
router.patch(
  "/usuarios/mi-perfil/contrasena",
  autenticar,
  controlador.cambiarContrasena,
);
module.exports = router;
