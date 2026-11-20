const request = require("supertest");
const app = require("../src/app");

describe("GET /salud", () => {
  it("responde que el servicio está disponible", async () => {
    const response = await request(app).get("/salud");
    expect(response.status).toBe(200);
    expect(response.body.exito).toBe(true);
    expect(response.body.datos.estado).toBe("ok");
  });
});
