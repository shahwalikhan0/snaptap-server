// routes/models.js
// require("dotenv").config();
const axios = require("axios");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { convertUsdzToGlb } = require("../services/convertService");
const { getBrandById, updateBrand } = require("../services/brandService");
const {
  createProduct,
  createProductDetails,
} = require("../services/productService");

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
        <link rel="icon" href="https://ifyrnbgfeshpykfjgzcc.supabase.co/storage/v1/object/public/user-images/rounded-logo.png" type="image/png">
        <title>SNAPTAP | Model Viewer</title>
        <script type="module" src="https://unpkg.com/@google/model-viewer@latest"></script>
        <style> 
          body {
            padding: 0;
            margin: 0;
            overflow: hidden;
          }
          model-viewer { 
            width: 100vw; 
            height: 100vh; 
            background: #eee; 
          }

          #custom-ar-button, #ar-not-supported {
            position: absolute;
            top: 16px;
            left: 16px;
            z-index: 100;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
          }

          #custom-ar-button {
            border: 1px solid #00A8DE;
            background: transparent;
            color: #00A8DE;
            cursor: pointer;
            display: none; /* hidden by default */
          }

          #ar-not-supported {
            color: red;
            background: transparent;
            border: 1px solid red;
            display: none; /* hidden by default */
          }
        </style>
      </head>
      <body>
        <model-viewer src="${fullModelUrl}.glb" ar-modes="scene-viewer quick-look webxr"
        ios-src="${fullModelUrl}.usdz" camera-controls auto-rotate ar>
          <button slot="ar-button" id="custom-ar-button">View in AR</button>
        </model-viewer>

      <div id="ar-not-supported">Device does not support AR.</div>

      <script>

        const arButton = document.getElementById('custom-ar-button');
        const fallback = document.getElementById('ar-not-supported');

        async function checkARSupport() {
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          const isAndroid = /Android/.test(navigator.userAgent);

          // iOS supports Quick Look AR if it's a real device
          if (isIOS) {
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (isSafari) {
              arButton.style.display = 'block';
              return;
            }
          }

          // Android: Check for WebXR AR support
          if (isAndroid && navigator.xr && navigator.xr.isSessionSupported) {
            try {
              const supported = await navigator.xr.isSessionSupported('immersive-ar');
              if (supported) {
                arButton.style.display = 'block';
                return;
              }
            } catch (err) {
              // silently fail
            }
          }

          // Otherwise, not supported
          fallback.style.display = 'block';
        }

        window.addEventListener('DOMContentLoaded', checkARSupport);
      </script>

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

      if (!modelFile || !image) {
        return res
          .status(400)
          .json({ error: "Model file and image are required." });
      }

      const {
        brandId,
        name,
        description,
        price,
        website,
        category,
        location,
        is_active,
      } = req.body;

      //TODO: check package details of brand in future

      if (!brandId || !name || !price || !category || !location) {
        return res.status(400).json({
          error: "Kindly fill in all required fields.",
        });
      }

      const brandDetail = await getBrandById(brandId);

      if (!brandDetail || !brandDetail?.data || !brandDetail.data.id) {
        return res.status(404).json({ error: "Brand not found." });
      }

      const brand = brandDetail?.data;

      const productSuffixPath = `${brand.username}${brand.id}-${
        brand.total_models_generated + 1
      }`;

      const { data: updatedBrand, error: brandError } = await updateBrand(
        brand.id,
        {
          total_models_generated: brand.total_models_generated + 1,
        }
      );

      if (brandError) {
        return res.status(500).json({ error: brandError.message });
      }

      const imagePublicUrl = await uploadImageToSupabase(
        image.path,
        productSuffixPath,
        image.mimetype.split("/")[1]
      );

      const { data: product, error: productError } = await createProduct({
        brand_id: brand.id,
        name,
        description,
        category,
        is_active: is_active === "TRUE",
        image_url: imagePublicUrl,
      });

      if (productError) {
        return res.status(500).json({ error: productError.message });
      }
      const productId = product.id;

      const glbPath = await convertUsdzToGlb(modelFile);

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

      const productUrl = `https://snaptap.up.railway.app/model/${productSuffixPath}`;

      const qrCodeUrl = await generateAndUploadQRCode(
        productUrl,
        productSuffixPath
      );

      // Create product details
      const { error: productDetailsError } = await createProductDetails({
        id: productId,
        price,
        brand_name: brand.name,
        website_link: website,
        location,
        qr_code_url: qrCodeUrl,
        model_url: usdzPublicUrl,
      });

      if (productDetailsError) {
        return res.status(500).json({ error: productDetailsError.message });
      }

      res.status(200).send({
        message: "Files uploaded successfully",
        usdzUrl: usdzPublicUrl,
        glbUrl: glbPublicUrl,
        qrCodeUrl,
        imageUrl: imagePublicUrl,
        productUrl,
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

const BUCKET_WHITELIST = ["user-images", "product-images", "product-qr-codes"];

router.get("/bucket/:bucket/:imageName", async (req, res) => {
  const { bucket, imageName } = req.params;

  if (!BUCKET_WHITELIST.includes(bucket)) {
    return res.status(403).send("Access to this bucket is not allowed.");
  }

  if (!imageName) {
    return res.status(404).send("Image not found!");
  }

  const fullImageUrl = `${SUPABASE_BASE_URL}/${bucket}/${imageName}`;

  try {
    const response = await axios.get(fullImageUrl, { responseType: "stream" });

    // Set the correct content-type header from Supabase response
    res.setHeader("Content-Type", response.headers["content-type"]);

    // Pipe the image stream to the client
    response.data.pipe(res);
  } catch (error) {
    console.error("Failed to fetch image:", error.message);
    res.status(500).send("Failed to fetch image.");
  }
});

module.exports = router;
