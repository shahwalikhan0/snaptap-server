// direct-model.js
require("dotenv").config();
const express = require("express");
const app = express();

// Use routes
const modelViewerRoutes = require("./routes/models");
const apiRoutes = require("./routes/api");
const productRoutes = require("./routes/products");
const brandRoutes = require("./routes/brands");
const userRoutes = require("./routes/users");

app.use(express.static(__dirname)); // Serve static files
app.use("/", modelViewerRoutes); // Handles /:modelFile
app.use("/api", apiRoutes); // Now you can hit /api/products
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("SnapTap backend is running.");
});

module.exports = app;
