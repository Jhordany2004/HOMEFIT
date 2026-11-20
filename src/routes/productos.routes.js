const router = require("express").Router();
const controlador = require("../controllers/productoController");
const {
  autenticar,
  autorizar,
} = require("../compartido/middlewares/autenticar");
router.get("/productos", controlador.listar);
router.get("/productos/:id", controlador.obtener);
router.post(
  "/productos",
  autenticar,
  autorizar("ADMINISTRADOR"),
  controlador.crear,
);
router.patch(
  "/productos/:id",
  autenticar,
  autorizar("ADMINISTRADOR"),
  controlador.actualizar,
);
router.patch(
  "/productos/:id/estado",
  autenticar,
  autorizar("ADMINISTRADOR"),
  controlador.cambiarEstado,
);
module.exports = router;
