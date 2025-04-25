const express = require("express");
const router = express.Router();
const productService = require("../services/productService");

router.get("/", async (req, res) => {
  const { data, error } = await productService.getAllProducts();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { data, error } = await productService.getProductById(req.params.id);
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.post("/", async (req, res) => {
  const { data, error } = await productService.createProduct(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put("/:id", async (req, res) => {
  const { data, error } = await productService.updateProduct(
    req.params.id,
    req.body
  );
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete("/:id", async (req, res) => {
  const { error } = await productService.deleteProduct(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

module.exports = router;
