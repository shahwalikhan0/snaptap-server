const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { convertUsdzToGlb } = require("./services/convertService");
const { uploadFileToSupabase } = require("./services/uploadService");

const app = express();

const modelViewerRoutes = require("./routes/models");
const apiRoutes = require("./routes/api");
const productRoutes = require("./routes/products");
const brandRoutes = require("./routes/brands");
const userRoutes = require("./routes/users");

app.use(express.static(__dirname));
app.use("/", modelViewerRoutes);
app.use("/api", apiRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/users", userRoutes);

// Upload logic
const uploadDir = "uploads";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

app.post("/upload-usdz-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    console.log("File uploaded:", req.file);
    const uploadedPath = req.file.path;

    const glbPath = await convertUsdzToGlb(uploadedPath);

    const brandName = "newshah";
    const brandId = 1;
    const productId = 123;

    const usdzPublicUrl = await uploadFileToSupabase(
      uploadedPath,
      brandName,
      brandId,
      productId,
      "usdz"
    );
    const glbPublicUrl = await uploadFileToSupabase(
      glbPath,
      brandName,
      brandId,
      productId,
      "glb"
    );

    res.status(200).send({
      message: "Files uploaded successfully",
      usdzUrl: usdzPublicUrl,
      glbUrl: glbPublicUrl,
    });
  } catch (error) {
    console.error("Error during conversion:", error);
    res.status(500).send("Conversion failed: " + error.message);
  }
});

app.get("/", (req, res) => {
  res.send("SnapTap backend is running.");
});

// Start server here
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
