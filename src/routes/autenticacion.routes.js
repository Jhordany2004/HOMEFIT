const router = require("express").Router();
const controlador = require("../controllers/autenticacionController");
router.post("/autenticacion/registro", controlador.registrar);
router.post("/autenticacion/ingreso", controlador.ingresar);
router.post("/autenticacion/renovar", controlador.renovar);
router.post("/autenticacion/salir", controlador.salir);
module.exports = router;
