const mongoose = require("mongoose");
const { opcionesModelo } = require("./opcionesModelo");
const esquema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: String,
    categoria: {
      type: String,
      enum: ["MANCUERNAS", "LIGAS", "PESAS", "TAPETES", "SUPLEMENTOS", "OTROS"],
      required: true,
      index: true,
    },
    precioCentimos: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isInteger,
    },
    moneda: { type: String, default: "PEN" },
    existencias: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isInteger,
    },
    imagenes: [{ url: String, publicId: String }],
    activo: { type: Boolean, default: true, index: true },
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  },
  { ...opcionesModelo, collection: "productos" },
);
esquema.index({ activo: 1, categoria: 1 });
module.exports = mongoose.model("Producto", esquema);
