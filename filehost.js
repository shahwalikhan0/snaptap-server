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

// Serve files from 'uploads' folder
app.use(
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".usdz")) {
        res.setHeader("Content-Type", "model/gltf-binary");
      }
    },
  })
);

// Endpoint to serve model data from models.json
app.get("/modelData", (req, res) => {
  const modelsFilePath = path.join(__dirname, "uploads", "models.json");

  // Check if the file exists
  if (!fs.existsSync(modelsFilePath)) {
    return res.status(404).json({ error: "models.json file not found" });
  }

  // Read the file and send its contents as JSON
  fs.readFile(modelsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading models.json:", err);
      return res.status(500).json({ error: "Failed to read models.json" });
    }

    try {
      const models = JSON.parse(data);
      res.json(models);
    } catch (parseError) {
      console.error("Error parsing models.json:", parseError);
      res.status(500).json({ error: "Failed to parse models.json" });
    }
  });
});

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running at https://${LOCAL_IP}:${PORT}`);
});
