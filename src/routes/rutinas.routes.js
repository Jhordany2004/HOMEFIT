const router = require("express").Router();
const controlador = require("../controllers/rutinaController");
const {
  autenticar,
  autorizar,
} = require("../compartido/middlewares/autenticar");
router.get("/rutinas", autenticar, controlador.listar);
router.get("/rutinas/:id", autenticar, controlador.obtener);
router.post(
  "/rutinas",
  autenticar,
  autorizar("ADMINISTRADOR"),
  controlador.crear,
);
router.patch(
  "/rutinas/:id",
  autenticar,
  autorizar("ADMINISTRADOR"),
  controlador.actualizar,
);
router.patch(
  "/rutinas/:id/publicacion",
  autenticar,
  autorizar("ADMINISTRADOR"),
  controlador.cambiarPublicacion,
);
router.patch(
  "/rutinas/:id/estado",
  autenticar,
  autorizar("ADMINISTRADOR"),
  controlador.cambiarEstado,
);
module.exports = router;
