const Usuario = require("../models/Usuario");
const { ErrorAplicacion } = require("../compartido/errores/ErrorAplicacion");
const variables = require("../config/env");

const MAX_MENSAJES = 12;
const MAX_CARACTERES = 1000;
const idSeguro = (id) => String(id).slice(-6);
function logIa(evento, datos) {
  if (variables.iaDebugLogs) console.info(`[IA] ${evento}`, datos);
}

function normalizarHistorial(historial) {
  if (!Array.isArray(historial)) return [];
  return historial
    .slice(-MAX_MENSAJES)
    .filter((mensaje) =>
      mensaje && ["user", "model"].includes(mensaje.rol) &&
      typeof mensaje.texto === "string" && mensaje.texto.trim(),
    )
    .map((mensaje) => ({
      role: mensaje.rol,
      parts: [{ text: mensaje.texto.trim().slice(0, MAX_CARACTERES) }],
    }));
}

async function conversar(idUsuario, pregunta, historial) {
  if (typeof pregunta !== "string" || !pregunta.trim())
    throw new ErrorAplicacion(422, "Escribe una pregunta para el asistente");
  if (pregunta.length > MAX_CARACTERES)
    throw new ErrorAplicacion(422, "La pregunta es demasiado larga");
  if (!variables.geminiApiKey)
    throw new ErrorAplicacion(503, "El asistente IA no está configurado todavía");

  const usuario = await Usuario.findById(idUsuario).lean();
  if (!usuario) throw new ErrorAplicacion(404, "Usuario no encontrado");
  const perfil = [
    `nombre: ${usuario.nombre}`,
    usuario.objetivo && `objetivo: ${usuario.objetivo}`,
    usuario.nivelFisico && `nivel: ${usuario.nivelFisico}`,
    usuario.minutosDisponibles && `minutos disponibles: ${usuario.minutosDisponibles}`,
    usuario.equipamiento?.length && `equipamiento: ${usuario.equipamiento.join(", ")}`,
  ].filter(Boolean).join("; ");
  const instruccion = `Eres Home Fit IA, el asistente amable en español de una app de entrenamiento en casa. Ayuda con rutinas, técnica básica, motivación, hábitos, progreso y uso de la app. Personaliza tus respuestas con este perfil: ${perfil || "sin datos aún"}. Sé breve, claro y práctico; usa viñetas solo si ayudan. No inventes datos de la cuenta ni diagnostiques, trates lesiones o sustituyas a un profesional de salud. Para dolor intenso, lesión, embarazo, trastornos alimentarios o síntomas preocupantes, recomienda detenerse y consultar a un profesional. No des planes extremos ni consejos peligrosos.`;
  const mensajes = normalizarHistorial(historial);
  logIa("solicitud Gemini", {
    usuario: idSeguro(idUsuario),
    modelo: variables.geminiModel,
    caracteresPregunta: pregunta.trim().length,
    mensajesHistorial: mensajes.length,
  });
  const respuesta = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(variables.geminiModel)}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": variables.geminiApiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instruccion }] },
        contents: [...mensajes, { role: "user", parts: [{ text: pregunta.trim() }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 500 },
      }),
      signal: AbortSignal.timeout(20000),
    },
  );
  const cuerpo = await respuesta.json().catch(() => ({}));
  logIa("respuesta Gemini", {
    usuario: idSeguro(idUsuario),
    estadoHttp: respuesta.status,
    finalizacion: cuerpo?.candidates?.[0]?.finishReason,
    errorProveedor: cuerpo?.error?.status,
  });
  if (!respuesta.ok) {
    console.error("[IA] Error de Gemini", {
      usuario: idSeguro(idUsuario),
      estadoHttp: respuesta.status,
      estadoProveedor: cuerpo?.error?.status,
      mensajeProveedor: cuerpo?.error?.message,
      modelo: variables.geminiModel,
    });
    throw new ErrorAplicacion(
      502,
      "El asistente no pudo responder en este momento. Inténtalo de nuevo.",
    );
  }
  const texto = cuerpo?.candidates?.[0]?.content?.parts?.map((parte) => parte.text || "").join("").trim();
  if (!texto) throw new ErrorAplicacion(502, "El asistente no generó una respuesta");
  logIa("respuesta entregada", {
    usuario: idSeguro(idUsuario),
    caracteresRespuesta: texto.length,
  });
  return { respuesta: texto };
}

module.exports = { conversar };
