const router = require("express").Router();
const controlador = require("../controllers/entrenamientoController");
const {
  autenticar,
  autorizar,
} = require("../compartido/middlewares/autenticar");
router.use(autenticar, autorizar("CLIENTE"));
router.post("/entrenamientos", controlador.iniciar);
router.get("/entrenamientos", controlador.listar);
router.get("/entrenamientos/:id", controlador.obtener);
router.patch("/entrenamientos/:id", controlador.registrarAvance);
router.post("/entrenamientos/:id/finalizar", controlador.finalizar);
router.post("/entrenamientos/:id/cancelar", controlador.cancelar);
module.exports = router;
