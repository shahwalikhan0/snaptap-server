const express = require("express");
const app = express();
const port = 8003;

app.use(express.static(__dirname)); // Serve static files

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

app.listen(port, () =>
  //   console.log(`Server running at http://192.168.100.234:${port}`)
  console.log(`Server running at http://172.20.10.6:${port}`)
);
