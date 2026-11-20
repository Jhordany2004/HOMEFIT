const router = require("express").Router();
const controlador = require("../controllers/ejercicioController");
const {
  autenticar,
  autorizar,
} = require("../compartido/middlewares/autenticar");
router.get("/ejercicios", autenticar, controlador.listar);
router.get("/ejercicios/:id", autenticar, controlador.obtener);
router.post(
  "/ejercicios",
  autenticar,
  autorizar("ADMINISTRADOR"),
  controlador.crear,
);
router.patch(
  "/ejercicios/:id",
  autenticar,
  autorizar("ADMINISTRADOR"),
  controlador.actualizar,
);
router.patch(
  "/ejercicios/:id/estado",
  autenticar,
  autorizar("ADMINISTRADOR"),
  controlador.cambiarEstado,
);
module.exports = router;
