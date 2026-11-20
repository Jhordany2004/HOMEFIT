const mongoose = require("mongoose");
const { opcionesModelo } = require("./opcionesModelo");
const { nivelesFisicos, objetivos } = require("./Usuario");
const ejercicioRutina = new mongoose.Schema(
  {
    idEjercicio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ejercicio",
      required: true,
    },
    orden: { type: Number, required: true, min: 1 },
    series: { type: Number, required: true, min: 1 },
    repeticiones: { type: Number, min: 1 },
    duracionSegundos: { type: Number, min: 1 },
    descansoSegundos: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);
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
    imagenPortada: { url: String, publicId: String },
    objetivo: { type: String, enum: objetivos, required: true },
    categoria: {
      type: String,
      enum: [
        "CUERPO_COMPLETO",
        "PIERNAS",
        "ABDOMEN",
        "BRAZOS",
        "CARDIO",
        "MOVILIDAD",
      ],
      required: true,
    },
    dificultad: { type: String, enum: nivelesFisicos, required: true },
    duracionEstimadaMinutos: { type: Number, required: true, min: 5, max: 120 },
    equipamiento: [String],
    publicada: { type: Boolean, default: false },
    activa: { type: Boolean, default: true },
    ejercicios: { type: [ejercicioRutina], default: [] },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  { ...opcionesModelo, collection: "rutinas" },
);
esquema.index({ publicada: 1, activa: 1, dificultad: 1 });
module.exports = mongoose.model("Rutina", esquema);
