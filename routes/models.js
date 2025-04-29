// routes/models.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { convertUsdzToGlb } = require("../services/convertService");
const {
  uploadFileToSupabase,
  uploadImageToSupabase,
} = require("../services/uploadService");
const {
  generateAndUploadQRCode,
} = require("../scripts/generateAndUploadQRCode");

const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // get .usdz or .jpg
    const uniqueName = crypto.randomBytes(16).toString("hex") + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_BUCKET_POSTFIX = process.env.SUPABASE_BUCKET_POSTFIX;

const SUPABASE_BASE_URL = `${SUPABASE_URL}${SUPABASE_BUCKET_POSTFIX}`;

router.get("/model/:modelFile", (req, res) => {
  const modelFile = req.params.modelFile;

  if (modelFile) {
    const rawModelName = modelFile.replace(/\.(glb|usdz)$/i, "");
    const fullModelUrl = `${SUPABASE_BASE_URL}/product-models/${rawModelName}`;
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8"> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Model Viewer</title>
        <script type="module" src="https://unpkg.com/@google/model-viewer@latest"></script>
        <style> 
            model-viewer { 
              width: 100vw; height: 100vh; background: #eee; 
            } 

            #custom-ar-button {
              position: absolute;
              top: 16px;
              left: 16px;
              z-index: 100;
              background-color: #00A8DE;
              color: white;
              font-weight: bold;
              padding: 10px 16px;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
            }
      </style>
      </head>
      <body>
        <model-viewer src="${fullModelUrl}.glb" ar-modes="scene-viewer quick-look webxr"
        ios-src="${fullModelUrl}.usdz" camera-controls auto-rotate ar>
          <button slot="ar-button" id="custom-ar-button">View AR Mode</button>
        </model-viewer>
      </body>
      </html>
    `);
  } else {
    res.status(404).send("Model not found!");
  }
});

router.post(
  "/model/add-new-model",
  upload.fields([
    { name: "modelFile", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const modelFile = req.files["modelFile"][0];
      const image = req.files["image"][0];

      const { brandName, brandId, productId } = req.body;

      const glbPath = await convertUsdzToGlb(modelFile);

      const productSuffixPath = `${brandName}${brandId}-${productId}`;

      const usdzPublicUrl = await uploadFileToSupabase(
        modelFile.path,
        productSuffixPath,
        "usdz"
      );
      const glbPublicUrl = await uploadFileToSupabase(
        glbPath,
        productSuffixPath,
        "glb"
      );

      const imagePublicUrl = await uploadImageToSupabase(
        image.path,
        productSuffixPath,
        image.mimetype.split("/")[1]
      );

      const productUrl = `https://snaptap.up.railway.app/model/${productSuffixPath}`;

      const qrCodeUrl = await generateAndUploadQRCode(
        productUrl,
        productSuffixPath
      );

      res.status(200).send({
        message: "Model Files uploaded successfully",
        usdzUrl: usdzPublicUrl,
        glbUrl: glbPublicUrl,
        imageUrl: imagePublicUrl,
        qrCodeUrl,
      });

      const errors = deleteFiles([modelFile.path, glbPath, image.path]);
      if (errors.length > 0) console.error("Errors deleting files:", errors);
    } catch (err) {
      console.error("Error in /add-new-model:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

const deleteFiles = (files) => {
  const errors = [];

  files.forEach((file) => {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      } else {
        const msg = `File not found: ${file}`;
        console.warn(msg);
        errors.push({ file, error: msg });
      }
    } catch (err) {
      const msg = `Failed to delete ${file}: ${err.message}`;
      console.error(msg);
      errors.push({ file, error: msg });
    }
  });

  return errors;
};

module.exports = router;
