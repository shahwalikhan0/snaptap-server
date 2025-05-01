const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

router.get("/", async (req, res) => {
  const { data, error } = await userService.getAllUsers();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/allow-customer-login/:username/:password", async (req, res) => {
  const { data, error } = await userService.allowCustomerLogin(
    req.params.username,
    req.params.password
  );
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/allow-seller-login/:username/:password", async (req, res) => {
  const { data, error } = await userService.allowSellerLogin(
    req.params.username,
    req.params.password
  );
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { data, error } = await userService.getUserById(req.params.id);
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.post("/", async (req, res) => {
  const { data, error } = await userService.createUser(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put("/:id", async (req, res) => {
  const { data, error } = await userService.updateUser(req.params.id, req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete("/:id", async (req, res) => {
  const { error } = await userService.deleteUser(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

module.exports = router;
