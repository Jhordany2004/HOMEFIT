# Home Fit API

Backend REST para Home Fit, construido con Node.js, JavaScript, Express y MongoDB/Mongoose. La API se publica bajo `/api/v1`.

## Arranque

1. Copia `.env.example` a `.env` y coloca la URI de MongoDB Atlas y secretos JWT seguros.
2. Ejecuta `npm install`.
3. Para desarrollo: `npm run dev`; para producción: `npm start`.
4. Verifica `GET http://localhost:3000/salud`.

## Despliegue en Render

El archivo `render.yaml` de la raíz configura un Web Service con `rootDir: Back`,
`npm ci`, `npm start` y health check en `/salud`.

1. Sube el repositorio a GitHub y crea el servicio desde **Blueprint** en Render.
2. Define `MONGODB_URI`, `CORS_ORIGINS` (URL pública del frontend) y
   `GEMINI_API_KEY`. Render genera los secretos JWT automáticamente.
3. En Atlas habilita acceso de red desde Render y despliega.
4. Comprueba `https://TU-SERVICIO.onrender.com/salud`.

No subas `.env`; `.env.example` es solo una plantilla.

## Estructura

El código está organizado por responsabilidad dentro de `src/`: `config`,
`controllers`, `middlewares`, `models`, `routes`, `services` y `assets`.
Los nuevos controladores, métodos y rutas usan español. Las rutas canónicas
incluyen `/salud` y `/api/v1/autenticacion/mi-sesion`.

MongoDB Atlas debe ser un clúster de réplica (la configuración habitual de Atlas) para que la transacción de creación de pedidos pueda descontar existencias de forma atómica.

## Seguridad y uso

- En rutas privadas envía `Authorization: Bearer <tokenAcceso>`.
- El rol inicial siempre es `USUARIO`; promueve administradores directamente en la base de datos mediante un proceso controlado.
- Las contraseñas, secretos, refresh tokens y conversaciones no se registran en logs.
- La IA es informativa y se limita a 20 mensajes/hora configurables. Si `OPENAI_API_KEY` está vacía, responde con un mensaje seguro local, permitiendo probar el flujo sin exponer una clave.
- Para crear pedidos se exige `Idempotency-Key` único por solicitud.

Las colecciones, modelos, reglas de ownership, paginación, filtros y rutas cubren el contrato definido en el documento técnico. Los campos sensibles se excluyen de las respuestas JSON.
