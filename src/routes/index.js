const router = require("express").Router();

router.use(require("./autenticacion.routes"));
router.use(require("./asistenteIa.routes"));
router.use(require("./usuarios.routes"));
router.use(require("./ejercicios.routes"));
router.use(require("./rutinas.routes"));
router.use(require("./entrenamientos.routes"));
router.use(require("./progreso.routes"));
router.use(require("./productos.routes"));
router.use(require("./carrito.routes"));
router.use(require("./pedidosDemo.routes"));
router.use(require("./administracion.routes"));

module.exports = router;
