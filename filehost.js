// mkcert
// mkcert 192.168.18.188 localhost

const express = require("express");
const fs = require("fs");
const https = require("https");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 8002;
// const LOCAL_IP = "192.168.100.234"; // Replace with your local IP
const LOCAL_IP = "192.168.18.188"; // Replace with your local IP

// Load mkcert SSL certificate and key
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

// Enable CORS for all origins (adjust as needed)
app.use(cors());

// Set headers to bypass tunnel reminder and browser warning
app.use((req, res, next) => {
  res.setHeader("bypass-tunnel-reminder", "true");
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

// Serve files from 'public' folder
app.use(
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".usdz")) {
        res.setHeader("Content-Type", "model/gltf-binary");
      }
    },
  })
);

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running at https://${LOCAL_IP}:${PORT}`);
});
