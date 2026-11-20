const mongoose = require("mongoose");
const { opcionesModelo } = require("./opcionesModelo");
const esquema = new mongoose.Schema(
  {
    idUsuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    fechaRegistro: { type: Date, required: true },
    pesoKg: { type: Number, min: 20, max: 300 },
    estaturaCm: { type: Number, min: 80, max: 250 },
    cinturaCm: { type: Number, min: 0 },
    observaciones: String,
  },
  { ...opcionesModelo, collection: "registros_progreso" },
);
esquema.index({ idUsuario: 1, fechaRegistro: -1 });
module.exports = mongoose.model("RegistroProgreso", esquema);
