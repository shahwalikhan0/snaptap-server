const QRCode = require("qrcode");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

const logoPath = path.join(__dirname, "logo.png"); // Path to the logo

// Function to generate QR code with logo
const generateQRCode = async (url) => {
  try {
    // Generate the QR code as an image (base64)
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 2,
    });

    // Create a canvas to draw the QR code and logo
    const canvas = createCanvas(300, 300);
    const ctx = canvas.getContext("2d");

    // Load the QR code image
    const qrCodeImage = await loadImage(qrCodeDataUrl);

    // Draw the QR code onto the canvas
    ctx.drawImage(qrCodeImage, 0, 0, 300, 300);

    // Load the logo image
    const logoImage = await loadImage(logoPath);

    // Calculate the position of the logo to be centered in the QR code
    const logoSize = 50; // Logo size
    const logoX = (canvas.width - logoSize) / 2;
    const logoY = (canvas.height - logoSize) / 2;

    // Draw the logo on top of the QR code
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

    // Save the final image to a file
    const outputFilePath = path.join(__dirname, "qr-code.png");
    const out = fs.createWriteStream(outputFilePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on("finish", () => {
      console.log("QR code with logo saved as qr-code.png");
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
};

// Call the function with the URL you want to encode
generateQRCode("https://snaptap-server.vercel.app/shah-123");
