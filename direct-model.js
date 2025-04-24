const express = require("express");
const app = express();

app.use(express.static(__dirname)); // Serve static files

// Root route to avoid "Cannot GET /"
app.get("/", (req, res) => {
  res.send("SnapTap Model Viewer backend is running.");
});

app.get("/:modelFile", (req, res) => {
  const modelFile = req.params.modelFile;
  if (modelFile.endsWith(".glb")) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Model Viewer</title>
        <script type="module" src="https://unpkg.com/@google/model-viewer@latest"></script>
        <style> model-viewer { width: 100vw; height: 100vh; background: #eee; } </style>
      </head>
      <body>
        <model-viewer src="uploads/${modelFile}" camera-controls auto-rotate ar></model-viewer>
      </body>
      </html>
    `);
  } else {
    res.status(404).send("Model not found!");
  }
});

module.exports = app;
