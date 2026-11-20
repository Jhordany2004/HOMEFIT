const mongoose = require("mongoose");
const esquema = new mongoose.Schema(
  {
    idUsuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
      unique: true,
    },
    articulos: [
      {
        idProducto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
          max: 99,
          validate: Number.isInteger,
        },
      },
    ],
  },
  {
    timestamps: { createdAt: false, updatedAt: "fechaActualizacion" },
    collection: "carritos",
  },
);
module.exports = mongoose.model("Carrito", esquema);
