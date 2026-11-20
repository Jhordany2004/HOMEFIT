const router = require("express").Router();
const controlador = require("../controllers/pedidoDemoController");
const {
  autenticar,
  autorizar,
} = require("../compartido/middlewares/autenticar");
router.use(autenticar, autorizar("CLIENTE"));
router.post("/pedidos-demo", controlador.confirmar);
router.get("/pedidos-demo", controlador.listar);
router.get("/pedidos-demo/:id", controlador.obtener);
module.exports = router;
