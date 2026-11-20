const router = require("express").Router();
const controlador = require("../controllers/administracionController");
const {
  autenticar,
  autorizar,
} = require("../compartido/middlewares/autenticar");
router.use(autenticar, autorizar("ADMINISTRADOR"));
router.get("/administracion/resumen", controlador.obtenerResumen);
router.get("/administracion/usuarios", controlador.listarUsuarios);
router.patch(
  "/administracion/usuarios/:id/estado",
  controlador.cambiarEstadoUsuario,
);
module.exports = router;
