require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Log = require("./utils/logger");
const notificationRoutes = require("./route/notificationRoutes");


const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = process.env.TOKEN;

app.use("/api", notificationRoutes);

app.get("/", async (req, res) => {
  await Log("backend", "info", "route", "Health check endpoint hit", TOKEN);
  res.send("Server running");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});