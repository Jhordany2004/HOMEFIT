const mongoose = require("mongoose");
const { opcionesModelo } = require("./opcionesModelo");
const nivelesFisicos = ["PRINCIPIANTE", "INTERMEDIO", "AVANZADO"];
const objetivos = [
  "PERDER_PESO",
  "GANAR_MUSCULO",
  "MANTENERSE_ACTIVO",
  "MEJORAR_RESISTENCIA",
];
const esquema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    contrasenaHash: { type: String, required: true, select: false },
    rol: {
      type: String,
      enum: ["CLIENTE", "ADMINISTRADOR"],
      default: "CLIENTE",
    },
    fechaNacimiento: Date,
    estaturaCm: { type: Number, min: 80, max: 250 },
    pesoInicialKg: { type: Number, min: 20, max: 300 },
    nivelFisico: { type: String, enum: nivelesFisicos },
    objetivo: { type: String, enum: objetivos },
    minutosDisponibles: { type: Number, min: 5, max: 120 },
    equipamiento: [String],
    metaSemanal: { type: Number, min: 1, max: 7, default: 3 },
    activo: { type: Boolean, default: true },
  },
  { ...opcionesModelo, collection: "usuarios" },
);
esquema.index({ rol: 1, activo: 1 });
const Usuario = mongoose.model("Usuario", esquema);
module.exports = Usuario;
module.exports.nivelesFisicos = nivelesFisicos;
module.exports.objetivos = objetivos;
