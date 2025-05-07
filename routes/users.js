const express = require("express");
const router = express.Router();
const fs = require("fs");
const userService = require("../services/userService");
const {
  uploadUserImageToSupabase,
  deleteImageFromSupabase,
} = require("../services/uploadService");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  const { data, error } = await userService.getAllUsers();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/allow-customer-login/:username/:password", async (req, res) => {
  const { data, error } = await userService.allowLogin(
    req.params.username,
    req.params.password,
    "customer"
  );
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/allow-seller-login/:username/:password", async (req, res) => {
  const { data, error } = await userService.allowLogin(
    req.params.username,
    req.params.password,
    "seller"
  );
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/user-id/:id", async (req, res) => {
  const { data, error } = await userService.getUserById(req.params.id);
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.put("/user-id/:id", async (req, res) => {
  const { data, error } = await userService.updateUser(req.params.id, req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete("/delete/:id", async (req, res) => {
  const { error } = await userService.deleteUser(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

const handleUserCreation = async (req, res, userType) => {
  const table = userType === "customer" ? "users" : "brands";

  const { username, password, email, phone, name } = req.body;
  const image = req.file;

  if (!username || !password || !image) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const imageName = `${username}-${userType}`;

  try {
    const imageUrl = await uploadUserImageToSupabase(image.path, imageName);
    fs.unlinkSync(image.path);

    const { data, error } = await userService.createUser(
      {
        name,
        username,
        password,
        email,
        phone,
        image_url: imageUrl,
      },
      table
    );

    if (error) {
      await deleteImageFromSupabase(imageUrl);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

router.post("/create-customer", upload.single("image"), (req, res) =>
  handleUserCreation(req, res, "customer")
);

router.post("/create-seller", upload.single("image"), (req, res) =>
  handleUserCreation(req, res, "seller")
);

module.exports = router;
