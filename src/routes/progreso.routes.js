const router = require("express").Router();
const controlador = require("../controllers/progresoController");
const {
  autenticar,
  autorizar,
} = require("../compartido/middlewares/autenticar");
router.use(autenticar, autorizar("CLIENTE"));
router.get("/progreso", controlador.listar);
router.post("/progreso", controlador.crear);
router.get("/progreso/resumen", controlador.obtenerResumen);
router.patch("/progreso/:id", controlador.actualizar);
router.delete("/progreso/:id", controlador.eliminar);
module.exports = router;
