// routes/models.js
const express = require("express");
const router = express.Router();

const SUPABASE_BASE_URL =
  "https://ifyrnbgfeshpykfjgzcc.supabase.co/storage/v1/object/public/product-models/";

router.get("/:modelFile", (req, res) => {
  const modelFile = req.params.modelFile;

  if (modelFile) {
    const rawModelName = modelFile.replace(/\.(glb|usdz)$/i, "");
    const fullModelUrl = `${SUPABASE_BASE_URL}${rawModelName}`;
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
        <model-viewer src="${fullModelUrl}.glb" ar-modes="scene-viewer quick-look webxr"
        ios-src="${fullModelUrl}.usdz" camera-controls auto-rotate ar>
        </model-viewer>
      </body>
      </html>
    `);
  } else {
    res.status(404).send("Model not found!");
  }
});

module.exports = router;
