const router = require("express").Router();
const controlador = require("../controllers/carritoController");
const {
  autenticar,
  autorizar,
} = require("../compartido/middlewares/autenticar");
router.get("/carrito", autenticar, autorizar("CLIENTE"), controlador.obtener);
router.put(
  "/carrito/articulos/:idProducto",
  autenticar,
  autorizar("CLIENTE"),
  controlador.guardarArticulo,
);
router.delete(
  "/carrito/articulos/:idProducto",
  autenticar,
  autorizar("CLIENTE"),
  controlador.eliminarArticulo,
);
router.delete("/carrito", autenticar, autorizar("CLIENTE"), controlador.vaciar);
module.exports = router;
