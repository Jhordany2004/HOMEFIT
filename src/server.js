const app = require("./app");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const { port } = require("./config/env");
connectDB()
  .then(() => {
    const servidor = app.listen(port, () =>
      console.log(`API Home Fit en puerto ${port}`),
    );
    const cerrar = (senal) => {
      console.log(`${senal} recibido: cerrando API Home Fit`);
      servidor.close(() =>
        mongoose.disconnect().finally(() => process.exit(0)),
      );
    };
    process.once("SIGTERM", () => cerrar("SIGTERM"));
    process.once("SIGINT", () => cerrar("SIGINT"));
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
