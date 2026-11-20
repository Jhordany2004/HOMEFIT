const mongoose = require("mongoose");
const esquema = new mongoose.Schema(
  {
    idUsuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true },
    fechaExpiracion: { type: Date, required: true, expires: 0 },
    fechaRevocacion: Date,
    nombreDispositivo: String,
  },
  {
    timestamps: { createdAt: "fechaCreacion", updatedAt: false },
    collection: "tokens_renovacion",
  },
);
module.exports = mongoose.model("TokenRenovacion", esquema);
