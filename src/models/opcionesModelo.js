module.exports = {
  opcionesModelo: {
    timestamps: { createdAt: "fechaCreacion", updatedAt: "fechaActualizacion" },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, resultado) => {
        resultado.id = resultado._id.toString();
        delete resultado._id;
        delete resultado.contrasenaHash;
        delete resultado.tokenHash;
      },
    },
  },
};
