const mongoose = require("mongoose");
const { opcionesModelo } = require("./opcionesModelo");
const esquema = new mongoose.Schema(
  {
    idUsuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    articulos: [
      {
        idProducto: mongoose.Schema.Types.ObjectId,
        nombreProducto: String,
        precioUnitarioCentimos: Number,
        cantidad: Number,
        subtotalCentimos: Number,
      },
    ],
    totalCentimos: { type: Number, required: true },
    moneda: { type: String, default: "PEN" },
    estado: {
      type: String,
      enum: ["SIMULADO", "CANCELADO"],
      default: "SIMULADO",
    },
    claveIdempotencia: String,
  },
  { ...opcionesModelo, collection: "pedidos_demo" },
);
esquema.index({ idUsuario: 1, fechaCreacion: -1 });
esquema.index(
  { idUsuario: 1, claveIdempotencia: 1 },
  { unique: true, sparse: true },
);
module.exports = mongoose.model("PedidoDemo", esquema);
