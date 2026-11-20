const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const controlador = require("../controllers/asistenteIaController");
const { autenticar } = require("../compartido/middlewares/autenticar");

router.post(
  "/asistente-ia/chat",
  autenticar,
  rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false, message: { exito: false, mensaje: "Has alcanzado el límite de mensajes de IA por hora" } }),
  controlador.conversar,
);
module.exports = router;
