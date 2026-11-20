const mongoose = require("mongoose");
const { mongoUri } = require("./env");
async function connectDB() {
  if (!mongoUri) throw new Error("MONGODB_URI no está configurada");
  await mongoose.connect(mongoUri);
  console.log("MongoDB conectado");
}
module.exports = connectDB;
