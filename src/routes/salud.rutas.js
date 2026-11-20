const express = require("express");
const { obtenerEstadoServicio } = require("../controllers/salud.controlador");

const rutasSalud = express.Router();

rutasSalud.get("/salud", obtenerEstadoServicio);

module.exports = rutasSalud;
