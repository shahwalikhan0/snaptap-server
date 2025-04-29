// services/convertService.js
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const outputDir = "converted";

// Convert USDZ to GLB using Blender
async function convertUsdzToGlb(modelFile) {
  return new Promise((resolve, reject) => {
    if (!modelFile || !modelFile.path) {
      return reject(new Error("Invalid modelFile provided for conversion."));
    }

    const usdzPath = modelFile.path;
    const filename = path.basename(usdzPath, path.extname(usdzPath));
    const glbPath = path.join(outputDir, `${filename}.glb`);

    fs.mkdirSync(outputDir, { recursive: true });

    if (fs.existsSync(glbPath)) {
      return reject(new Error(`GLB file already exists: ${glbPath}`));
    }

    const blenderCommand = `blender --background --python scripts/convert_usdz_to_glb.py -- "${usdzPath}" "${glbPath}"`;

    exec(blenderCommand, (error, stdout, stderr) => {
      console.log(stdout);

      if (error) {
        console.error("Blender error:", stderr);
        return reject(
          new Error(`Conversion failed: ${stderr || error.message}`)
        );
      }

      if (!fs.existsSync(glbPath)) {
        return reject(new Error("GLB file was not created"));
      }

      resolve(glbPath);
    });
  });
}

module.exports = {
  convertUsdzToGlb,
};
