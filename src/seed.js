const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const { Usuario, Ejercicio, Rutina, Producto } = require("./models");

async function seed() {
  await connectDB();
  const correo = (process.env.SEED_ADMIN_EMAIL || "admin@homefit.local").toLowerCase();
  let admin = await Usuario.findOne({ correo });
  if (!admin) {
    admin = await Usuario.create({
      nombre: "Administrador Home Fit", correo,
      contrasenaHash: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "CambiaEstaClave123!", 12),
      rol: "ADMINISTRADOR",
    });
  } else if (admin.rol !== "ADMINISTRADOR") {
    admin.rol = "ADMINISTRADOR";
    await admin.save();
  }

  const datosEjercicios = [
    ["Sentadilla corporal", "Ejercicio básico para piernas.", "PIERNAS", "REPETICIONES"],
    ["Plancha abdominal", "Fortalece la zona media.", "ABDOMEN", "TIEMPO"],
    ["Flexiones de brazos", "Ejercicio para pecho y brazos.", "BRAZOS", "REPETICIONES"],
    ["Zancadas alternas", "Trabajo controlado de piernas y glúteos.", "GLUTEOS", "REPETICIONES"],
  ];
  const ejercicios = {};
  for (const [nombre, descripcion, grupoMuscular, tipoMedicion] of datosEjercicios) {
    ejercicios[nombre] = await Ejercicio.findOneAndUpdate(
      { nombre },
      { $set: { descripcion, grupoMuscular, tipoMedicion, dificultad: "PRINCIPIANTE", equipamiento: [], activo: true, instrucciones: ["Realiza el movimiento de forma controlada", "Respira de forma constante"] } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }

  const datosRutinas = [
    ["Cuerpo completo en casa", "Activa todo el cuerpo con ejercicios seguros para realizar en casa.", "CUERPO_COMPLETO", 15, ["Sentadilla corporal", "Flexiones de brazos", "Plancha abdominal"]],
    ["Plancha y abdomen", "Fortalece la zona media y mejora tu estabilidad.", "ABDOMEN", 12, ["Plancha abdominal"]],
    ["Brazos y espalda", "Mejora la fuerza y movilidad del tren superior.", "BRAZOS", 15, ["Flexiones de brazos"]],
    ["Piernas y glúteos", "Trabaja piernas y glúteos sin salir de casa.", "PIERNAS", 20, ["Sentadilla corporal", "Zancadas alternas"]],
  ];
  for (const [nombre, descripcion, categoria, duracionEstimadaMinutos, nombresEjercicios] of datosRutinas) {
    await Rutina.findOneAndUpdate(
      { nombre },
      { $set: {
        descripcion, objetivo: "MANTENERSE_ACTIVO", categoria, dificultad: "PRINCIPIANTE",
        duracionEstimadaMinutos, equipamiento: [], publicada: true, activa: true, creadoPor: admin.id,
        ejercicios: nombresEjercicios.map((nombreEjercicio, index) => {
          const ejercicio = ejercicios[nombreEjercicio];
          return { idEjercicio: ejercicio.id, orden: index + 1, series: 3,
            repeticiones: ejercicio.tipoMedicion === "REPETICIONES" ? 12 : undefined,
            duracionSegundos: ejercicio.tipoMedicion === "TIEMPO" ? 30 : undefined,
            descansoSegundos: 45 };
        }),
      } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }

  const datosProductos = [
    ["Mancuernas (par 3 kg)", "MANCUERNAS", 4990],
    ["Ligas de resistencia", "LIGAS", 2990],
    ["Tapete de ejercicio", "TAPETES", 6990],
    ["Soga para saltar", "OTROS", 3990],
  ];
  for (const [nombre, categoria, precioCentimos] of datosProductos) {
    await Producto.findOneAndUpdate(
      { nombre },
      { $set: { descripcion: "Producto para tu entrenamiento en casa.", categoria, precioCentimos, existencias: 20, activo: true } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }
  console.log(`Semilla lista. Administrador: ${correo}`);
  process.exit(0);
}
seed().catch((error) => { console.error(error); process.exit(1); });
