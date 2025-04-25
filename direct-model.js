// direct-model.js
require("dotenv").config();
const express = require("express");
const app = express();

// Use routes
const modelViewerRoutes = require("./routes/models");
const apiRoutes = require("./routes/api");

app.use(express.static(__dirname)); // Serve static files
app.use("/api", apiRoutes); // Now you can hit /api/products
app.use("/", modelViewerRoutes); // Handles /:modelFile

app.get("/", (req, res) => {
  res.send("SnapTap backend is running.");
});

module.exports = app;
