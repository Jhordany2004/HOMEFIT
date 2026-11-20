const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const variables = require("./config/env");
const rutas = require("./routes");
const rutasSalud = require("./routes/salud.rutas");
const { ErrorAplicacion } = require("./compartido/errores/ErrorAplicacion");
const { manejarErrores } = require("./compartido/middlewares/manejarErrores");

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: (origen, siguiente) =>
      !origen || variables.corsOrigins.includes(origen)
        ? siguiente(null, true)
        : siguiente(new Error("Origen no permitido")),
    credentials: true,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(
  rateLimit({
    windowMs: variables.rateWindow,
    limit: variables.rateMax,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(rutasSalud);
app.use("/api/v1", rutas);
app.use((req, res, next) =>
  next(new ErrorAplicacion(404, "Ruta no encontrada")),
);
app.use(manejarErrores);

module.exports = app;
