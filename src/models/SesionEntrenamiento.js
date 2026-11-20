const mongoose = require("mongoose");
const { opcionesModelo } = require("./opcionesModelo");
const esquema = new mongoose.Schema(
  {
    idUsuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    idRutina: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rutina",
      required: true,
    },
    nombreRutina: { type: String, required: true },
    estado: {
      type: String,
      enum: ["EN_PROGRESO", "COMPLETADA", "CANCELADA"],
      default: "EN_PROGRESO",
    },
    fechaInicio: { type: Date, default: Date.now },
    fechaFin: Date,
    duracionRealSegundos: { type: Number, min: 0, default: 0 },
    ejerciciosRealizados: [
      {
        idEjercicio: mongoose.Schema.Types.ObjectId,
        nombreEjercicio: String,
        orden: Number,
        seriesCompletadas: Number,
        repeticionesCompletadas: Number,
        duracionRealSegundos: Number,
        completado: Boolean,
      },
    ],
    observaciones: String,
  },
  { ...opcionesModelo, collection: "sesiones_entrenamiento" },
);
esquema.index({ idUsuario: 1, fechaInicio: -1 });
module.exports = mongoose.model("SesionEntrenamiento", esquema);
