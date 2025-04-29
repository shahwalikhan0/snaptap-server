const QRCode = require("qrcode");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const { uploadQRCodeToSupabase } = require("../services/uploadService"); // Adjust the path as necessary

const logoPath = path.join(__dirname, "logo.png");

async function generateAndUploadQRCode(url, productSuffixPath = "shah") {
  try {
    // Step 1: Generate QR Code Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 2,
    });

    // Step 2: Create Canvas and Draw QR Code
    const canvas = createCanvas(300, 300);
    const ctx = canvas.getContext("2d");

    const qrCodeImage = await loadImage(qrCodeDataUrl);
    ctx.drawImage(qrCodeImage, 0, 0, 300, 300);

    //3a
    // Step 3: Draw Text at Center of QR Code
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const text = "SNAPTAP";
    const letterSpacing = 34;
    const textWidth = (text.length - 1) * letterSpacing;
    let startX = (canvas.width - textWidth) / 2;

    // Adjust padding and background box
    const horizontalPadding = 20; // increased horizontal padding
    const verticalPadding = 10; // optional vertical padding
    const bgHeight = 36 + verticalPadding * 2; // match font size + vertical padding

    ctx.fillStyle = "#FFFFFF"; // white background
    ctx.fillRect(
      startX - horizontalPadding,
      canvas.height / 2 - bgHeight / 2,
      textWidth + horizontalPadding * 2,
      bgHeight
    );

    // Draw text on top
    ctx.fillStyle = "#00A8DE";
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], startX + i * letterSpacing, canvas.height / 2);
    }

    // Draw text on top
    ctx.fillStyle = "#00A8DE";
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], startX + i * letterSpacing, canvas.height / 2);
    }
    // Step 4: Convert Canvas to Buffer
    const buffer = canvas.toBuffer("image/png");

    // Step 5: Write buffer to a temporary file (needed because supabase upload uses file path)
    const tempPath = path.join(__dirname, `${productSuffixPath}-qrcode.png`);
    fs.writeFileSync(tempPath, buffer);

    // Step 6: Upload the temp file to Supabase
    const publicUrl = await uploadQRCodeToSupabase(tempPath, productSuffixPath);

    // Step 7: Clean up: delete the temporary local file
    fs.unlinkSync(tempPath);

    console.log("QR Code uploaded successfully to:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error generating and uploading QR code:", error);
    throw new Error("QR Code generation/upload failed");
  }
}

module.exports = { generateAndUploadQRCode };
