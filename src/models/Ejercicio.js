const mongoose = require("mongoose");
const { opcionesModelo } = require("./opcionesModelo");
const { nivelesFisicos } = require("./Usuario");
const esquema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    descripcion: String,
    instrucciones: [String],
    grupoMuscular: {
      type: String,
      enum: [
        "CUERPO_COMPLETO",
        "PIERNAS",
        "GLUTEOS",
        "ABDOMEN",
        "BRAZOS",
        "ESPALDA",
        "CARDIO",
      ],
      index: true,
    },
    dificultad: { type: String, enum: nivelesFisicos, index: true },
    equipamiento: [String],
    imagenes: [{ url: String, publicId: String }],
    video: { url: String, publicId: String },
    tipoMedicion: {
      type: String,
      enum: ["REPETICIONES", "TIEMPO"],
      required: true,
    },
    activo: { type: Boolean, default: true, index: true },
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  },
  { ...opcionesModelo, collection: "ejercicios" },
);
esquema.index({ activo: 1, grupoMuscular: 1 });
module.exports = mongoose.model("Ejercicio", esquema);
